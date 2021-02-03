let fs = require('fs')

// sync
console.log('A')
let result = fs.readFileSync('sample.txt', 'utf8')
console.log(result)
console.log('C')

// async
console.log('A')
fs.readFile('sample.txt', 'utf8', (err, data) => {
  console.log(data)
})
console.log('C')
