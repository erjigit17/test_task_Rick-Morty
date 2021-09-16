const { Pool } = require('pg')
const axios = require('axios')
const https = require('https')
const { resolve } = require('path')
const URL = 'https://rickandmortyapi.com/api/character'

const TABLENAME = 'erjigit17'

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'erjigit',
  user: 'erjigit',
  password: '',
})
function getCharactersData() {
  return new Promise((resolve, reject) => {
    https.get(URL, async response => {
      const chunks = []
      for await (const chunk of response) {
        chunks.push(chunk)
      }
      resolve(Buffer.concat(chunks).toString())
    })
  })
}
function storeCharactersData(jsonData) {
  const {results} = JSON.parse(jsonData)

  let command = `INSERT INTO ${TABLENAME} (name, body)
    VALUES${results.map(result => `('${result.name}', '${JSON.stringify(results)}')`).join(', ')}; `
  console.log(command)
  pool.query(command, (err, res) => {
    if (err) { throw err }
    // console.dir({res})
    pool.end()
  })
}

getCharactersData().then(storeCharactersData)