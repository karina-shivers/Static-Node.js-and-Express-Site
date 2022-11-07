const express = require("express")
const { render } = require("pug")
const data = require("./data.json")

const app = express()
const port = 3000

app.set('view engine', 'pug')
app.use('/static', express.static('public'))

app.get('/about', (req, res) => {
    res.render('about')
})
app.get('/projects/:id', (req, res, next) => {
    let projectId = parseInt(req.params.id)
    let project = data.projects.find(project => project.id === projectId)
    if (project) {
        res.render('project', project)
    } else {
        next()
    }
})
app.get('/', (req, res) => {
    res.render('index', data)
})
app.get('*', (req, res, next) => {
    error = new Error("Page not found")
    error.status = 404
    console.log(error.status, error.message)
    throw error
})

app.use((error, req, res, next) => {
    if (!error.status) {
        error.status = 500
    }
    if (!error.message) {
        error.message = "Unknown Server Error"
    }
    console.log(error.status, error.message)
    if (error.status === 404) {
        res.status(404).render('page-not-found', {error})
    }
    else {
        res.status(error.status).render('error', {error})
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
