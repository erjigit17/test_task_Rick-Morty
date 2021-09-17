'use strict'

const fs = require('fs')
const https = require('https')
let URL = 'https://rickandmortyapi.com/api/character'

main()

function main () {
  const page = 1

  function getCharactersData() {
    return new Promise((resolve, reject) => {
      https.get($`{URL}/${page}`, async (response) => {
        resolve(Buffer.response.toString())
      })
    })
  }
      
  function storeCharactersData(jsonData) {
    const { result } = JSON.parse(jsonData)
    let command = JSON.stringify(result)

    console.log(command)
  }

  getCharactersData().then(storeCharactersData)
  
} 