const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const placeRoutes = require('./routes/placeRoutes');
const userRoutes = require('./routes/userRoutes')
const HttpError = require('./models/httpError');

const app = express();

const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.zwbu7fr.mongodb.net/?retryWrites=true&w=majority`

// Converts Body of the received requests into JSON and then calls the Next Middleware function.

app.use(bodyParser?.json());

// Middleware for sending images. We are using path here because static method require the absolute path.
app.use('uploads\\images', express.static(path.join('uploads', '\\', 'images')))

// Adds Headers in the response for the CORS issues.
app.use((req, res, next) => {
    res?.setHeader('Access-Control-Allow-Origin', '*');
    res?.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res?.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
})

app.use('/api/places', placeRoutes);

app.use('/api/users', userRoutes);


// This Function executes whenever an invalid Route is being hit (i.e. /api/placeId)

app.use((req, res, next) => {
    next(new HttpError('Could not find a valid route', 404));
});

// This Function executes whenever the above middleware functions throw any error

app.use((error, req, res, next) => {
    // To Delete the File stored in the uploads folder if the signup has failed.
    if(req?.file) {
        fs.unlink(req?.file?.path, (error) => {
            console.log(error)
        })
    }
    // To Check if the Error has already been sent.
    if(res?.headerSent) {
        return next(error)
    }
    res?.status(error?.code || 500);
    res?.json({message: error?.message || 'An Unknown Error Occured'})
    
});

mongoose.connect(dbUrl).then(() => app.listen(5000)).catch((err) => console.log({err}))
