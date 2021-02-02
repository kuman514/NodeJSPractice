let http = require('http')
let fs = require('fs')
let url = require('url')

let app = http.createServer((request, response) => {
  let _url = request.url
  let queryData = url.parse(_url, true).query
  let pathName = url.parse(_url, true).pathname
  let title = queryData.id

  if (pathName === '/') {
    if (queryData.id === undefined) {
      title = 'Welcome'
      queryData.id = 'Welcome'
    }
    fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
      let template = `
      <!DOCTYPE html>
      <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
      </head>
      <body>
          <h1><a href="/">WEB</a></h1>
          <ol>
              <li><a href="/?id=HTML">HTML</a></li>
              <li><a href="/?id=CSS">CSS</a></li>
              <li><a href="/?id=JavaScript">JavaScript</a></li>
          </ol>
          <h2>${title}</h2>
          <p>${description}</p>
      </body>
      `
      response.writeHead(200)
      response.end(template)
    })
  } else {
    response.writeHead(404)
    response.end('File not found')
  }
})

app.listen(3000)
