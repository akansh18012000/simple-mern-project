const express = require('express');
const {check} = require('express-validator')


const usersController = require('../controllers/usersController')
const fileUpload = require('../middleware/fileUpload')

const router = express?.Router();

router.get('/', usersController?.getUsers);

router.post('/signup', fileUpload.single('image'), [check('name')?.notEmpty(),check('email')?.normalizeEmail()?.isEmail(), check('password')?.isLength({min: 6})], usersController?.userSignUp);

router.post('/login', [check('email')?.normalizeEmail()?.isEmail(), check('password')?.isLength({min: 6})], usersController?.userLogin);

module.exports = router