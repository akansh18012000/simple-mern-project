const express = require('express');
const {check} = require('express-validator')
const checkAuth = require('../middleware/checkAuth')

const router = express?.Router();

const placesController = require('../controllers/placesController')

router.get('/:pid', placesController?.getPlaceById);

router.get('/user/:uid', placesController?.getPlacesByUserId);

// Adding Middleware to Check token for the POST, PATCH and DELETE Requests
router.use(checkAuth);

// We can have more than 1 middleware for a request which will be executed from left to right.

router.post('/', [check('title')?.notEmpty(), check('description')?.isLength({min: 5}), check('address')?.notEmpty()], placesController?.createPlace);

router.patch('/:pid', [check('title')?.notEmpty(), check('description')?.isLength({min: 5})], placesController?.updatePlace)

router?.delete('/:pid', placesController?.deletePlace)

module.exports = router