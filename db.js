const { Pool } = require('pg')
const fs = require('fs')
const TABLENAME = 'erjigit17'

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'erjigit',
  user: 'erjigit',
  password: '',
})


pool.connect()
// drop and create DB
pool
  .query(
    `DROP TABLE IF EXISTS ${TABLENAME};` +
      `CREATE TABLE IF NOT EXISTS ${TABLENAME} (
          id SERIAL PRIMARY KEY,
          name text,
          body jsonb
        );`
  )
  .then((result) => console.log(result))
  .catch((e) => console.error(e.stack))


function startWritingToDB(){

let a = `COPY ${TABLENAME}
FROM './data.csv' 
DELIMITER ',' 
CSV HEADER;`

  pool.query(a, (err, res) => {
    if (err) {
      throw err
    }
    console.dir({ res })
    pool.end()
  })
}
startWritingToDB()