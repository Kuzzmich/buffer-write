## Buffer test application

#### It uses:
- `Redis` as buffer storage;
- `bull queue` as a cron job handler for delayed data inserting. It also uses Redis as data storage, but it's set to use
separate redis db from buffer data.

#### Application default settings:
```json
{
  "redisUrl": "redis://127.0.0.1:6379",
  "clickHouse": {
    "host": "http://localhost",
    "port": 32770,
    "dbName": "actors"
  },
  "maxTimeDelay": 30,
  "maxMessagesCount": 10
}
```
You can reassign this values by environment variables with names which are shown below: 
```json
{
  "redisUrl": "redisUrl",
  "clickHouse": {
    "host": "chHost",
    "port": "chPort",
    "dbName": "chDbName"
  },
  "maxTimeDelay": "maxTimeDelay",
  "maxMessagesCount": "maxMessagesCount"
}
```

As example if you want to set ClickHouse host value you should run the application in the following way:  
`chHost=https://my-domain.com node server.js` or just set global env variable `chHost` and start the app in regular way.

To start the app install packages using `yarn` or `npm`. Then type `yarn start` or `npm start` or `node server.js` if
you want to run the application with default settings. You don't have to create any databases in clickhouse before
application start. You just have to provide proper clickhouse url address and database will be created automatically. 

Endpoint to post data to `/post-data`.
Data model: 
```json
{
  "table": "actors_identities",
  "data": {
    "name": "Matt",
    "surname": "Damon",
    "age": 45
  }
}
```
Where `table` - table name where data will be inserted and you are able to set any table name you prefer because it will be
created in case if it doesnt't exist, `data` - key/value pairs of inserting data.
<br><br>

#### Few words from the author
I tried to use couple of npm packages for clickhouse, but both of them had the bug with choosing `JSONEachRow` format
for inserted data. So that I've decided to implement small client for clickhouse which runs queries via http.

Possible improvements:
- create not existing tables depending on a data and data types which should be inserted there;
- use some ready made library for clickhouse integration. It might simplify data querying for developers
