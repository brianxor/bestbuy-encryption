import crypto from "crypto";

const findAlpha = (arr) => {
    return arr.find(encodedString => {
        const reversedString = encodedString.split("").reverse().join("");
        const decodedString = atob(reversedString);
        return /^[0-9]+_A_.+$/.test(decodedString);
    }) || null;
}

const findPasswordKey = (arr) => {
    return arr.find(encodedString => {
        const decodedString = atob(encodedString);
        return /^\d+_X_.+$/.test(decodedString);
    }) || null;
}

const generateRandomHex = (length) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}

const generateRandomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateRandomFloat = (min, max, precision) => {
    const randomValue = Math.random() * (max - min) + min;
    return randomValue.toFixed(precision);
}

const getRandomItem = (list) => {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}

export {
    findAlpha,
    findPasswordKey,
    generateRandomHex,
    generateRandomNum,
    generateRandomFloat,
    getRandomItem
}