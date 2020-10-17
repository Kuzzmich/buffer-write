const express = require('express');
const router = express.Router();
const config = require('config');
const {v4: uuid} = require('uuid');
const redis = require('./redisClient');
const helpers = require('./helpers');


router.get('/', async (req, res) => {
  res.send('api is running');
});

router.post('/post-data', async (req, res, next) => {
  try {
    const responseData = {
      collectionCleared: false
    };

    const data = req.body;
    await redis.set(uuid(), JSON.stringify(data));

    const keys = await redis.fullscan('*');
    let dataLength = keys.length;
    if (dataLength >= config.maxMessagesCount) {
      await helpers.processCollectionToDB(keys);
      dataLength = 0;
      responseData.collectionCleared = true;
    }

    responseData.dataLength = dataLength;
    res.send(responseData);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
