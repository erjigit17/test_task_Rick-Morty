var { Pool } = require('pg')
var fs = require('fs')
var copyTo = require('pg-copy-streams').from

var pool = new Pool()

const TABLENAME = 'erjigit17'

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'erjigit',
  user: 'erjigit',
  password: '',
})

function cleanDB() {
  pool.connect()
  // drop and create DB
  client
    .query(
      `DROP TABLE IF EXISTS ${TABLENAME};` +
      `CREATE TABLE IF NOT EXISTS ${TABLENAME} (
            id SERIAL PRIMARY KEY,
            name text,
            body text
          );`
    )
    .then((result) => console.log(result))
    .catch((e) => console.error(e.stack))
  pool.end()
  startWritingToDB()
}

pool.connect(function (err, client, done) {
  var stream = client.query(copyFrom(`COPY ${TABLENAME} FROM STDIN`))
  var fileStream = fs.createReadStream('file.tsv')
  fileStream.on('error', done)
  stream.on('error', done)
  stream.on('finish', done)
  fileStream.pipe(stream)
})

