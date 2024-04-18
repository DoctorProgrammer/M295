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
const SESSION = require('express-session');
const APP = EXPRESS();
const PORT = 3000;

APP.use(SESSION({ secret: 'geheim', resave: false, saveUninitialized: true }));
APP.use(EXPRESS.urlencoded({ extended: true }));
APP.use(EXPRESS.json());

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
    if (BOOK.isbn && BOOK.title && BOOK.year && BOOK.author) {
        books.push(BOOK);
        res.send(BOOK);
    } else {
        res.status(422).json({ error: "Missing attribute" });
    }
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
        isbn: '978-3-16-148410-0',
    },
    {
        id: '2',
        isbn: '978-3-16-148410-0',
    },
]

APP.get('/lends', (req, res) => {
    console.log(`Port: ${PORT}\tGET: /lends\t\t ${new Date().toString()}`);

    res.send(lends);
});

APP.get('/lends/:id', (req, res) => {
    console.log(`Port: ${PORT}\tGET: /lends/:id\t\t ${new Date().toString()}`);
    const id = req.params.id;
    const lendsById = lends.filter((lend) => lend.id === id); // Funktioniert nicht
    const book = books.filter((book) => book.isbn === lendsById[0].isbn);

    // send the book which has the isbn as the isbn in the lends list
    res.send(book[0]);
});

APP.post('/lends', (req, res) => {
    console.log(`Port: ${PORT}\tPOST: /lends\t\t ${new Date().toString()}`);
    const lend = req.body.isbn;
    // check if the book exists in the books list
    const book = books.filter((book) => book.isbn === lend);

    // if book is already in the lends list
    if (lends.map((lend) => lend.isbn).includes(lend)) {
        res.status(409).json({ error: "Book already lent" });
        return;
    }

    if (book.length > 0) {
        // generate a random id
        const id = Math.floor(Math.random() * 1000).toString();
        // add the lend to the lends list
        lends.push({ id: id, isbn: lend });
        res.send({ id: id, isbn: lend });
    } else {
        res.status(404).json({ error: "Book not found" });
    }
});

APP.patch('/lends/:id', (req, res) => {
    console.log(`Port: ${PORT}\tPATCH: /lends/:id\t\t ${new Date().toString()}`);
    const id = req.params.id;
    const lendIndex = lends.findIndex((lend) => lend.id === id);
    const newLend = req.body;

    if (lendIndex >= 0) {
        lends[lendIndex] = { ...lends[lendIndex], ...newLend };
        res.send(lends[lendIndex]);
    } else {
        res.status(404).json({ error: "Lend not found" });
    }
});

/*
Erweitern Sie Ihre REST API der Bibliothek. Erstellen Sie die Endpunkte für Login/Logout und schützen Sie die Endpunkte der Ressource Lend vor Zugriffen ohne Login.

POST	/login	    Überprüft die als mitgegebenen Parameter email und password und markiert die Session als «authentifiziert»
GET	    /verify	    Gibt den Statuscode 200 sowie die E-Mail Adresse des Benutzers zurück, wenn die Session als authentifiziert markiert wurde, andernfalls wird der Statuscode 401 zurück gegeben
DELETE	/logout	    Markiert die aktuelle Session als «nicht authentifiziert» und gibt den Statuscode 204 zurück
*/

let users = [
    {
        email: 'zli@zli.ch',
        password: '1234'
    },
    {
        email: 'zli1@zli.ch',
        password: '12345'
    }
]

APP.post('/login', (req, res) => {
    log(req, res);
    
    const email = req.query.email;
    const password = req.query.password;
    const user = users.filter((user) => user.email === email && user.password === password);

    if (user.length > 0) {
        req.session.authenticated = true;
        res.send('Login successful');
    } else {
        res.status(401).send('Login failed');
    }
});

APP.get('/verify', (req, res) => {
    log(req, res);

    if (req.session.authenticated) {
        res.status(200).send(req.query.email);
    } else {
        res.status(401).send('Unauthorized');
    }
});

APP.delete('/logout', (req, res) => {
    log(req, res);
    
    req.session.authenticated = false;
    res.status(204).send('Logout successful');
});

APP.listen(PORT, () => {
    console.log("Server is listening on Port: " + PORT)
});

function log(req, res) {
    console.log(`Port: ${PORT}\t${req.method}\t${req.originalUrl}\t${new Date().toString()}`);
}