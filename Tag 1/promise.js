const fs = require('fs');

function leseDateiInhalt(datei) {
    return new Promise((resolve, reject) => {
        fs.readFile(datei, (err, inhalt) => {
            if (err) {
                reject(err);
            } else {
                resolve(inhalt);
            }
        });
    });
}

leseDateiInhalt('baby-steps.js')
    .then(inhalt => {
        console.log('Die Länge des Dateiinhalts beträgt:', inhalt.length);
    })
    .catch(err => {
        console.error('Fehler beim Lesen der Datei:', err);
    });