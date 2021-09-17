'use strict'

const { Client } = require('pg')
const https = require('https')
const fs = require('fs')
const URL = 'https://rickandmortyapi.com/api/character'
const { Client } = require('pg')

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


function parser(pages) {

  fs.writeFileSync('./parsedData.json', ``, (err) => {
    if (err) throw err
    console.log('Saved!')
  })

  const slowing_down = async () => {
    await sleep(500)
    let j = 1
    let arr = []
    for (let i = 1; i < pages; i++) {
        get_data(`${URL}/${i}`)
          .then((jsonData) => {
            const data = JSON.parse(jsonData)
            return data
          })
          .then((body) => {
            fs.appendFile(
              './parsedData.json',`${JSON.stringify(body)}, `,
              (err) => {
                if (err) throw err
                console.log('Saved!', i, j)
                j++
                arr.push({id: body.id, name: body.name})
                if (j == pages ) { startWritingToDB(arr)}

              }
            )
          })
    }
  }
  slowing_down()
}

getCount()

//====================== Database ==============================

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


function startWritingToDB(arr){
  console.log(arr)
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

  // client.query(command, (err, res) => {
  //   if (err) {
  //     throw err
  //   }
  //   console.dir({ res })
  //   client.end()
  // })
}
