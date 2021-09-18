'use strict'

const { Client } = require('pg')
const https = require('https')
const URL = 'https://rickandmortyapi.com/api/character'

// const client = new pg.Client("postgres://candidate:62I8anq3cFq5GYh2u4Lh@rc1c2m0keqdcncuwizmx.mdb.yandexcloud.net:6432/db1?ssl=true");

const TABLENAME = 'erjigit17'

const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  database: 'erjigit',
  user: 'erjigit',
  password: '',
})

client.connect()

// drop and create DB
client
  .query(
    `DROP TABLE IF EXISTS ${TABLENAME};` +
      `CREATE TABLE IF NOT EXISTS ${TABLENAME} (
          id SERIAL PRIMARY KEY,
          name text,
          body jsonb
        );`
  )
  .then((result) => console.log(result))
  .catch((e) => console.error(e.stack))

function getCharactersData() {
  return new Promise((resolve, reject) => {
    https.get(URL, async (response) => {
      const chunks = []
      for await (const chunk of response) {
        chunks.push(chunk)
      }
      resolve(Buffer.concat(chunks).toString())
    })
  })
}

function storeCharactersData(jsonData) {
  const { results } = JSON.parse(jsonData)

  let command = `INSERT INTO ${TABLENAME} (name, body)VALUES${results
    .map(
      (
        r 
      ) =>// resolve bag with error #42601
        `('${r.name}', '{"id": ${r.id}, "name": "${r.name}", "status": "${
          r.status
        }", "species": "${r.species}", "type": "${r.type}", "gender": "${
          r.gender
        }", "origin": {"name": "${r.origin.name}", "url": "${
          r.origin.url
        }"}, "image": "${r.image}", "episode": ${JSON.stringify(
          r.episode
        )}, "url": "${r.url}", "created": "${r.created}" }')`
    )
    .join(', ')};`

  client.query(command, (err, res) => {
    if (err) {
      throw err
    }
    console.dir({ res })
    client.end()
  })
}

getCharactersData().then(storeCharactersData)

// front================================================

const fs = require('fs')
const http = require('http')
const PORT = process.env.PORT || 3000

const index = fs.readFileSync('./index.html')
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.end(index)
}).listen(PORT, () => {console.log(`listening port: ${PORT}`)})

