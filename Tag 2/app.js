const express = require('express');
const basicAuth = require('express-basic-auth');

const app = express();
const port = 3000;

const USERNAME = 'zli';
const PASSWORD = 'zli1234';

app.get('/public', (req, res) => {
    res.send('Dieser Endpunkt ist öffentlich zugänglich.');
});

app.use("/private", (req, res, next) => {
    const auth = { login: USERNAME, password: PASSWORD }; // change this

    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (login === auth.login && password === auth.password){
        return next();
    }

    res.set('WWW-Authenticate', 'Basic realm="401"'); // change this
    res.status(401).send('Authentication required.'); // custom message
})

app.get('/private', (req, res) => {
    res.send('Willkommen im privaten Bereich!');
});

app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});
