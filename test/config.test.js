'use strict';

const should = require('should');
const config = require('../../config');

describe('Configuration Module', () => {
    it('should load Google API keys from environment variables', () => {
        should.exist(config.googleTimeApiKey);
        config.googleTimeApiKey.should.be.a.String();

        should.exist(config.googleGeoApiKey);
        config.googleGeoApiKey.should.be.a.String();
    });

    it('should generate a service access token', () => {
        should.exist(config.serviceAccessToken);
        config.serviceAccessToken.should.be.a.String();
        config.serviceAccessToken.length.should.be.above(0);
    });

    it('should load the bot API token from environment variables', () => {
        should.exist(config.botApiToken);
        config.botApiToken.should.be.a.String();
    });

    it('should throw an error if a required environment variable is missing', () => {
        const originalGeoApiKey = process.env.GOOGLE_GEO_API_KEY;
        delete process.env.GOOGLE_GEO_API_KEY;

        should(() => {
            require('../../config');
        }).throw('Missing required environment variable: GOOGLE_GEO_API_KEY');

        process.env.GOOGLE_GEO_API_KEY = originalGeoApiKey; // Restore original API key
    });
});
