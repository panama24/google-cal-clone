const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

const main = require('./controllers/main');

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')))

app.get('/api/events', cors(), async (req, res, next) => {
  try {
    res.json([1,2, 3, 4]);
  } catch (err) {
    next(err);
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// app.post('/api/events', (req, res) => main.postEvents(req, res, db));
// app.put('/api/events', (req, res) => main.putEvents(req, res, db));
// app.delete('/api/events', (req, res) => main.deleteEvents(req, res, db));

// App server connection
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
