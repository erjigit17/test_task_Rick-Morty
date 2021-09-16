'use strict'


const { Pool } = require('pg')
const https = require('https')
const URL = 'https://rickandmortyapi.com/api/character'

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
    if (err) {
      throw err
    }
    console.dir({ res })
    pool.end()
  })
}

const dropTable = () => {
  executingСommands(`DROP TABLE IF EXISTS ${TABLENAME};`)
}

const createTable = () => {
  executingСommands(
    `CREATE TABLE IF NOT EXISTS ${TABLENAME} (
    id SERIAL PRIMARY KEY,
    name text,
    body jsonb
  );`
  )
}

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
      (r) => // resolve bag with error #42601
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

  pool.query(command, (err, res) => {
    if (err) {
      throw err
    }
    console.dir({ res })
    pool.end()
  })
}

getCharactersData().then(storeCharactersData)

const button = document.querySelector('button')

let counter = 0
button.addEventListener('click', function(){
  counter++
  button.textContent = counter
})