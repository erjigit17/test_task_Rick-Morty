'use strict'

const { Client } = require('pg')
const config = require('./config')
const client = new Client(config.postgres)


function escape(str){
  return str.replace(/'/g,"''")
}

function putData(characters){
  const values = characters.map((char) => `('${escape(char.name)}', '${escape(JSON.stringify(char))}')`).join(', ')

  const sqlQuery = `
    INSERT INTO ${config.tableName} (name, body) VALUES ${values}; 
  `

  client.connect()
  client.query(sqlQuery, (err, result) =>{
    err? console.log(err) : null
    result? console.log('INSERT', result.rowCount, 'row\'s') : null
    
    client.end()
  })
}


module.exports = putData