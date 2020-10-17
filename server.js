const port = process.env.port || 8008;
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const config = require('config');
const app = express();
const cors = require('cors');
const api = require('./app/api.js');
const postQueue = require('./app/postQueue');


console.log('config: ', config);

app.use(cors());
app.use(bodyParser.json());

app.use('/api', api);

app.use(async (error, req, res) => {
  console.log(error);
  res.send('Something went wrong! Try again');
});

const httpServer = http.createServer(app);
httpServer.listen(port, function () {
    console.log('Listening on port %d', httpServer.address().port);
});


postQueue.startPostingQueue();

module.exports = app;
