const config = require('config');
const { promisify } = require('util');
const redis = require('redis');
const client = redis.createClient({
  url: `${config.redisUrl}/1`
});


const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);
const scanAsync = promisify(client.scan).bind(client);
const mgetAsync = promisify(client.mget).bind(client);

const fullscan = async (pattern) => {
  let cursor = '0';
  let keys = [];

  do {
    const res = await scanAsync(cursor, 'MATCH', pattern, 'COUNT', '100');
    cursor = res[0];
    keys.push(...res[1]);
  } while (cursor !== '0');

  keys = [... new Set(keys)]; // distinct the array
  return keys;
};

module.exports = {
  get: getAsync,
  set: setAsync,
  scan: scanAsync,
  mget: mgetAsync,
  del: delAsync,
  fullscan: fullscan,
};
