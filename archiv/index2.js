'use strict'

const { Client } = require('pg')
const EventEmitter = require('events')
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
          characters = 10//body.info.count
        })
        .then(() => {
          parser()})
}

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))}

let arr = []

async function parser() {
  let parsingEnd = false

  for (let i = 1; i <= characters; i++) {
    await sleep(77)
    
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

function cleanDB() {
  client.connect()
  // drop and create DB
  client
    .query(
      `DROP TABLE IF EXISTS ${TABLENAME};` +
      `CREATE TABLE IF NOT EXISTS ${TABLENAME} (
            id SERIAL PRIMARY KEY,
            name text,
            body text
          );`
    )
    .then((result) => console.log(result))
    .catch((e) => console.error(e.stack))

  startWritingToDB()
}

async function startWritingToDB(){
  arr.sort((a, b) => (a.id > b.id) ? 1 : -1)
    let queryChunks =[], temp =[], count = 0;
    for (let i = 0; i < characters; i++) {
      temp.push(arr[i])
      count++
      if (count == 9 ) {
        queryChunks.push(temp)
        temp = []
        count = 0
      }
    }
    !temp? null : queryChunks.push(temp)
    
  for (const queryChunk of queryChunks) {
      let command = `INSERT INTO ${TABLENAME} (name, body)VALUES${queryChunk
    .map((item) =>
        `('${item.name}', '${JSON.stringify(item.body)}')`)
    .join(', ')};`
    console.log(command)

      // client
      //   .query(command)
      //   .then(res => console.log(res.rows[0]))
      //   .catch(e => console.error(e.stack))
  }
}



