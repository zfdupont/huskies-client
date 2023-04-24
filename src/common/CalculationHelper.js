function getFirstDigit(number) {
    return Math.round(number / 10 ** (Math.floor(Math.log10(number))));
}

export function roundUpToFirstDigit(number) {
    if (number <= 0) return 0;
    return getFirstDigit(number) * 10 ** (Math.floor(Math.log10(number)));
}

export function roundDownToFirstDigit(number) {
    if (number <= 0) return 0;
    return getFirstDigit(number) * 10 ** (Math.floor(Math.log10(number)));
}

// Set first digit into 1 or 5
function setFirstDigitSimple(number) {
    let firstDigit = getFirstDigit(number);
    firstDigit = (firstDigit >= 5)? 10 : 1;
    return firstDigit * 10 ** (Math.floor(Math.log10(number)));
}

export function calculateHeatMapFeatureValues(min, max) {
    let start = roundDownToFirstDigit(min);
    start = setFirstDigitSimple(start);
    let end = roundUpToFirstDigit(max);
    let variation = roundDownToFirstDigit(Math.ceil((end - start) / 5));
    let values = []
    for (let i = 0; i < 5; i++) {
        values.push((start + (i * variation)))
    }
    values.push(end);
    return values;
}