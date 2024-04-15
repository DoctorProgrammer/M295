async function simuliereVerzögerung(verzoegerung) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, verzoegerung);
    });
}

async function addiereNachVerzoegerung(a, b, ms){
    await simuliereVerzögerung(ms);
    console.log(a + b);
}

addiereNachVerzoegerung(3, 7, 2000);