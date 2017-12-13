'use strict';

const express = require('express');
const service = express();
const request = require('superagent');
const moment = require('moment');

const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const GEOCODE_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const TIMEZONE_API_KEY = process.env.TIMEZONE_API_KEY;
const TIMEZONE_API_URL = 'https://maps.googleapis.com/maps/api/timezone/json';

service.get('/service/:location', (req, res) => {
    let locationParam = req.params.location;

    request
        .get(GEOCODE_API_URL)
        .query({address: locationParam})
        .query({key: GEOCODE_API_KEY})
        .end((err, response) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }

            const locationResponse = response.body.results[0].geometry.location;
            const latLocation = locationResponse.lat;
            const longLocation = locationResponse.lng;
            const timezoneLocationParam = latLocation + ',' + longLocation;

            const timestamp = +moment().format('X');

            request
                .get(TIMEZONE_API_URL)
                .query({location: timezoneLocationParam})
                .query({timestamp: timestamp})
                .query({key: TIMEZONE_API_KEY})
                .end((err, response) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    }

                    const result = response.body;
                    const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset)
                        .utc().format('dddd, MMMM Do YYYY, h:mm:ss a');

                    res.json({result: timeString});
                });


        });
});

module.exports = service;
