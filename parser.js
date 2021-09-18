'use strict'

const { Client } = require('pg')
const EventEmitter = require('events')
const https = require('https')
const fs = require('fs')
const URL = 'https://rickandmortyapi.com/api/character'

// 
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

async function getCount(){
  get_data(URL)
        .then((jsonData) => {
          const data = JSON.parse(jsonData)
          return data
        })
        .then((body) => {
          let pages = body.info.count
          return pages
        })
        .then((pages) => {
          parser(pages)})
}

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))}

let arr = [], count = 0, finish = false;
function parser(pages) {

  const slowing_down = async () => {
    await sleep(50)

    for (let i = 1; i < pages; i++) {
        get_data(`${URL}/${i}`)
          .then((jsonData) => {
            const data = JSON.parse(jsonData)
            return data
          })
          .then((body) => {
            arr.push({id: body.id, name: body.name, body})
            count++
            console.log(body.id, count)
            if (count + 1 == pages) {
              finish = true
            }
            if(finish){
              apiParsFinishEmitter.emit('event')
              finish = false
            }
          })
    }
  }
  slowing_down()
}

getCount()

//====================== Database ==============================
const apiParsFinishEmitter = new EventEmitter();
apiParsFinishEmitter.on('event', () => {
  console.log('======   parsing finished  ======= ')
  startWritingToDB()
});

// const client = new pg.Client("postgres://candidate:62I8anq3cFq5GYh2u4Lh@rc1c2m0keqdcncuwizmx.mdb.yandexcloud.net:6432/db1?ssl=true");

const TABLENAME = 'erjigit17'

const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  database: 'erjigit',
  user: 'erjigit',
  password: '',
})




function startWritingToDB(){
  arr.sort((a, b) => (a.id > b.id) ? 1 : -1)
  // client.connect()
  // // drop and create DB
  // client
  //   .query(
  //     `DROP TABLE IF EXISTS ${TABLENAME};` +
  //     `CREATE TABLE IF NOT EXISTS ${TABLENAME} (
  //           id SERIAL PRIMARY KEY,
  //           name text,
  //           body text
  //         );`
  //   )
  //   .then((result) => console.log(result))
  //   .catch((e) => console.error(e.stack))


    for (let i = 0; i < 2; i++) {
      let command = `INSERT INTO ${TABLENAME} (name, body) VALUES ('${arr[i].name}', '${JSON.stringify(arr[i].body)}');` 
      // console.log(command)
      fs.writeFileSync('./parsedData.json', command)
  //     client.query(command, (err, res) => {
  //     if (err) {
  //       throw err
  //     }
  //     console.dir({ res })
  //   client.end()
  //   })

  }
}


  // let command = `INSERT INTO ${TABLENAME} (name, body) VALUES ${arr.map((item) => `('${item.name}', '${JSON.stringify(item.body)}')`).join(', ')};`   
  // fs.writeFileSync('./parsedData.json', command)


  // console.log(command)

  // client.query(command, (err, res) => {
  //   if (err) {
  //     throw err
  //   }
  //   console.dir({ res })
  //   client.end()
  // })
  // client.end()
// }
