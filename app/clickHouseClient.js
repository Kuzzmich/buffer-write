const config = require('config');
const axios = require('axios');


const query = async (query) => {
  const url = `${config.clickHouse.host}:${config.clickHouse.port}?query=${query}`;
  const res = await axios.post(url);
  return res.data;
};

// init database on app start
query(`CREATE DATABASE IF NOT EXISTS ${config.clickHouse.dbName}`)
  .then(() => console.log(`created database ${config.clickHouse.dbName}`));

module.exports = {
  query,
};
