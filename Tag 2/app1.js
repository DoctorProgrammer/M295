/*
Implementieren Sie eine Express Applikation mit Session Funktionalität.

Verwenden eine passende Bibliothek, z.B. express-session
Implementieren Sie einen Endpunkt POST /name, welcher einen Parameter name entgegennimmt und den Wert in der Session speichert
Implementieren Sie einen Endpunkt GET /name, welcher den Namen aus der Session zurück gibt
Implementieren Sie einen Endpunkt DELETE /name, welcher den Namen aus der Session löscht
Testen Sie die Endpunkte mit Hoppscotch oder Postman
*/

const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;

app.use(session({ secret: 'geheim', resave: false, saveUninitialized: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/name', (req, res) => {
    const name = req.body.name;
    req.session.name = name;
    res.send('Name gespeichert.');
});

app.get('/name', (req, res) => {
    const name = req.session.name || 'Kein Name gespeichert.';
    res.send(name);
});

app.delete('/name', (req, res) => {
    delete req.session.name;
    res.send('Name gelöscht.');
});

app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});