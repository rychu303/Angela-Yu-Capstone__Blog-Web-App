import bodyParser from 'body-parser'
import express from 'express'

const app = express()
const port = 3000

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))

// let requestRoute = ''

const logger = (req, res, next) => {
    // console.log (`Request Method: ${req.method}; Request URL: ${req.url}`)
    // req.requestRoute = `${req.url}`
    next()
}


app.use(logger)

// let submitAlert = false
// let submitAlertMsg = ''
const data = []

app.get('/', (req, res) => {
    // console.log('home data', data)
    res.render('index', { data })
})

app.get('/new-post', (req, res) => {
    res.render('new-post')
})

app.post('/submit', (req, res) => {
    const date = new Date()
    const day = date.getDay()
    const month = date.getMonth()
    const year = date.getFullYear()
    let post = req.body
    post.id = data.length + 1
    post.date = `${month} / ${day} / ${year}`
    data.push(post)
    // console.log(post)
    // submitAlert = true
    // let submitAlertMsg = 'Your new blog post has published'
    res.redirect('/')
    // res.render('index', {
    //     alert: true,
    //     alertMessage: 'Your form has been submitted'
    // });
    // submitAlert = false
    // submitAlertMsg = ''
})

app.get('/blog-post/:id', (req, res) => {
    const blogID = req.params.id
    for (const entry of data) {
        if(entry.id == blogID) {
            // console.log('this is my entry:', entry)
            res.render('blog-post', entry)
        } else {
            res.render('blog-post', { title: 'Post not found', body: 'This post does not exist' })
        }
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${3000}`)
})

// QUILL Rich Text Editor
// const quillOptions = {
//     debug: 'info',
//     modules: {
//         toolbar: true,
//     },
//     placeholder: 'Compose an epic...',
//     theme: 'snow'
// }
// const quill = new Quill('#editor', quillOptions);  // First matching element will be used
