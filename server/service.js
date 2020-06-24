'use strict';

const express = require('express');
const request = require('superagent');
const moment = require('moment');

const GEOCODE_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const TIMEZONE_API_URL = 'https://maps.googleapis.com/maps/api/timezone/json';

module.exports = (config) => {
    const service = express();
    const log = config.log();

    service.get('/service/:location', async (req, res) => {
        try {
            if (req.get('X-BOT-SERVICE-TOKEN') !== config.serviceAccessToken) {
                return res.sendStatus(403);
            }

            const locationParam = req.params.location;
            const TIMEZONE_API_KEY = config.googleTimeApiKey;
            const GEOCODE_API_KEY = config.googleGeoApiKey;

            const geocodeResponse = await fetchGeocode(locationParam, GEOCODE_API_KEY, log);
            if (!geocodeResponse) {
                return res.sendStatus(500);
            }

            const { lat, lng } = geocodeResponse;
            const timestamp = moment().unix();

            const timezoneResponse = await fetchTimezone(lat, lng, timestamp, TIMEZONE_API_KEY, log);
            if (!timezoneResponse) {
                return res.sendStatus(500);
            }

            const timeString = formatTimeString(timestamp, timezoneResponse);
            res.json({ result: timeString });
        } catch (error) {
            log.error(error);
            res.sendStatus(500);
        }
    });

    return service;
};

async function fetchGeocode(location, apiKey, log) {
    try {
        const response = await request
            .get(GEOCODE_API_URL)
            .query({ address: location })
            .query({ key: apiKey });

        if (response.body.results.length === 0) {
            throw new Error('No results found for the given location');
        }

        return response.body.results[0].geometry.location;
    } catch (error) {
        log.error(`Geocode API error: ${error.message}`);
        return null;
    }
}

async function fetchTimezone(lat, lng, timestamp, apiKey, log) {
    try {
        const response = await request
            .get(TIMEZONE_API_URL)
            .query({ location: `${lat},${lng}` })
            .query({ timestamp })
            .query({ key: apiKey });

        if (!response.body) {
            throw new Error('Invalid response from Timezone API');
        }

        return response.body;
    } catch (error) {
        log.error(`Timezone API error: ${error.message}`);
        return null;
    }
}

function formatTimeString(timestamp, timezoneData) {
    return moment
        .unix(timestamp + timezoneData.dstOffset + timezoneData.rawOffset)
        .utc()
        .format('dddd, MMMM Do YYYY, h:mm:ss a');
}
