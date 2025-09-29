import * as utilities from '../utilities/index.js';
import * as config from '../config/index.js';

const generateActivityData = (email) => {
    const activityTimestamp = (new Date).toISOString()

    const activityData = {
        "mouseMoved": true,
        "keyboardUsed": true,
        "fieldReceivedInput": true,
        "fieldReceivedFocus": true,
        "timestamp": activityTimestamp,
        "email": email,
    };

    return activityData;
};

const generateInfoData = (userAgent) => {
    const infoData = {
        "userAgent": userAgent
    }

    return infoData;
};

const generateGridData = () => {
    const gridData = {
        "bP": utilities.generateRandomHex(config.SHA1_LENGTH), // Plugins Hash
        "cH": utilities.generateRandomHex(config.SHA1_LENGTH), // Canvas Hash
        "wH": utilities.generateRandomHex(config.SHA1_LENGTH), // Webgl Hash
        "p": "Win32", // Platform
        "os": "Windows", // Operating System
        "cD": 24, // Color Depth
        "nC": 12, // Hardware Concurrency
        "tS": false // Touch Start
    }

    return gridData;
};

const generateGridFingerprint = () => {
    const randomTimezone = utilities.getRandomItem(config.FINGERPRINT.timezones);
    const randomGpu = utilities.getRandomItem(config.FINGERPRINT.gpus);
    let [gpuVendor, gpuName] = randomGpu.split(config.FINGERPRINT.gpuSeparator);
    
    const gridFingerprint = {
        "gCV": gpuName, // Graphics Card Vendor
        "gCN": gpuVendor, // Grapichs Card Name
        "aB": utilities.generateRandomFloat(100, 150, 14), // Audio
        "sR": "1920, 1080", // Screen Size
        "sL": "en-US", // Language
        "sF": utilities.generateRandomHex(config.SHA1_LENGTH), // Fonts Hash
        "sFC": utilities.generateRandomNum(45, 60), // Fonts Count
        "sT": randomTimezone // Timezone
    };

    return gridFingerprint;
}

const generateAlpha = (alphaList) => {
    const alpha = utilities.findAlpha(alphaList);
    return alpha;
};

const generatePasswordKey = (passwordKeyList) => {
    const passwordKey = utilities.findPasswordKey(passwordKeyList);
    return passwordKey;
};

export {
    generateActivityData,
    generateInfoData,
    generateGridData,
    generateGridFingerprint,
    generateAlpha,
    generatePasswordKey
}