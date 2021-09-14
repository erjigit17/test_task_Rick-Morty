const https = require('https')

const url = 'https://rickandmortyapi.com/api/character/'


let id = 1  // 
let stop = false; // stop flag

while (!stop && id < 2 ) {
  https.get(url + id, res => {
    let data = '';
    res.on('data', chunk => {
      data += chunk;
    });
    res.on('end', () => {
      data = JSON.parse(data)
      const name = data.name
      const obj = data
    })
  }).on('error', err => {
    console.log(err.message);
    stop = true;
  })
  id++;
}
