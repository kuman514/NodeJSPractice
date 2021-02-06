let http = require('http')
let fs = require('fs')
let url = require('url')
let qs = require('querystring')
let path = require('path')

let template = require('./lib/template.js')

let app = http.createServer((request, response) => {
  let _url = request.url
  let queryData = url.parse(_url, true).query
  let pathName = url.parse(_url, true).pathname
  let title = queryData.id

  if (pathName === '/') {
    let list = '<ul></ul>'
    fs.readdir('./data', (err, filelist) => {
      list = template.list(filelist)
    })
    if (queryData.id === undefined) {
      title = 'Welcome'
      queryData.id = 'Welcome'
    }
    let filteredId = path.parse(queryData.id).base
    fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
      let _template = template.html(list, title, `<h2>${title}</h2><p>${description}</p>`)
      response.writeHead(200)
      response.end(_template)
    })
  } else if (pathName === '/create') {
    let list = '<ul></ul>'
    fs.readdir('./data', (err, filelist) => {
      list = template.list(filelist)
    })
    title = 'Create'
    queryData.id = 'Create'
    let _template = template.html(list, title, `
      <form action="/create_process" method="post">
        <p>
          <input type="text" name="title" placeholder="Title">
        </p>
        <p>
          <textarea name="description" rows="8" cols="200" placeholder="Description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `)
    response.writeHead(200)
    response.end(_template)
  } else if (pathName === '/create_process') {
    let body = ''
    request.on('data', (data) => {
      body += data
    })
    request.on('end', () => {
      let post = qs.parse(body)
      let title = post.title
      let desc = post.description
      fs.writeFile(`data/${title}`, desc, 'utf8', (err) => {
        response.writeHead(302, {
          Location: `/?id=${title}`
        })
        response.end()
      })
    })
  } else if (pathName === '/update') {
    let list = '<ul></ul>'
    fs.readdir('./data', (err, filelist) => {
      list = template.list(filelist)
    })
    let filteredId = path.parse(queryData.id).base
    fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
      let _template = template.html(list, title, `
        <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p>
            <input type="text" name="title" placeholder="Title" value="${title}">
          </p>
          <p>
            <textarea name="description" rows="8" cols="200" placeholder="Description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `)
      response.writeHead(200)
      response.end(_template)
    })
  } else if (pathName === '/update_process') {
    let body = ''
    request.on('data', (data) => {
      body += data
    })
    request.on('end', () => {
      let post = qs.parse(body)
      let title = post.title
      let desc = post.description
      let id = post.id
      let filteredId = path.parse(id).base
      fs.rename(`data/${filteredId}`, `data/${title}`, (err) => {
        fs.writeFile(`data/${title}`, desc, 'utf8', (err) => {
          response.writeHead(302, {
            Location: `/?id=${title}`
          })
          response.end()
        })
      })
    })
  } else if (pathName === '/delete_process') {
    let body = ''
    request.on('data', (data) => {
      body += data
    })
    request.on('end', () => {
      let post = qs.parse(body)
      let id = post.id
      let filteredId = path.parse(id).base
      fs.unlink(`data/${filteredId}`, (err) => {
        response.writeHead(302, {Location: `/`})
        response.end()
      })
    })
  } else {
    response.writeHead(404)
    response.end('File not found')
  }
})

app.listen(3000)
