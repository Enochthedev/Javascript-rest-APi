const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    category: {type: String, required: true},
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);