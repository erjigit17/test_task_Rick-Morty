'use strict'

const { Client } = require('pg')
const https = require('https')
const fs = require('fs')
const URL = 'https://rickandmortyapi.com/api/character'

function get_data(url) {
  return new Promise((resolve) => {
    https.get(url, async (response) => {
      const chunks = []
      for await (const chunk of response) {
        chunks.push(chunk)
      }
      resolve(Buffer.concat(chunks).toString())
    })
  })
}

// get count of characters
let characters = 0
function getCount(){
  get_data(URL)
        .then((jsonData) => {
          const data = JSON.parse(jsonData)
          return data
        })
        .then((body) => {
          characters = 2//body.info.count
        })
        .then(() => {
          parser()})
}



let arr = []

async function parser() {
  let parsingEnd = false

  for (let i = 1; i <= characters; i++) {
    await sleep(88)
    
    get_data(`${URL}/${i}`)
    .then((jsonData) => {
      const data =  JSON.parse(jsonData)
      return data
    })
    .then((body) => {
      arr.push({id: body.id, name: body.name, body})
      console.log(body.id)
    })
  }
  while(!parsingEnd) {
    await sleep(100)
    if (arr.length === characters) {
      cleanDB()
    parsingEnd = true
    }
  }

  await sleep(15000)
  if(!parsingEnd) {
  console.log(`time's up, received only ${arr.length} of ${characters}, please slow down the speed and try again`)
  }
}
getCount()
const TABLENAME = 'erjigit17'
const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  database: 'erjigit',
  user: 'erjigit',
  password: '',
})

// const client = new Client("postgres://candidate:62I8anq3cFq5GYh2u4Lh@rc1c2m0keqdcncuwizmx.mdb.yandexcloud.net:6432/db1?ssl=true");

function cleanDB() {
  client.connect()
  // drop and create DB
  let command = 
    `DROP TABLE IF EXISTS ${TABLENAME};` +
    `CREATE TABLE IF NOT EXISTS ${TABLENAME} (
          id SERIAL PRIMARY KEY,
          name text,
          body text
        );`
  
  client.query(command, (err, res) => {
    if (err) throw err
    console.log(res)

    startWritingToDB()
  })
}

async function startWritingToDB(){
  arr.sort((a, b) => (a.id > b.id) ? 1 : -1)
  
  let command = `INSERT INTO ${TABLENAME} (name, body)VALUES${arr
    .map((item) =>
        `('${item.name}', '${JSON.stringify(item.body)}')`)
    .join(', ')};`

  client.query(command, (err, res) => {
    if (err) throw err
    console.log(res.command, res.rowCount)
    
  })
  {await sleep(50000)
  client.end()}
}




