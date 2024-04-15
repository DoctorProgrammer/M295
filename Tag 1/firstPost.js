const EXPRESS = require('express');
const APP = EXPRESS();
const PORT = 3000;

APP.get('/', (req, res) => {
    res.send("Hello World!");
});

APP.post('/test', (req, res) => {
    const BODY = JSON.stringify(req.body)
    console.log(BODY);
    res.send(BODY);
});

APP.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});