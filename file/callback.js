/*
let a = function () {
  console.log('A')
}

function slowFunc(callback) {
  callback()
}

slowFunc(a)
*/

function slowFunc(callback) {
  callback()
}

slowFunc(function () {
  console.log('A')
})
