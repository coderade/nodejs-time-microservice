'use strict';

const express = require('express');
const service = express();
const request = require('superagent');

const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const GEOCODE_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

service.get('/service/:location', (req, res, next) => {
    let locationParam = req.params.location;
    let geocodeUrl = GEOCODE_API_URL + locationParam + `&key=${GEOCODE_API_KEY}`;

    request.get(geocodeUrl, (err, response) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.json(response.body.results[0].geometry.location);
    });
});

module.exports = service;