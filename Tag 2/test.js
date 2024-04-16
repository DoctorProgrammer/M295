function isMagic(num) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

console.log(isMagic(2));
console.log(isMagic(7));
console.log(isMagic(11));
console.log(isMagic(20));
console.log(isMagic(21));