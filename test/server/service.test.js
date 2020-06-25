'use strict';

const request = require('supertest');
const should = require('should');
const config = require('../../config');
const service = require('../../server/service')(config);

describe('Express Service', () => {
    describe('GET /foo', () => {
        it('should return HTTP 404', (done) => {
            request(service)
                .get('/foo')
                .expect(404, done);
        });
    });

    describe('GET /service/:location', () => {
        it('should return HTTP 200 and a valid result with a correct token', (done) => {
            request(service)
                .get('/service/Curitiba')
                .set('X-BOT-SERVICE-TOKEN', config.serviceAccessToken)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    should.exist(res.body.result);
                    res.body.result.should.be.a.String();
                    return done();
                });
        });

        it('should return HTTP 403 if an invalid token was passed', (done) => {
            request(service)
                .get('/service/Curitiba')
                .set('X-BOT-SERVICE-TOKEN', 'invalid-token')
                .expect(403, done);
        });

        it('should return HTTP 500 if Google APIs fail', (done) => {
            const originalGeoApiKey = config.googleGeoApiKey;
            config.googleGeoApiKey = 'invalid-api-key';

            request(service)
                .get('/service/Curitiba')
                .set('X-BOT-SERVICE-TOKEN', config.serviceAccessToken)
                .expect(500)
                .end((err) => {
                    config.googleGeoApiKey = originalGeoApiKey; // Restore original API key
                    if (err) return done(err);
                    return done();
                });
        });

        it('should return HTTP 400 for invalid location format', (done) => {
            request(service)
                .get('/service/')
                .set('X-BOT-SERVICE-TOKEN', config.serviceAccessToken)
                .expect(400, done);
        });
    });
});