const fs = require('fs')


let a = `name, body\nerji, '{"id":1,}' \nerji2, '{"id":2,}'`


fs.writeFileSync('./data.csv', a)