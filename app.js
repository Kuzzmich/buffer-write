const port = process.env.port || 8008;
const express = require('express');
const http = require('http');
const app = express();
const api = require('./app/api.js');

const cors = require('cors');

app.use(cors());

app.use(api);


const httpServer = http.createServer(app);
httpServer.listen(port, function () {
    console.log('Listening on port %d', httpServer.address().port);
});

module.exports = app;
