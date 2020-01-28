const express = require('express');
const SpotsService = require('./spots-service');
const {requireAuth} = require('../middleware/jwt-auth');
const https = require('https');
const spotsRouter = express.Router();
const jsonBodyParser = express.json();
const API_KEY = process.env.API_GEO_KEY;

spotsRouter
  .use(requireAuth)
  .route('/')
  /*Return all records on spots*/
  .get((req, res, next) => {
    try {
      SpotsService.getAllSpots(req.app.get('db')).then(spots => {
        res.status(200).json(spots);
      });
    } catch (error) {
      next(error);
    }
  })
  /* Creates records in spots, lists_spots. Returns spot with lat/lng
   * from Google Geocode API */
  .post(jsonBodyParser, (req, res, next) => {
    try {
      let {list_id, name, address, city, state, tags} = req.body;
      address = address.replace(/ /g, '+');
      city = city.replace(/ /g, '+');
      /*Using Google-GeoCode - returns the lat and lng of addresses
       * Doc: https://developers.google.com/maps/documentation/geocoding/start*/
      https.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address},+${city},+${state}&key=${API_KEY}`,
        ress => {
          ress.setEncoding('utf8');
          let body = '';
          ress.on('data', data => {
            body += data;
          });
          ress.on('end', () => {
            body = JSON.parse(body);
            try {
              let newSpot = {
                address: address.replace(/[+]/g, ' '),
                city: city.replace(/[_]/g, ' '),
                tags,
                lat: body.results[0].geometry.location.lat,
                lon: body.results[0].geometry.location.lng,
                name,
                state,
              };
              return SpotsService.insertSpot(
                req.app.get('db'),
                newSpot,
                list_id,
              ).then(spot => {
                return res.status(200).json(spot);
              });
            } catch (error) {
              next(error);
            }
          });
        },
      );
    } catch (error) {
      next(error);
    }
  });
spotsRouter
  .use(requireAuth)
  /*Returns the record for the spot*/
  .route('/:spot_id')
  .get((req, res, next) => {
    try {
      SpotsService.getSpotById(req.app.get('db'), req.params.spot_id).then(
        spot => {
          res.status(200).json(spot);
        },
      );
    } catch (error) {
      next(error);
    }
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const {name, address, city, state, lat, lon, tags, list_id} = req.body;
    for (const field of ['name', 'city', 'state', 'address', 'list_id'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`,
        });
    try {
      let edittedSpot = {
        name,
        address,
        city,
        state,
        tags,
      };
      SpotsService.updateSpot(
        req.app.get('db'),
        req.params.spot_id,
        req.user.id,
        list_id,
        edittedSpot,
      ).then(spot => {
        res.status(200).json(spot);
      });
    } catch (error) {
      next(error);
    }
  })
  /*If record belongs to logged in user;
   * Delete record found in spot, lists_spots.*/
  .delete((req, res, next) => {
    try {
      return SpotsService.deleteSpotReference(
        req.app.get('db'),
        parseInt(req.params.spot_id),
        req.user.id,
      ).then(response => {
        return res.status(200).json({message: response});
      });
    } catch (error) {
      next(error);
    }
  });

module.exports = spotsRouter;
