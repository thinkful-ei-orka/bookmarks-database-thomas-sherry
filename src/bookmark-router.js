const express = require('express')
const { v4: uuid } = require('uuid')

const bookmarksRouter = express.Router()
//const { bookmarks } = require('./store')
const bodyParser = express.json()
const logger = require('./logger')
const BookmarksService = require('./bookmarks-service')

bookmarksRouter
  .route('/')
  .get((req, res) => {
    const knexInstance = req.app.get('db')
    return BookmarksService.getAllBookmarks(knexInstance)
      .then(bookmarks => {
        res.json(bookmarks)
      })
  })

  .post(bodyParser, (req, res) => {
    const { title, url, desc, rating } = req.body
    if (!title) {
      logger.error('No title found: Title is required');
      return res
        .status(400)
        .send('Title is required');
    }
    if (!url) {
      logger.error('No URL found: URL is required');
      return res
        .status(400)
        .send('URL is required');
    }
    if (!desc) {
      logger.error('No description found: Description is required');
      return res
        .status(400)
        .send('A description is required');
    }
    if (!rating) {
      logger.error('No rating found: Rating is required');
      return res
        .status(400)
        .send('A rating is required');
    }
    if (url.length < 5 && !url.startsWith('http')) {
      logger.error('URL incorrect: URL must start with "http"');
      return res
        .status(400)
        .send('URL must be in proper format');
    }
    if (Number(rating) === 'NaN' || Number(rating) > 5 || Number(rating) < 1) {
      logger.error('Rating incorrect: Rating must be a number between 1 and 5');
      return res
        .status(400)
        .send('Rating must be a number between 1 and 5');
    }
    const newId = uuid()
    bookmarks.push({id: newId, title, url, desc, rating: String(rating) })
    logger.info(`Bookmark with ID: ${newId} created`);
    res
      .status(201)
      .location(`http://host:8000/bookmarks/${newId}`)
      .json(bookmarks)
  })

bookmarksRouter
  .route('/:id')
  .get((req, res) => {
    const { id } = req.params;
    if (!id) {
      logger.error('No ID found: ID is required to look up single bookmark');
      return res
        .status(404)
        .send('Bookmark not found');
    }
    const knexInstance = req.app.get('db')
    return BookmarksService.getById(knexInstance, id)
    .then(bookmark => {

    if (!bookmark) {
      logger.error(`No bookmark found: ${id} does not match any bookmark`);
      return res
        .status(404)
        .send('Bookmark not found');
    }
      res.json(bookmark)
    })
  })
  
  .delete((req, res) => {
    const { id } = req.params;
    const index = bookmarks.indexOf(bookmark => bookmark.id == id);
    if (!id) {
      logger.error('No ID found: ID is required to DELETE a single bookmark');
      return res
        .status(400)
        .send('Please provide a valid ID');
    }
    if (!index) {
      logger.error(`No bookmark found: ${id} does not match any bookmark`);
      return res
        .status(400)
        .send('ID does match any entries');
    }
    bookmarks.splice(index, 1);

    logger.info(`Card with id ${id} deleted.`);
    res
      .status(204)
      .end();
  })

  module.exports = bookmarksRouter