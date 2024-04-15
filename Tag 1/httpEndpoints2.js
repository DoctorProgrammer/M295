/*
Einen Endpunkt GET /now, der die aktuelle Zeit zurück gibt. Per Parameter ?tz= kann die Zeitzone ausgewählt werden (z.B. "Europe/Zurich").
Einen Endpunkt POST /names, welcher der Namensliste einen Eintrag hinzufügt. Der Name wird per Form mitgegeben
Einen Endpunkt DELETE /names, der den Eintrag aus der Namensliste entfernt und dann 204 zurück gibt. Der Name wird per Query mitgegeben
Einen Endpunkt GET /secret2, der den Header "Authorization" ausliest und 200 zurück gibt, wenn im Header "Basic aGFja2VyOjEyMzQ=" steht und ansonsten 401 zurück gibt
Einen Endpunkt GET /chuck, welcher einen zufälligen Witz von der Chuck Norris API abfragt. Im Text wird "Chuck Norris" dann durch den Wert ersetzt, der per Query Paramter ?name= mitegegeben wurde
Einen Endpunkt PATCH /me, der ein JSON Objekt entgegennimmt und die Werte, die mitgegeben wurden, im bisherigen me-Objekt überschreiben
*/

const EXPRESS = require('express');
const APP = EXPRESS();
const PORT = 3000;

const REQUEST = require('request');

let names = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Heidi", "Ivan", "Jack", "Karl", "Linda", "Mike", "Nancy", "Oscar", "Peter", "Quinn", "Rita", "Steve", "Tina", "Ursula", "Victor", "Wendy", "Xander", "Yvonne", "Zack"];

APP.get('/now', (req, res) => {
    let tz = req.query.tz;
    if (tz) {
        res.send(new Date().toLocaleString("de-CH", { timeZone: tz }));
    } else {
        res.send(new Date().toLocaleString());
    }
});

APP.post('/names', (req, res) => {
    let name = req.body.name;
    names.push(name);
    res.send(names);
});

APP.delete('/names', (req, res) => {
    let name = req.query.name;
    names = names.filter(n => n !== name);
    res.sendStatus(204);
});

APP.get('/secret2', (req, res) => {
    let auth = req.headers.authorization;
    if (auth === "Basic aGFja2VyOjEyMzQ=") {
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});

APP.get('/chuck', (req, res) => {
    let name = req.query.name;
    let url = "https://api.chucknorris.io/jokes/random";
    if (name) {
        url += "?name=" + name;
    }
    REQUEST.get({
        url: url,
        json: true,
        headers: { 'User-Agent': 'request' }
    }, (err, response, data) => {
        if (err) {
            console.log('Error:', err);
        } else if (response.statusCode !== 200) {
            console.log('Status:', response.statusCode);
        } else {
            res.send(data.value);
        }
    });
});

APP.patch('/me', (req, res) => {
    let me = {
        "Vorname": "Max",
        "Nachname": "Muster",
        "Alter": 42,
        "Wohnort": "Musterhausen",
        "Augenfarbe": "blau"
    };
    for (let key in req.body) {
        me[key] = req.body[key];
    }
    res.send(me);
});

APP.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});