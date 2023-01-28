const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    price: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
});

const CartSchema = new Schema({
    items: [ItemSchema],
    subTotal: {
        type: Number,
        default: 0
    }
    ,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cart', CartSchema);