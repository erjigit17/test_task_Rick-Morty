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
    console.log({err, result})
    client.end()
  })
}


module.exports = putData