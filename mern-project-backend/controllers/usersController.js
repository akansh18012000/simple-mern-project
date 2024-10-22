const {validationResult} = require('express-validator');
const bcrypt =  require('bcrypt')
const jwt = require('jsonwebtoken');
const UserModel = require('../models/users');
const HttpError = require("../models/httpError");

const getUsers = async (req, res, next) => {
    let users;

    try {
        // This will return all the properties from the user documents except the password
        users = await UserModel.find({}, '-password')
    }catch (error) {
        return next(new HttpError('Could not the users. Please try again later', 500));
    }
    // getters:true will return the id as a string instead of ObjectId which is the type of the id stored in database.
    res?.json({users: users.map((user) => user?.toObject({getters: true}))});
}

const userSignUp = async (req, res, next) => {
    const error = validationResult(req);
    if (!error?.isEmpty()) {
        return next(new HttpError('Could not Sign Up. Please check the data', 422));
    }
    const {name, email, password,} = req?.body;

    let existingUser;

    try {
        existingUser = await UserModel?.findOne({email: email})
    }
    catch {
        return next(new HttpError('Could not check if the email alreadt exists. Please try again later', 500))
    }

    if(existingUser) {
        return next(new HttpError('Could not create an account as the email is alreay in use. Please add a different email id', 404))
    }

    let newUser;
    let hashedPassword;

    try {
        hashedPassword = await bcrypt?.hash(password, 12);
    } catch (error) {
        return next(new HttpError('Could not Sign Up. Please try again later', 500));
    }

    const createdUser = new UserModel({
        name,
        email,
        password: hashedPassword,
        places: [],
        image: req?.file?.path,
    });

    try {
        newUser = await createdUser.save()
    }
    catch (error) {
        return next(new HttpError(`Could not create an account. Please try again later`, 404))
    }

    let token;
    try {
        // Mongoose addes the id property, created by MongoDB, to the documents.
        token = jwt.sign({userId: createdUser?.id, email: createdUser?.email}, `${process.env.JWT_KEY}`, {expiresIn: '1h'})
    } catch (error) {
        return next(new HttpError('Could not Sign Up. Please try again later', 500));
    }

    res?.status(201)?.json({user: {...newUser?.toObject({getters: true}), token: token}})
}

const userLogin = async (req, res, next) => {
    const error = validationResult(req);
    if (!error?.isEmpty()) {
        return next(new HttpError('Could not Login In. Please check the data', 422));
    }
    const {email, password} = req?.body;

    let identifiedUser;

    try {
        identifiedUser = await UserModel?.findOne({email: email})
    }
    catch {
        return next(new HttpError('Could not check if the email alreadt exists. Please try again later', 500))
    }

    if (!identifiedUser) {
        return next(new HttpError('Could Not Login as the Credentials are not matching', 401));
    }

    let isValidPassword = false;

    try {
        isValidPassword = bcrypt.compare(password, identifiedUser?.password)
    } catch (error) {
        return next(new HttpError('Could not Log In. Please try again later', 500));
    }

    if (!isValidPassword) {
        return next(new HttpError('Could Not Login as the Credentials are not matching', 401));
    }

    let token;
    try {
        // Mongoose addes the id property, created by MongoDB, to the documents.
        token = jwt.sign({userId: identifiedUser?.id, email: identifiedUser?.email}, `${process.env.JWT_KEY}`, {expiresIn: '1h'})
    } catch (error) {
        return next(new HttpError('Could not Log In. Please try again later', 500));
    }

    res?.status(200)?.json({user: {...identifiedUser?.toObject({getters: true}), token: token}});    
}

module.exports = {
    getUsers,
    userSignUp,
    userLogin,
}