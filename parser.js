
const https = require('https')
const fs = require('fs')
const config = require('./config')

let characters = 0

characters === 0 ? getCount() : parser()

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
function getCount(){
  get_data(config.url)
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

let arr = []

async function parser() {
    for (let i = 1; i <= characters; i++) {
      await sleep(50)
      
      get_data(`${config.url}/${i}`)
      .then((jsonData) => {
        const data =  JSON.parse(jsonData)
        return data
      })
      .then((body) => {
        arr.push({id: body.id, name: body.name, body})
        console.log(body.id)
      })
    }
    await sleep(3500)
    if (arr.length !== characters) {
      console.log(`time's up, received only ${arr.length}  of ${characters}, please slow down the speed and try again`)
    } else { writeToFile() }
}

async function writeToFile(){
  arr.sort((a, b) => (a.id > b.id) ? 1 : -1)
  const parseData = `{"characters": [${arr
  .map(item => `{"id": ${item.id}, "name": "${item.name}"}`)
  .join(', ')}]}`

  // console.log(parseData)
  fs.writeFileSync(path.join('./pasredData.json', console))

}

function sleep(milliseconds){
  return new Promise((resolve) => setTimeout(resolve, milliseconds))}