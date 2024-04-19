const EXPRESS = require('express')
const SESSION = require('express-session')
const APP = EXPRESS()
const PORT = 3000

APP.use(SESSION({ secret: 'geheim', resave: false, saveUninitialized: true }))
APP.use(EXPRESS.urlencoded({ extended: true }))
APP.use(EXPRESS.json())

APP.use((req, res, next) => {
  console.log(req.method + '\t' + req.url)
  next()
})

const books = [
  {
    isbn: '978-3-16-148410-0',
    title: 'Der Hobbit',
    year: 1937,
    author: 'J.R.R. Tolkien'
  },
  {
    isbn: '978-3-446-19345-3',
    title: 'Harry Potter and the Philosopher\'s Stone',
    year: 1997,
    author: 'J.K. Rowling'
  },
  {
    isbn: '978-3-499-00391-0',
    title: 'To Kill a Mockingbird',
    year: 1960,
    author: 'Harper Lee'
  },
  {
    isbn: '978-0-553-21311-0',
    title: 'Moby-Dick',
    year: 1851,
    author: 'Herman Melville'
  },
  {
    isbn: '978-0-553-21311-1',
    title: 'The Adventures of Huckleberry Finn',
    year: 1884,
    author: 'Mark Twain'
  },
  {
    isbn: '978-0-553-21311-2',
    title: 'The Chronicles of Narnia',
    year: 1950,
    author: 'C.S. Lewis'
  },
  {
    isbn: '978-0-553-21311-3',
    title: 'The Da Vinci Code',
    year: 2003,
    author: 'Dan Brown'
  },
  {
    isbn: '978-0-553-21311-4',
    title: 'The Alchemist',
    year: 1988,
    author: 'Paulo Coelho'
  }
]

const lends = [
  {
    isbn: '978-3-16-148410-0',
    customer_id: 'zli@zli.ch',
    borrowed_at: '2024-04-18T13:54:56.234Z'
  },
  {
    isbn: '978-0-553-21311-3',
    customer_id: 'ro.trachsel@vtxfree.ch',
    borrowed_at: '2024-04-18T13:54:56.234Z'
  }
]

const users = [
  {
    email: 'zli@zli.ch',
    password: '1234'
  },
  {
    email: 'ro.trachsel@vtxfree.ch',
    password: '1234'
  }
]

APP.get('/books', (req, res) => {
  res.send(books)
})

APP.get('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn
  const book = books.find(book => book.isbn === isbn)

  if (book) {
    res.send(book)
  } else {
    res.status(404).json({ error: 'Book not found' })
  }
})

APP.post('/books', (req, res) => {
  const BOOK = req.body
  if (BOOK.isbn && BOOK.title && BOOK.year && BOOK.author) {
    books.push(BOOK)
    res.send(BOOK)
  } else {
    res.status(422).json({ error: 'Missing attribute' })
  }
})

APP.put('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn
  const bookIndex = books.findIndex(book => book.isbn === isbn)
  const newBook = req.body

  if (bookIndex >= 0) {
    books[bookIndex] = newBook
    res.send(newBook)
  } else {
    res.status(404).json({ error: 'Book not found' })
  }
})

APP.delete('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn
  const bookIndex = books.findIndex(book => book.isbn === isbn)

  if (bookIndex >= 0) {
    books.splice(bookIndex, 1)
    res.send({ message: 'Book deleted' })
  } else {
    res.status(404).json({ error: 'Book not found' })
  }
})

APP.patch('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn
  const bookIndex = books.findIndex(book => book.isbn === isbn)
  const newBook = req.body

  if (bookIndex >= 0) {
    books[bookIndex] = { ...books[bookIndex], ...newBook }
    res.send(books[bookIndex])
  } else {
    res.status(404).json({ error: 'Book not found' })
  }
})

APP.get('/lends', verifyAuth, (req, res) => {
  // only show books that are lent by the current user
  const userLends = lends.filter((lend) => lend.customer_id === req.session.user_id)
  res.send(userLends)
})

APP.get('/lends/:isbn', verifyAuth, (req, res) => {
  // only show if this book is lent by the current user
  const isbn = req.params.isbn
  const lend = lends.find((lend) => lend.isbn === isbn && lend.customer_id === req.session.user_id)

  if (lend) {
    res.send(lend)
  } else {
    res.status(404).json({ error: 'Lend not found' })
  }
})

APP.post('/lends', verifyAuth, (req, res) => {
  const lend = req.body.isbn
  const book = books.find((book) => book.isbn === lend)

  if (lends.map((lend) => lend.isbn).includes(lend)) {
    res.status(409).json({ error: 'Book already lent' })
    return
  }

  if (book && lends.filter((lend) => lend.customer_id === req.session.user_id).length < 3) {
    lends.push({ isbn: lend, customer_id: req.session.user_id, borrowed_at: new Date() })
    res.send(lends)
  } else {
    res.status(404).json({ error: 'Book not found or maximum lends reached' })
  }
})

APP.delete('/lends/:id', verifyAuth, (req, res) => {
  const isbn = req.params.isbn
  const lendIndex = lends.findIndex((lend) => lend.isbn === isbn)

  if (lendIndex >= 0) {
    lends.splice(lendIndex, 1)
    res.send({ message: 'Book returned' })
  } else {
    res.status(404).json({ error: 'Lend not found' })
  }
})

APP.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const user = users.find((user) => user.email === email && user.password === password)

  if (user) {
    req.session.authenticated = true
    req.session.user_id = email // assuming email is unique
    res.status(201).json({ email })
  } else {
    res.status(401).json({ error: 'Login failed' })
  }
})

APP.get('/verify', verifyAuth, (req, res) => {
  res.status(200).json({ email: req.session.user_id })
})

APP.delete('/logout', (req, res) => {
  req.session.authenticated = false
  res.status(204).end()
})

APP.listen(PORT, () => {
  console.log('Server is listening on Port: ' + PORT)
})

function verifyAuth (req, res, next) {
  if (req.session.authenticated) {
    next()
  } else {
    res.status(401).json({ error: 'Unauthorized' })
  }
}
