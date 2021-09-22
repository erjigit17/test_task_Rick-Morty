'use strict'

const { Client } = require('pg')
const config = require('./config')

const sqlQuery = `
  DROP TABLE IF EXISTS ${config.tableName};
  CREATE TABLE ${config.tableName} (
    id SERIAL PRIMARY KEY,
    name text,
    body jsonb
  );
`

function createTable(){
  const client = new Client(config.postgres)
  client.connect()
  // drop and create DB
  return client
    .query(sqlQuery)
    .then((result) => {
      client.end()
      if (result[1].command === 'CREATE'){
        return true 
      } else { 
        console.error('table was not created')
        return false
      }
    })
}

module.exports = createTable