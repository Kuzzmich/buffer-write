const config = require('config');
const Queue = require('bull');
const redis = require('./redisClient');
const helpers = require('./helpers');


const postQueue = new Queue(
  'postClickHouse',
  `${config.redisUrl}/0`,
  {
    guardInterval: 5000,
  }
);

// queue job handler
postQueue.process(async (job, done) => {
  const keys = await redis.fullscan('*');
  if (keys.length > 0) {
    await helpers.processCollectionToDB(keys);
  }
  console.log(`processed ${keys.length} objects`);

  done();
});

const cleanQueue = async () => {
  await Promise.all([
    postQueue.clean(0, 'delayed'),
    postQueue.clean(0, 'wait'),
    postQueue.clean(0, 'active'),
    postQueue.clean(0, 'completed'),
    postQueue.clean(0, 'failed'),
  ]);

  let multi = postQueue.multi();
  multi.del(postQueue.toKey('repeat'));
  await multi.exec();
};

const startPostingQueue = async () => {
  await cleanQueue();

  if (config.maxTimeDelay) { // start cron if only delay time is not 0
    postQueue.add(
      {},
      {
        delay: 3000,
        removeOnComplete: true,
        removeOnFail: true,
        repeat: {cron: `*/${config.maxTimeDelay} * * * * *`}
      }
    );
  }
};

module.exports = {
  queue: postQueue,
  startPostingQueue: startPostingQueue,
};
