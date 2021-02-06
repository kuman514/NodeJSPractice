let template = {
  html: (list, title, body) => {
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
  },
  list: (filelist) => {
    let list = '<ul>'
    filelist.forEach((item) => {
      list += `<li><a href="/?id=${item}">${item}</a></li>`
    })
    list += '</ul>'
    return list
  }
}

module.exports = template
