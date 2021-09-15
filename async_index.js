'use strict';

const { Client } = require('pg')
const https = require('https')
const PORT = process.env.PORT || 3000
const URL = 'https://rickandmortyapi.com/api/character/'

const TABLENAME = 'erjigit17'

const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  database: 'erjigit',
  user: 'erjigit',
  password: '',
})


async function execute(command) {
  await client.connect()
  console.log('Connected to  DB')
  await client.query(command)
  await client.end()
}


const dropTable = () => {
  execute(`DROP TABLE IF EXISTS ${TABLENAME};`)}

const createTable = () => {
  execute(
    `CREATE TABLE IF NOT EXISTS ${TABLENAME} (
    id SERIAL PRIMARY KEY,
    name text,
    body jsonb
  );`)
}

const insert = () => {
  let id = 1  // 
  let stop = false // stop flag

  while (!stop && id < 3 ) {
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
              execute(`INSERT INTO ${TABLENAME} (name, body)
                    VALUES('${data.name}', '${body}'); `)
          } catch (e) {
              console.log('Error parsing JSON!')
              stop = true
          }
        } else {
            console.log('Status:', res.statusCode)
            stop = true
        }
      })
    }).on('error', function (err) {
        console.log('Error:', err)
        stop = true
    })
    id++
  }
}

insert()
// dropTable()
// createTable()
