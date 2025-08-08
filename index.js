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

// const logger = (req, res, next) => {
//     // console.log (`Request Method: ${req.method}; Request URL: ${req.url}`)
//     // req.requestRoute = `${req.url}`
//     next()
// }


// app.use(logger)

// let submitAlert = false
// let submitAlertMsg = ''
const data = [
    {
        id: 1,
        title: 'My First Blog Post',
        summary: 'This is a summary of my first blog post.',
        content:
            `<h2>Test Content</h2>
            <p>This is a <strong>paragraph</strong> with <em>emphasized</em> text and a <a href="https://example.com" target="_blank" rel="noopener noreferrer">link</a>.</p>
            <p>Vestibulum volutpat auctor dolor. In tristique malesuada mi, quis lacinia metus. Donec at mauris sodales, suscipit orci vel, pellentesque lectus. Ut sed turpis leo. Nullam commodo nisi in arcu tincidunt sodales. Ut egestas ipsum ipsum, vel eleifend justo accumsan et. Donec porta felis ut mi fringilla tristique. Pellentesque rhoncus eleifend leo a faucibus. Vivamus in risus sed ipsum finibus convallis a et risus. Curabitur finibus pulvinar risus, eget cursus mi ultrices in. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam accumsan felis sed sapien consectetur volutpat. Aenean efficitur, justo ac facilisis mollis, sapien sapien iaculis nunc, vel rhoncus nulla nisi id nisl. Nullam sed dolor at justo ornare luctus vel eget velit.</p>
            <blockquote>This is a blockquote example.</blockquote><pre><code>const example = "This is code inside a pre tag";
const test = () => {
    console.log("hello world")
}
</code></pre>
            <ul>
                <li>Unordered list item 1</li>
                <li>Unordered list item 2</li>
                <li>
                    <code>
                        margin-block-end: 1rem;
                    </code>
                </li>
            </ul>
            <ol>
                <li>Ordered list item 1</li>
                <li>Ordered list item 2</li>
            </ol>
            <p>This text contains <s>strikethrough</s> and a line break.<br>Here is the next line.</p>
            <h3>Subheading Example</h3>
            <p>More content under a subheading.</p>`,
        date: 'Jan 1, 2023'
    },
    {
        id: 2,
        title: 'My Second Blog Post',
        summary: 'This is a summary of my second blog post.',
        content: '<p>This is the content of my second blog post.</p>',
        date: 'Feb 1, 2023'
    },
    {
        id: 3,
        title: 'My Third Blog Post',
        summary: 'This is a summary of my third blog post.',
        content: '<p>This is the content of my third blog post.</p>',
        date: 'Mar 1, 2023'
    }
]
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
            let cleanSummary =
            sanitizeHtml(`${post.summary}`, {
                allowedTags: [],
                // allowedAttributes: {'a': ['href']},
            })
            let cleanContent = sanitizeHtml(`${post.content[1]}`, {
                allowedTags: ['p', 'a', 'strong', 's', 'em', 'code', 'blockquote', 'pre', 'ul', 'ol', 'li', 'h2', 'h3', 'br'],
                allowedAttributes: {
                    'a': ['href', 'target', 'rel'],
                },
                // textFilter: function (text, tagName) {
                //     // console.log('textFilter', text, tagName)
                //     if (tagName === "p" && /^\s*$/.test(text)) {
                //         // return text.trim() === "" || text.trim() === '<br>' ? '' : text
                //         return /^\s*$/.test(text) ? '' : text
                //     }
                // }
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
        // test
    })
    let cleanContent = sanitizeHtml(`${post.content[1]}`, {
        allowedTags: ['p', 'a', 'strong', 's', 'em', 'code', 'blockquote', 'pre', 'ul', 'ol', 'li', 'h2', 'h3', 'br'],
        allowedAttributes: {
            'a': ['href', 'target', 'rel'],
        },
        // transformTags: {
        //     'pre': 'code',
        // },
        // textFilter: function(text, tagName) {
        //     // console.log('textFilter', text, tagName)
        //     if (tagName === "p") {
        //         // console.log('textFilter', text, tagName)
        //         return text.trim() === "" || text.trim() === '<br>' ? '' : text
        //     } else {
        //         return text
        //     }
        // }
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
