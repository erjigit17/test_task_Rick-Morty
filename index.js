'use strict';

const https = require('https')
const { Pool } = require('pg')

const PORT = process.env.PORT || 3000
const URL = 'https://rickandmortyapi.com/api/character/'
const TABLENAME = 'erjigit17'

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'erjigit',
  user: 'erjigit',
  password: '',
})

const executingСommands = (command) => {
  pool.query(command, (err, res) => {
    if (err) { throw err }
    console.dir({res})
    console.table(res.fields)
    console.table(res.rows)
    pool.end()
  })
}

const dropTable = () => {
  executingСommands(`DROP TABLE IF EXISTS ${TABLENAME}; `)}



const createTable = () => {
  executingСommands(
    `CREATE TABLE ${TABLENAME} (
    id SERIAL PRIMARY KEY,
    name text,
    body jsonb
  );`)
}



const insert = () => {
  let id = 1  // 
  let stop = false // stop flag

  while (!stop && id < 2 ) {
    https.get(URL + id, (res) => {
      let json = ''
      res.on('data', function (chunk) {
          json += chunk
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
              let data = JSON.parse(json)
              let body = JSON.stringify(data)
              executingСommands(`INSERT INTO ${TABLENAME} (name, body)
              VALUES('${data.name}', '${body}')`)
          } catch (e) {
              console.log('Error parsing JSON!')
          }
        } else {
            console.log('Status:', res.statusCode)
        }
      })
    }).on('error', function (err) {
        console.log('Error:', err)
    })
    id++
  }
}

insert()
// dropTable()
// createTable()
