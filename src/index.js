import express from 'express';
import * as config from './config/index.js';
import * as lib from './lib/index.js';
import Encryptor from './encryptor/index.js';
import bodyParser from 'body-parser';
import morgan from 'morgan';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(morgan('common'));


const emailEncryptor = new Encryptor(config.ENCRYPTION_CONFIG.email.publicKey, config.ENCRYPTION_CONFIG.defaultAlgorithm);
const activityEncryptor = new Encryptor(config.ENCRYPTION_CONFIG.activity.publicKey, config.ENCRYPTION_CONFIG.defaultAlgorithm);
const infoEncryptor = new Encryptor(config.ENCRYPTION_CONFIG.activity.publicKey, config.ENCRYPTION_CONFIG.defaultAlgorithm);
const gridEncryptor = new Encryptor(config.ENCRYPTION_CONFIG.grid.publicKey, config.ENCRYPTION_CONFIG.defaultAlgorithm);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, error: 'internal server error' });
});

app.post('/encrypt/email', (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, error: 'missing required fields' });
        }

        const encryptedEmail = emailEncryptor.encryptData(email, config.ENCRYPTION_CONFIG.email.keyId);
        res.status(200).json({ success: true, encryptedData: encryptedEmail });
    } catch (error) {
        next(error);
    }
});

app.post('/encrypt/activity', (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, error: 'missing required fields' });
        }

        const activityData = lib.generateActivityData(email);
        const encryptedActivity = activityEncryptor.encryptData(JSON.stringify(activityData), config.ENCRYPTION_CONFIG.activity.keyId);
        
        res.status(200).json({ success: true, encryptedData: encryptedActivity, plainData: activityData });
    } catch (error) {
        next(error);
    }
});

app.post('/encrypt/info', (req, res, next) => {
    try {
        const { userAgent } = req.body;

        if (!userAgent) {
            return res.status(400).json({ success: false, error: 'missing required fields' });
        }

        const infoData = lib.generateInfoData(userAgent);
        const encryptedInfo = infoEncryptor.encryptData(JSON.stringify(infoData), config.ENCRYPTION_CONFIG.activity.keyId);
        
        res.status(200).json({ success: true, encryptedData: encryptedInfo });
    } catch (error) {
        next(error);
    }
});

app.post('/alpha', (req, res, next) => {
    try {
        const { alphaList } = req.body;

        if (!Array.isArray(alphaList) || alphaList.length === 0) {
            return res.status(400).json({ success: false, error: 'alphaList must be a non-empty array' });
        }

        const alpha = lib.generateAlpha(alphaList);

        if (!alpha) {
            return res.status(404).json({ success: false, error: 'Failed parsing alpha' });
        }

        res.status(200).json({ success: true, alpha: alpha });
    } catch (error) {
        next(error);
    }
});

app.get('/grid', (req, res, next) => {
    try {
        const gridData = lib.generateGridData();
        const encryptedGrid = gridEncryptor.encryptData(JSON.stringify(gridData), config.ENCRYPTION_CONFIG.grid.keyId);

        const gridFingerprint = lib.generateGridFingerprint();
       
        res.status(200).json({ success: true, encryptedData: encryptedGrid, plainData: gridData, gridFingerprint: JSON.stringify(gridFingerprint) });
    } catch (error) {
        next(error);
    }
});

app.post('/password', (req, res, next) => {
    try {
        const { passwordKeyList } = req.body;

        if (!Array.isArray(passwordKeyList) || passwordKeyList.length === 0) {
            return res.status(400).json({ success: false, error: 'passwordKeyList must be a non-empty array' });
        }

        const passwordKey = lib.generatePasswordKey(passwordKeyList);

        if (!passwordKey) {
            return res.status(404).json({ success: false, error: 'Failed parsing password key' });
        }

        res.status(200).json({ success: true, passwordKey: passwordKey });
    } catch (error) {
        next(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
