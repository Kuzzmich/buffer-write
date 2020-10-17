const express = require('express');
const router = express.Router();
const config = require('config');
const writeQueue = require('./queues/writeQueue');


router.get('/', async (req, res) => {
  res.send('api is running');
});

module.exports = router;
