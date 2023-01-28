const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const previousUserSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type : String,
        required : true,
        unique : true
    },
    firstName: {
        type : String,
        required : true
    },
    lastName: {
        type : String,
        reqired: true
    },
    status: {
        type : String,
        required : true,
        enum: ['active', 'inactive']
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('PreviousUser', previousUserSchema);