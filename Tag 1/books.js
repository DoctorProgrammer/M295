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
const APP = EXPRESS();
const PORT = 3000;

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
    const BODY = req.body;
    const BOOK = {
        isbn: BODY.isbn,
        title: BODY.title,
        year: BODY.year,
        author: BODY.author
    };
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

APP.listen(PORT, () => {
    console.log("Server is listening on Port: " + PORT)
});