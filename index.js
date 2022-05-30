const fs = require('fs')
const path = require('path')
const express = require('express')
const bp = require('body-parser')
const MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();
const app = express()
const testFolder = './markdownDir/'

app.use(express.static('pub'))
app.use(bp.json())
app.use(bp.urlencoded({
    extended: true
}))

app.get('/', (request, response) => {
    response.sendFile(path.resolve(__dirname, 'index.html'))
})

app.post('/', (request, response) => {
    console.log(request.body)
    let markDownText = request.body.text;
    console.log(markDownText)
    let htmlText = md.render(markDownText)
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify({
        text: htmlText
    }))
})

/**
 * New route
 * Source: https://stackoverflow.com/questions/2727167/how-do-you-get-a-list-of-the-names-of-all-files-present-in-a-directory-in-node-j
 */
app.get('/directory-files', (request, response) => {
  fs.readdir(testFolder, (err, files) => { //leer el contenido del directorio

    response.end(JSON.stringify({
      files: files
    }))
  })
})
/**
 * Crear un nuevo archivo md
 */
app.post('/create-file', (request, response) => {
  console.log(request.body)
  let markDownText = request.body.text;
  let filename = request.body.filename;

  fs.writeFile(testFolder + filename +'.md', markDownText, function (err) {
    if (err) {
      console.error(err)
      response.status(500).json({
          error: 'Error!'
      })
    }else{
      response.end(JSON.stringify({
        message: 'File created successfully'
      }))
    }
  });
})

/* Ver el contenido  del archivo mardown */
app.get('/read-file', (request, response) => {
  let filename = request.query.filename

  fs.readFile(testFolder + filename, 'utf8', (err, data) => {
    if (err) {
      response.status(500).json({
        error: 'Error!'
      })
      return;
    }
    let htmlText = md.render(data)
    response.end(JSON.stringify({
      text: htmlText
    }))
  });
})

app.listen(3000, () => {
  console.log("Escuchando en: http://localhost:3000")
})