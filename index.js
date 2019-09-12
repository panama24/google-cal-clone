const express = require('express');
const path = require('path');

// use process.env vars to keep private variables
require('dotenv').config();

// Express middleware
const helmet = require('helmet'); // creates headers that protect against attacks
const bodyParser = require('body-parser'); // transform response into usable format
const cors = require('cors'); // allows/disallows cross-site communication
const morgan = require('morgan'); // logs requests

// db connection with heroku
/* const db = require('knex')({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  },
}); */

// db connection with localhost
// var db = require('knex')({
  // client: 'pg',
  // connection: {
    // host: '127.0.0.1',
    // user: '',
    // password: '',
    // database: 'calendar_api'
  // },
// });


// Controllers - db queries
const main = require('./controllers/main');

// App
const app = express();

// App middleware
const whitelist = ['http://localhost:5000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(morgan('combined')); // use tiny or combined
//
// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')))
// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

// App routes - Auth
app.get('/api/', (req, res) => res.send('hello world!'));
app.get('/api/events', (req, res) => main.getEvents(req, res, db));
app.post('/api/events', (req, res) => main.postEvents(req, res, db));
app.put('/api/events', (req, res) => main.putEvents(req, res, db));
app.delete('/api/events', (req, res) => main.deleteEvents(req, res, db));

// App server connection
app.listen(process.env.PORT || 5000, () => {
  console.log(`app is running on port ${process.env.PORT || 5000}`);
});

