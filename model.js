const { Client } = require('pg')
const config = require('./config')
const fs = require('fs')

const client = new Client(config.postgre)

// client.connect()
// // drop and create DB
// client
//   .query(
//     `DROP TABLE IF EXISTS ${config.tableName};` +
//     `CREATE TABLE IF NOT EXISTS ${config.tableName} (
//           id SERIAL PRIMARY KEY,
//           name text,
//           body text
//         );`
//   )
//   .then((result) => console.log(result))
//   .catch((e) => console.error(e.stack))


let data = fs.readFileSync('./pasredData.json', 'utf8')

let command = JSON.parse(data)
      // `INSERT INTO ${config.tableName} (name, body) VALUES ('${arr[i].name}', '${JSON.stringify(arr[i].body)}');` 
console.log(command[0])
// client.query(command, (err, res) => {
//   if (err) {
//     throw new Error('Insert data failed:' + err)
//   } else { 
//     count++ 
//     console.log(count)
//   }
//   })  

// client.end()