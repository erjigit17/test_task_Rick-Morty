'use strict'

const createTable = require('./createTable.js'),
      getData = require('./getData.js'),
      putData = require('./putData.js')

main()

async function main() {
  // get data from api
  const characters = await getData()
  // create table in db
  const success = await createTable()
  if (success){
    // insert data in table
    putData(characters)
  }  
}



