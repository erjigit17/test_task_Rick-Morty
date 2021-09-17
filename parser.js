'use strict'

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

let pages = []
for (let i = 1; i <= 671; i++) {
  pages.push(i)
}


const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

let promisesArr = []

function main() {

  fs.writeFileSync('./parsedData.json', ``, (err) => {
    if (err) throw err
    console.log('Saved!')
  })

  const slowing_down = async () => {
    await sleep(500)

    for (let i = 0; i < 2; i++) {
      promisesArr.push(
        get_data(`${URL}/${pages[i]}`)
          .then((jsonData) => {
            const data = JSON.parse(jsonData)
            return data
          })
          .then((body) => {
            fs.appendFile(
              './parsedData.json',
              `${JSON.stringify(body)}, `,
              (err) => {
                if (err) throw err
                console.log('Saved!')
              }
            )
          })
      )
    }
  }
  slowing_down()
}


// Promise.all(promisesArr).then((jsonData)=> {
//   const data = JSON.parse(jsonData)
//   console.log(data)
// })
Promise.allSettled(promisesArr).
  then((results) => results.forEach((result) => console.log(result.status)))

main()