'use strict'

const fs = require('fs');

const config = {
  postgres: {
    host: '18.192.179.9',
    port: 5432,
    database: 'awsDB',
    user: 'ubuntu',
    password: 'erji',
  },
  // postgres: {
  //   host: 'rc1c-2m0keqdcncuwizmx.mdb.yandexcloud.net',
  //   port: 6432,
  //   database: 'db1',
  //   user: 'candidate',
  //   password: '62I8anq3cFq5GYh2u4Lh',
  //   ssl: {
  //       rejectUnauthorized : false,
  //       ca   : fs.readFileSync('./CA.pem').toString(),
  //   },
  // },

  tableName: 'erjigit17',

  url: 'https://rickandmortyapi.com/api/character/',
}

module.exports = config
