'use strict'

const https = require('https')
const fs = require('fs')
const URL = 'https://rickandmortyapi.com/api/character'


async function get_data(url) {
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
          return body.info.count
        })
        .then((count) => {
          let pages = Array.from({length: count}, (_, i) => i + 1)
          return pages})
}


export { getCount }