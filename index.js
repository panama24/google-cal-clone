const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

// knex doesn't set the ssl default in pg
var pg = require('pg');
pg.defaults.ssl = true;

require('dotenv').config();

// db connection with heroku
const db = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL,
});


const app = express();


// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')))

app.get('/api/events', (req, res) => {
  db.select('*').from("events")
    .then(e => {
      if (e.length) {
        res.json(e);
      } else {
        res.json([]);
      }
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({ dbError: 'db error' })
    });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.post('/api/events', (req, res) => {
  const {
    description,
    endDateTime: end_date_time,
    startDateTime: start_date_time,
    title,
    type,
  } = req.body;
  db('events').insert({
    description,
    end_date_time,
    start_date_time,
    title,
    type,
  })
    .returning('*')
    .then(e => {
      res.json(e);
    })
    .catch(err => res.status(400).json({ dbError: 'db error' }));
});

app.put('/api/events', (req, res) => {
  const {
    id,
    description,
    end_date_time,
    start_date_time,
    title,
    type,
  } = req.body;
  db('events')
    .where({ id })
    .update({
      description,
      end_date_time,
      start_date_time,
      title,
      type,
    })
    .returning('*')
    .then(e => {
      res.json(e);
    })
    .catch(err => res.status(400).json({ dbError: 'db error' }));
});

// app.delete('/api/events', (req, res) => main.deleteEvents(req, res, db));
app.delete('/api/events', (req, res) => {
  const { id } = req.body;
  db('events').where({ id }).del()
    .then(() => {
      res.json({ delete: 'true' });
    })
    .catch(err => res.status(400).json({ dbError: 'db error' }));
});

// App server connection
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
