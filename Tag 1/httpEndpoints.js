/*
Einen Endpunkt /now, der die aktuelle Zeit zurück gibt.
Einen Endpunkt /zli, der den Benutzer auf die ZLI Webseite https://www.zli.ch weiterleitet.
Einen Endpunkt /name, der aus einer Liste von mindestens 20 Namen einen auswählt und zurückgibt.
Einen Endpunkt /html, der statisches HTML aus einer Datei vom Server zurück gibt.
Einen Endpunkt /image, der ein Bild zurückgibt, welches im Browser angezeigt wird.
Einen Endpunkt /teapot, der den Status 418 zurück gibt.
Einen Endpunkt /user-agent, der den Browser aus dem Request ausliest und zurück gibt.
Einen Endpunkt /secret, der immer den Status 403 zurück gibt.
Einen Endpunkt /xml, der eine statische XML Datei vom Server zurück gibt.
Einen Endpunkt /me, der ein JSON Objekt zurück gibt mit den Properties Vor- und Nachname, Alter, Wohnort und Augenfarbe.
*/

const express = require('express');
const app = express();
const port = 3000;

app.get('/now', (req, res) => {
    res.send(new Date().toLocaleString());
});

app.get('/zli', (req, res) => {
    res.redirect('https://www.zli.ch');
});

app.get('/name', (req, res) => {
    let names = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Heidi", "Ivan", "Jack", "Karl", "Linda", "Mike", "Nancy", "Oscar", "Peter", "Quinn", "Rita", "Steve", "Tina", "Ursula", "Victor", "Wendy", "Xander", "Yvonne", "Zack"];
    res.send(names[Math.floor(Math.random() * names.length)]);
});

app.get('/html', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get('/image', (req, res) => {
    res.sendFile(__dirname + "/image.jpg");
});

app.get('/teapot', (req, res) => {
    res.status(418).send('I am a teapot');
});

app.get('/user-agent', (req, res) => {
    res.send(req.headers['user-agent']);
});

app.get('/secret', (req, res) => {
    res.sendStatus(403);
});

app.get('/xml', (req, res) => {
    res.sendFile(__dirname + "/data.xml");
});

app.get('/me', (req, res) => {
    res.send({
        "Vorname": "Max",
        "Nachname": "Muster",
        "Alter": 42,
        "Wohnort": "Musterhausen",
        "Augenfarbe": "blau"
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});