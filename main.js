let http = require('http')
let fs = require('fs')
let url = require('url')

function templateHTML (list, title, body) {
  return `
    <!DOCTYPE html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${body}
    </body>
  `
}

function templateList (filelist) {
  let list = '<ul>'
  filelist.forEach((item) => {
    list += `<li><a href="/?id=${item}">${item}</a></li>`
  })
  list += '</ul>'
  return list
}

let app = http.createServer((request, response) => {
  let _url = request.url
  let queryData = url.parse(_url, true).query
  let pathName = url.parse(_url, true).pathname
  let title = queryData.id

  if (pathName === '/') {
    let list = '<ul></ul>'
    fs.readdir('./data', (err, filelist) => {
      list = templateList(filelist)
    })
    if (queryData.id === undefined) {
      title = 'Welcome'
      queryData.id = 'Welcome'
    }
    fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
      let template = templateHTML(list, title, `<h2>${title}</h2><p>${description}</p>`)
      response.writeHead(200)
      response.end(template)
    })
  } else {
    response.writeHead(404)
    response.end('File not found')
  }
})

app.listen(3000)
