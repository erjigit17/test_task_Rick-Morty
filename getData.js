'use strict'

const https = require('https')
const config = require('./config')

function apiFetch(tail='') {
  return new Promise((resolve) => {
    https.get(config.url + tail, async (response) => {
      const chunks = []
      for await (const chunk of response) {
        chunks.push(chunk)
      }
      resolve(JSON.parse(Buffer.concat(chunks).toString()))
    })
  })
}

function getCount(){
  return apiFetch().then(({info}) => info.count)
}

function getCharacters(count){
  const idString = Array.from(Array(count), (_, i) => i+1).join()
  return apiFetch(idString)
}

function getData(){
  return getCount().then(getCharacters)
}

module.exports = getData