const mongoose = require('mongoose');

const PlacesSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    address: {type: String, required: true},
    image: {type: String, required: true},
    //ref is used to create the relation between two Schemas
    creatorId: {type: mongoose.Types.ObjectId, required: true, ref: 'Users'},
})

module.exports = mongoose.model('Places', PlacesSchema)