const config = require('config');
const Queue = require('bull');


const writeQueue = new Queue(
  'scrapers',
  config.redisUrl,
  {
    guardInterval: 30000,
    limiter: {
      max: 1,
      duration: 180000,
    }
  }
);

writeQueue.process(async (job, done) => {
  const parserName = job.data.parserName;
    await scraper.scrapeData(parserName,true);

    const currentParserIndex = parsersList.findIndex(s => s === parserName);
    const nextParser = parsersList[currentParserIndex + 1] || parsersList[0];

    console.log(`${getTime()} - Posting new ${nextParser.toUpperCase()} parsing job to queue`);
    writeQueue.add(
      {parserName: nextParser},
      {delay: 180000, attemps: 1, removeOnComplete: true, removeOnFail: true}
    );

    done();
});

module.exports = {
  queue: writeQueue,
};
