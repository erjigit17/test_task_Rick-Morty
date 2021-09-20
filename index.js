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
          characters = body.info.count
        })
        .then(() => {
          parser()})
}

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))}

let arr = []

async function parser() {
    for (let i = 1; i <= characters; i++) {
      await sleep(55)
      
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
    await sleep(5000)
    if (arr.length !== characters) {
      console.log(`time's up, received only ${arr.length}  of ${characters}, please slow down the speed and try again`)
    } else { startWritingToDB() }
}

getCount()


// const client = new pg.Client("postgres://candidate:62I8anq3cFq5GYh2u4Lh@rc1c2m0keqdcncuwizmx.mdb.yandexcloud.net:6432/db1?ssl=true");

const TABLENAME = 'erjigit17'

const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  database: 'erjigit',
  user: 'erjigit',
  password: '',
})




async function startWritingToDB(){
  arr.sort((a, b) => (a.id > b.id) ? 1 : -1)
  let count = 0
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
    await sleep(500)
    // let a = `INSERT INTO erjigit17 (name, body) VALUES ('Rick Sanchez', '{"id":1,"name":"Rick Sanchez","status":"Alive","species":"Human","type":"","gender":"Male"}');`

      for (let i = 0; i <= characters; i++) {
        await sleep(1000)
        console.log('>>>>> ')
        let command = 
        `INSERT INTO ${TABLENAME} (name, body) VALUES ('${arr[i].name}', '${JSON.stringify(arr[i].body)}');` 
        // console.log(command)
        client.query(command, (err, res) => {
        if (err) {
          throw new Error('Insert data failed:' + err)
        } else { 
          count++ 
          console.log(count)
        }
        })  
  } 
  await sleep(10000)
  // client.end()
}
