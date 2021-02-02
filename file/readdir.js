let fs = require('fs')
let testFolder = '../data'

fs.readdir(testFolder, (error, filelist) => {
  console.log(filelist)
  filelist.forEach((file) => {
    console.log(file)
  })
})
