import bodyParser from 'body-parser'
import express from 'express'
import sanitizeHtml from 'sanitize-html';
import methodOverride from 'method-override'

const app = express()
const port = 3000

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))

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
let counter = 1

app.get('/', (req, res) => {
    // console.log('home data', data)
    res.render('index', { data })
})

app.get('/new-post', (req, res) => {
    res.render('new-post')
})

/* Edit Post */
app.post('/update/:id', (req, res) => {
    console.log('can you see me?')
    const blogID = req.params.id
    console.log('blogID = ', blogID)
    for (const entry of data) {
        if(entry.id == blogID) {

            let post = req.body

            /* Sanitize HTML */
            let cleanTitle = sanitizeHtml(`${post.title}`, {
                allowedTags: [],
                // allowedAttributes: {'a': ['href']},
            })
            let cleanSummary = sanitizeHtml(`${post.summary}`, {
                allowedTags: [],
                // allowedAttributes: {'a': ['href']},
            })
            let cleanContent = sanitizeHtml(`${post.content[1]}`, {
                allowedTags: ['p', 'a', 'strong', 's', 'em', 'code', 'blockquote', 'pre', 'ul', 'ol', 'li', 'h2', 'h3'],
                allowedAttributes: {
                    'a': ['href', 'target', 'rel'],
                },
            })

            entry.content = cleanContent
            entry.title = cleanTitle
            entry.summary = cleanSummary

            // res.redirect('/blog-post/' + blogID)
            // res.render('blog-post', entry)
            res.redirect('/')
        }
    }
})

/* Delete Post */
app.delete('/blog-post/:id', (req, res) => {
    console.log('can you see me?')
    const blogID = req.params.id
    console.log('blogID = ', blogID)
    for (const entry of data) {
        if(entry.id == blogID) {

            data.splice(data.indexOf(entry), 1)
            console.log('You deleted the blog post')

            // res.redirect('/blog-post/' + blogID)
            // res.render('blog-post', entry)
            res.redirect('/')
        }
    }
})

/* Create and Save Post */
app.post('/submit', (req, res) => {
    const today = new Date()
    const options = {
        // weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
    }
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(today)

    /* Grab blog post submission */
    let post = req.body

    /* Sanitize HTML */
    let cleanTitle = sanitizeHtml(`${post.title}`, {
        allowedTags: [],
        // allowedAttributes: {'a': ['href']},
    })
    let cleanSummary = sanitizeHtml(`${post.summary}`, {
        allowedTags: [],
        // allowedAttributes: {'a': ['href']},
    })
    let cleanContent = sanitizeHtml(`${post.content[1]}`, {
        allowedTags: ['p', 'a', 'strong', 's', 'em', 'code', 'blockquote', 'pre', 'ul', 'ol', 'li', 'h2', 'h3'],
        allowedAttributes: {
            'a': ['href', 'target', 'rel'],
        },
    })

    /* Set stored data values */
    // post.id = data.length + 1 >= counter ? data.length + 1 : counter + 1
    post.id = counter
    counter++ // primitive way to keep track of IDs used, so if a blog is deleted, the next blog post will not reuse that ID
    post.date = formattedDate
    // post.date = `${month} / ${day} / ${year}`
    post.title = cleanTitle
    post.summary = cleanSummary
    post.content = cleanContent

    data.push(post)
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
        }
        // else {
        //     res.render('blog-post', { title: 'Post not found', body: 'This post does not exist' })
        // }
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${3000}`)
})
