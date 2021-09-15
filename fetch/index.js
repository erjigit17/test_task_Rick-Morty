const { Pool } = require('pg')
const https = require('https')
const fetch = require('node-fetch')

const PORT = process.env.PORT || 3000
const URL = 'https://rickandmortyapi.com/api/character/'
let id = 0

const TABLENAME = 'erjigit17'

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'erjigit',
  user: 'erjigit',
  password: '',
})



async function start() {
  id++
  const data = await fetch(URL + id)
  const name = data.name

  console.log(name)
}
start()

function insertDB (name, body){

  pool
    .query(`INSERT INTO ${TABLENAME} (name, body) VALUES('${name}', '${body}')`)
    .then(res => apiPars())
    .catch(err => console.error('Error executing query', err.stack))
}





// function apiPars(id){
//       https.get(URL + id, (res) => {
//       let json = ''
//       res.on('data', function (chunk) {
//           json += chunk
//       });
//       res.on('end', () => {
//         if (res.statusCode === 200) {
                
//           return json
//           // try {
//           //     let data = JSON.parse(json)
//           //     return await data
//           //     // body = JSON.stringify(data)
//           //     // name = data.name
//           // } catch (e) {
//           //     console.log('Error parsing JSON!')
//           //     stop = true
//           // }
//         } else {
//             console.log('Status:', res.statusCode)
//             stop = true
//         }
//       })
//     }).on('error', function (err) {
//         console.log('Error:', err)
//         stop = true
//     })
// }




// const dropTable = () => {
//   execute(`DROP TABLE IF EXISTS ${TABLENAME};`)}

const createTable = () => {
  execute(
    `CREATE TABLE IF NOT EXISTS ${TABLENAME} (
    id SERIAL PRIMARY KEY,
    name text,
    body jsonb
  );`)
}
createTable()



// const button = document.querySelector('button')

// let counter = 0
// button.addEventListener('click', function(){
//   counter++
//   button.textContent = counter
// })