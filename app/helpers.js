const config = require('config');
const clickhouse = require('./clickHouseClient');
const redis = require('./redisClient');

const checkIfTableExists = async (tableName) => {
  await clickhouse
    .query(`CREATE TABLE IF NOT EXISTS ${tableName} (
      name VARCHAR,
      surname VARCHAR,
      age INT
    ) ENGINE = Memory`);
};

const processCollectionToDB = async (keys) => {
  const data = await redis.mget(keys);
  const parsedData = data.map(d => JSON.parse(d));

  // accumulate all data objects by table name
  const reducedData = parsedData.reduce((accum, val) => {
    const existingTableObj = accum.find(ad => ad.table === val.table);
    if (existingTableObj) {
      existingTableObj.dataSet.push(val.data);
    } else {
      accum.push({
        table: val.table,
        dataSet: [val.data]
      });
    }
    return accum;
  }, []);

  // generate query string for each of the tables and run insert query
  const queryPromises = [];
  for (let i = 0; i < reducedData.length; i++) {
    const data = reducedData[i];
    const table = `${config.clickHouse.dbName}.${data.table}`;

    await checkIfTableExists(table);

    const insertData = data.dataSet.map(ds => JSON.stringify(ds)).join(' ');
    const query = `INSERT INTO ${table} FORMAT JSONEachRow ${insertData}\n`;
    queryPromises.push(clickhouse.query(query));
  }
  await Promise.all(queryPromises);

  console.log(`processed ${keys.length} objects`);

  // remove processed data from redis
  await redis.del(...keys);
};

module.exports = {
  processCollectionToDB
};
