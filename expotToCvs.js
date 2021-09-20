const fs = require('fs')


let a = `name, body\n erji, '{"id":1,}' \n erji2, '{"id":2,}'`


fs.writeFileSync('./data.csv', a)