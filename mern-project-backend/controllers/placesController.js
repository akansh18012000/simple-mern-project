const {validationResult} = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/httpError');
const PlaceModel = require('../models/places');
const UserModel = require('../models/users');


const getPlaceById = async (req, res, next) => {
    const placeId = req?.params?.pid;
    let place;
    try {
        place = await PlaceModel?.findById(placeId)
    } catch (error) {
        return next(new HttpError('Something went wrong could not find the place', 500));
    }
    
    if (!place) {
        return next(new HttpError('Could not get the specified place from id', 404));
    }
    // getters:true will return the id as a string instead of ObjectId which is the type of the id stored in database.
    res?.json({place: place.toObject({getters: true})});
}

const getPlacesByUserId = async (req, res, next) => {
    const userId = req?.params?.uid;
    let places;
    try {
        // We can populate method here as well to show the places added by a specific user. This will return the user document.
        // user = await UserModel.findById(userId).populate('places');
        places = await PlaceModel.find({creatorId: userId}).exec();
    }
    catch (error) {
        return next(new HttpError('Something went wrong could not find the places for the specified user', 500));
    }
    if (!places?.length) {
        return next(new HttpError('Could not get the specified places from user id', 404));
    }
    res?.json({places: places?.map((place) => place?.toObject({getters: true}))});
}

const createPlace = async (req, res, next) => {
    const error = validationResult(req);
    if (!error?.isEmpty()) {
        return next(new HttpError('Could not create the place. Please check the data', 422));
    }
    const { creatorId } = req?.body;
    let user;
    try {
        user = await UserModel?.findById(creatorId);
    } catch (error) {
        return new HttpError('Could Not Find the User. Please try again.', 500)
    }
    const createdPlace = new PlaceModel({
        ...req?.body,
        image: 'https://picsum.photos/200',
    });
    let result;
    try {
        // using transactions in a session to perform multiple operations.
        const session = await mongoose.startSession();
        session?.startTransaction();
        result = await createdPlace?.save({session: session});
        // push function is used to create a relation between two collections. Mongo Db takes the id of the created place and adds it to the places array. 
        user.places.push(createdPlace);
        await user?.save({session: session});
        await session.commitTransaction();
    }
    catch (err) {
        return new HttpError('Could Not Save Data. Please try again later', 500)
    }
    res?.status(201);
    res?.json(result);
}

const updatePlace = async (req, res, next) => {
    const error = validationResult(req);
    if (!error?.isEmpty()) {
        return next(new HttpError('Could not update the place. Please check the data', 422));
    }
    const placeId = req?.params?.pid;
    let place;

    try {
        place = await PlaceModel?.findById(placeId)
    }
    catch {
        return next(new HttpError('Something went wrong could not find the place', 500));
    }
    // This check is added so that from Postman, other users can't update the places they have not created.
    if (place?.creatorId?.toString() !== req.userData.userId) {
        return next(new HttpError('You are not allowed to update the place', 401));
    }

    const {title, description} = req?.body;
    place.title = title;
    place.description = description;

    try {
        result = await place?.save()
    }
    catch (err) {
        return next(new HttpError('Could Not Update Data. Please try again later', 500));
    }

    res?.status(200)?.json({updatedPlace: place?.toObject({getters: true})});
}

const deletePlace = async (req, res, next) => {
    const placeId = req?.params?.pid;
    let place;

    try {
        // populate method will get the user from the users collection based on the creatorId stored in the place. creatorId will contain the entire user document.
        place = await PlaceModel?.findById(placeId).populate('creatorId')
    }
    catch {
        return next(new HttpError('Something went wrong could not find the place', 500));
    }

    if(!place) {
        return next(new HttpError('Could Not Find the specified place.', 500));
    }
    // This check is added so that from Postman, other users can't delete the places they have not created.
    if (place?.creatorId?.id !== req.userData.userId) {
        return next(new HttpError('You are not allowed to delete the place', 401));
    }

    try {
        const session = await mongoose.startSession();
        session?.startTransaction();
        await place.deleteOne({session: session});
        place?.creatorId?.places?.pull(place);
        await place.creatorId.save({session: session});
        await session?.commitTransaction();
    }
    catch (err) {
        return next(new HttpError('Could Not Delete Data. Please try again later', 500));
    }
    
    res?.status(200)?.json({message: 'DELETED PLACE'});
}

module.exports = {
    getPlaceById,
    getPlacesByUserId,
    createPlace,
    updatePlace,
    deletePlace,
}