const express = require('express');
const ListsService = require('./lists-service');
const { requireAuth } = require('../middleware/jwt-auth');
const package = require('../fixtures');
const AuthService = require('../auth/auth-service');

const listsRouter = express.Router();
const jsonBodyParser = express.json();

listsRouter
  .use(requireAuth)
  .route('/')
  .get((req, res, next) => {
    try {
      ListsService.getAllLists(req.app.get('db')).then(lists => {
        res.status(200).json(lists.rows);
      });
    } catch (error) {
      next(error);
    }
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { city, state, name, is_public, tags } = req.body;
    for (const field of ['name', 'city', 'state', 'is_public'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });
    try {
      const newList = {
        name,
        tags,
        city,
        state,
        is_public
      };
      ListsService.insertList(res.app.get('db'), newList).then(list => {
        res.status(200).json(list);
      });
    } catch (error) {
      next(error);
    }
  });
listsRouter
  .use(requireAuth)
  .route('/:list_id')
  .get((req, res, next) => {
    let list = {};
    let package = [];
    let spots = [];
    try {
      ListsService.getListById(req.app.get('db'), req.params.list_id).then(
        resp => {
          list = {
            list_name: resp.rows[0].list_name,
            list_id: resp.rows[0].list_id,
            tags: resp.rows[0].list_tags,
            created_by: resp.rows[0].created_by,
            spots: []
          };
          resp.rows.forEach(x => {
            let item = {
              id: x.spot_id,
              name: x.name,
              tags: x.spots_tags,
              address: x.address,
              city: x.city,
              state: x.state,
              lat: x.lat,
              lng: x.lng
            };
            list.spots.push(item);
          });
          res.status(200).json(list);
        }
      );
    } catch (error) {
      next(error);
    }
  })
  .delete(jsonBodyParser, (req, res, next) => {
    try {
      let db = req.app.get('db');
      ListsService.deleteListReference(
        db,
        req.user.id,
        req.params.list_id
      ).then(
        res
          .status(202)
          .json({ message: `Record ${req.params.list_id} was deleted, ${res}` })
      );
    } catch (error) {
      next(error);
    }
  })
  .patch((req, res, next) => {
    try {
      // need to add verification check to make sure that user owns said list
      ListsService.updateListReference(
        req.app.get('db'),
        req.user.id,
        req.body.editList
      ).then(list => {
        res.status(200).json(list);
      });
    } catch (error) {
      next(error);
    }
  });

listsRouter
  .use(requireAuth)
  .route('/city/:city')
  .get((req, res, next) => {
    try {
      ListsService.getAllListsFromCity(
        req.app.get('db'),
        req.params.city
      ).then(lists => res.status(200).json(lists));
    } catch (error) {
      next(error);
    }
  });
module.exports = listsRouter;
