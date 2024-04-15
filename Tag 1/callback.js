function verdoppeln(zahl, callback) {
    setTimeout(() => {
        callback(zahl * 2);
    }, 1000);
}

verdoppeln(5, function (ergebnis) {
    console.log('Das Ergebnis ist:', ergebnis);
});

/*
Auch möglich:

verdoppeln(5, (ergebnis) => {
    console.log('Das Ergebnis ist:', ergebnis);
});
*/