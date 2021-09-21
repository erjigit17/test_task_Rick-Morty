const { Client } = require('pg')
const config = require('./config')



const client = new Client(config.postgre)
client.connect()
// drop and create DB
client
  .query(
    `DROP TABLE IF EXISTS ${config.tableName};` +
    `CREATE TABLE IF NOT EXISTS ${config.tableName} (
          id SERIAL PRIMARY KEY,
          name text,
          body text
        );`
  )
  .then((result) => console.log(result))
  .catch((e) => console.error(e.stack))
  await sleep(500)



let command = 
      `INSERT INTO ${config.tableName} (name, body) VALUES ('${arr[i].name}', '${JSON.stringify(arr[i].body)}');` 

client.query(command, (err, res) => {
  if (err) {
    throw new Error('Insert data failed:' + err)
  } else { 
    count++ 
    console.log(count)
  }
  })  