require('dotenv').config();
const bunyan = require('bunyan');
const crypto = require('crypto');

const serviceAccessToken = crypto.randomBytes(16).toString('hex').slice(0, 32);

const log = {
    development: () => bunyan.createLogger({ name: 'TIME-SERVICE-dev', level: 'debug' }),
    production: () => bunyan.createLogger({ name: 'TIME-SERVICE-prod', level: 'info' }),
    test: () => bunyan.createLogger({ name: 'TIME-SERVICE-test', level: 'fatal' }),
};

const getLogger = (env) => {
    const environment = env || process.env.NODE_ENV || 'development';
    return log[environment] ? log[environment]() : log.development();
};

const config = {
    googleTimeApiKey: process.env.GOOGLE_TIME_API_KEY,
    googleGeoApiKey: process.env.GOOGLE_GEO_API_KEY,
    botApiToken: process.env.BOT_API_TOKEN,
    serviceAccessToken: serviceAccessToken,
    log: getLogger,
};

// Validate required environment variables
const requiredEnvVars = ['GOOGLE_TIME_API_KEY', 'GOOGLE_GEO_API_KEY', 'BOT_API_TOKEN'];
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
    }
});

module.exports = config;
