let http = require('http')
let fs = require('fs')
let url = require('url')
let qs = require('querystring')

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
      <a href="/create">Create</a>
      <a href="/update?id=${title}">Update</a>
      <form action="delete_process" method="post">
        <input type="hidden" name="id" value="${title}"></input>
        <input type="submit" value="delete"></input>
      </form>
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
  console.log(pathName)
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
  } else if (pathName === '/create') {
    let list = '<ul></ul>'
    fs.readdir('./data', (err, filelist) => {
      list = templateList(filelist)
    })
    title = 'Create'
    queryData.id = 'Create'
    let template = templateHTML(list, title, `
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
    response.end(template)
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
      list = templateList(filelist)
    })
    fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
      let template = templateHTML(list, title, `
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
      response.end(template)
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
      fs.rename(`data/${id}`, `data/${title}`, (err) => {
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
      console.log(post)
      console.log(id)
      fs.unlink(`data/${id}`, (err) => {
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
