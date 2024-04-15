/*
GET	    /books	        Gibt die Liste von allen Büchern als JSON zurück
GET	    /books/{isbn}	Gibt alle Informationen zu einem Buch als JSON zurück
POST	/books	        Erstellt ein neues Buch in der Liste und gibt dasselbe Objekt wieder als JSON zurück
PUT	    /books/{isbn}	Überschreibt das Buch in der Liste und gibt dasselbe Objekt wieder als JSON zurück
DELETE	/books/{isbn}	Löscht das Buch in der Liste
PATCH	/books/{isbn}	Ändert die Daten eines Buchs und gibt dasselbe aktualisierte Objekt wieder als JSON zurück

Attribute von der Ressource Book:

isbn: Eindeutige ID des Buches
title: Titel des Buches
year: Erscheinungsjahr des Buches
author: Name des Autors
Stellen Sie sicher, dass keine der Attribute leer sein kann. Geben sie ansonsten den Statuscode 422 zurück.
*/

const EXPRESS = require('express');
const BODYPARSER = require('body-parser');
const APP = EXPRESS();
const PORT = 3000;

APP.use(EXPRESS.json());
APP.use(BODYPARSER.urlencoded({ extended: true }));

let books = [
    {
        isbn: "978-3-16-148410-0",
        title: "Der Hobbit",
        year: 1937,
        author: "J.R.R. Tolkien"
    },
    {
        isbn: "978-3-446-19345-3",
        title: "Harry Potter and the Philosopher's Stone",
        year: 1997,
        author: "J.K. Rowling"
    },
    {
        isbn: "978-3-499-00391-0",
        title: "To Kill a Mockingbird",
        year: 1960,
        author: "Harper Lee"
    },
    {
        isbn: "978-0-553-21311-0",
        title: "Moby-Dick",
        year: 1851,
        author: "Herman Melville"
    },
    {
        isbn: "978-0-553-21311-1",
        title: "The Adventures of Huckleberry Finn",
        year: 1884,
        author: "Mark Twain"
    },
    {
        isbn: "978-0-553-21311-2",
        title: "The Chronicles of Narnia",
        year: 1950,
        author: "C.S. Lewis"
    },
    {
        isbn: "978-0-553-21311-3",
        title: "The Da Vinci Code",
        year: 2003,
        author: "Dan Brown"
    },
    {
        isbn: "978-0-553-21311-4",
        title: "The Alchemist",
        year: 1988,
        author: "Paulo Coelho"
    }
];

APP.get("/books", (req, res) => {
    // send books as json
    res.send(books);
});

APP.get("/books/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books.find(book => book.isbn === isbn);

    if (book) {
        res.send(book);
    } else {
        res.status(404).json({ error: "Book not found" });
    }
});

APP.post("/books", (req, res) => {
    const BOOK = req.body;
    console.log(BOOK);
    books.push(BOOK);
    res.send(BOOK);
});

APP.put("/books/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const bookIndex = books.findIndex(book => book.isbn === isbn);
    const newBook = req.body;

    if (bookIndex >= 0) {
        books[bookIndex] = newBook;
        res.send(newBook);
    } else {
        res.status(404).json({ error: "Book not found" });
    }
});

APP.delete("/books/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const bookIndex = books.findIndex(book => book.isbn === isbn);

    if (bookIndex >= 0) {
        books.splice(bookIndex, 1);
        res.send({ message: "Book deleted" });
    } else {
        res.status(404).json({ error: "Book not found" });
    }
});

APP.patch("/books/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const bookIndex = books.findIndex(book => book.isbn === isbn);
    const newBook = req.body;

    if (bookIndex >= 0) {
        books[bookIndex] = { ...books[bookIndex], ...newBook };
        res.send(books[bookIndex]);
    } else {
        res.status(404).json({ error: "Book not found" });
    }
});

/*
GET	/lends	Gibt alle Ausleihen als als JSON zurück
GET	/lends/{id}	Gibt alle Informationen zu einer Ausleihe als JSON zurück
POST	/lends	Leiht ein neues Buch aus
DELETE	/lends/{id}	Bringt ein Buch zurück
*/

let lends = [
    {
        id: '1',
        book: {
            title: 'Harry Potter',
            author: 'J.K. Rowling',
            isbn: '9781408855652'
        }
    },
    {
        id: '2',
        book: {
            title: 'Lord of the Rings',
            author: 'J.R.R. Tolkien',
            isbn: '9780544003415'
        }
    },
]

APP.get('/lends', (req, res) => {
    console.log(`Port: ${port}\tGET: /lends\t\t ${new Date().toString()}`);

    res.send(lends);
});

APP.get('/lends/:id', (req, res) => {
    console.log(`Port: ${port}\tGET: /lends/:id\t\t ${new Date().toString()}`);
    const id = req.params.id;
    const lendsById = lends.filter((lend) => lend.id === id); // Funktioniert nicht

    res.send(lendsById);
});

APP.post('/lends', (req, res) => {
    console.log(`Port: ${port}\tPOST: /lends\t\t ${new Date().toString()}`);
    const book = books.filter((book) => book.isbn === req.query.isbn);
    const lend = {
        id: lends.length + 1,
        book: book[0]
    }
    lends.push(lend);

    res.send(lends);
});

APP.patch('/lends/:id', (req, res) => {
    console.log(`Port: ${port}\tPATCH: /lends/:id\t\t ${new Date().toString()}`);
    const id = req.params.id;
    const book = books.filter((book) => book.isbn === req.query.isbn);
    const lend = lends.filter((lend) => lend.id === id);
    const index = lends.indexOf(lend[0]);
    lends[index].book = book;

    res.send(lends[index]);
});

APP.listen(PORT, () => {
    console.log("Server is listening on Port: " + PORT)
});