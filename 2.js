const { Pool } = require('pg')
const axios = require('axios')
const https = require('https')
const { resolve } = require('path')
const URL = 'https://rickandmortyapi.com/api/character/'

const TABLENAME = 'erjigit17'

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'erjigit',
  user: 'erjigit',
  password: '',
})
function getCharacterData(id) {
  return new Promise((resolve, reject) => {
    https.get(URL + id, async response => {
      const chunks = []
      for await (const chunk of response) {
        chunks.push(chunk)
      }
      resolve(Buffer.concat(chunks).toString())
    })
  })
}
function storeCharacterData(jsonData) {
  const result = JSON.parse(jsonData)

  let command = `INSERT INTO ${TABLENAME} (name, body)
  VALUES('${result.name}', '${JSON.stringify(result)}');`

  // console.log(command)
  pool.query(command, (err, res) => {
    if (err) { throw err }
    console.dir({res})
    pool.end()
  })
}

function tempJsonCreate {
  
}


for (let i = 1; i < 4; i++ ) {
  getCharacterData(i).then(storeCharacterData)
}
