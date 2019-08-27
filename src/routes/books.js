'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../auth/middleware')

router.get('/books',auth, handleGetAll);
router.get('/books/:id',auth, handleGetOne);

// Route Handlers
function handleGetAll(req, res, next) {
  let books = {
    count: 3,
    results: [
      { title:'Moby Dick' },
      { title:'Little Women' },
      { title: 'Eloquent Javascript' },
    ],
  };
  res.status(200).json(books);
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function handleGetOne(req, res, next) {
  let book = {
    title:'Moby Dick',
  };
  res.status(200).json(book);
}

module.exports = router;
