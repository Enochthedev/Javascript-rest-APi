const mongoose = require('mongoose');
const Order = require('../models/order');
const Cart = require('../models/cart');
require("dotenv/config");
//get the url from the .env file
const site = process.env.url

exports.orders_get_all = (req, res, next) => {
    // get all orders 
    Order.find()
        .select('_id cart')
        .exec()
        .then(docs => {
            res.status(200).json({
                numberOfOrders: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        cart: doc.cart,
                        request: {
                            type: 'GET',
                            url: site + 'orders/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.orders_create_order = (req, res, next) => {
    // check if cart ID exit by using check cart function
    checkCartId(cartId).then(result => {
        if (result) {
            // create order
            const order = new Order({
                id: mongoose.Types.ObjectId(),
                cart: req.body.cartId
            });
            order.save().then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Order created',
                    createdOrder: {
                        _id: result._id,
                        cart: result.cart
                    },
                    request: {
                        type: 'GET',
                        url: site + 'orders/' + result._id
                    }
                });
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
        } else {
            res.status(404).json({
                message: 'Cart not found'
            });
        }
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    }
    );
};

exports.orders_get_order = (req, res, next) => {
    // get a particular order
    Order.findById(req.params.orderId)
        .select('_id cart')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    order: doc,
                    request: {
                        type: 'GET',
                        url: site + 'orders'
                    }
                });
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}
// might change the logic to make the order invalid
exports.orders_delete_order = (req, res, next) => {
    // delete an order
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'POST',
                    url: site + 'orders',
                    body: { cartId: 'ID', productId: 'ID' }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}


//function to check if the cart exists if not send false
function checkCart(cartId) {
    return new Promise((resolve, reject) => {
        Cart.findById(cartId)
            .exec()
            .then(doc => {
                if (doc) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
            ).catch(err => {
                reject(err);
            });
    });
}

//function to see if cart id is valid
function checkCartId(cartId) {
    return new Promise((resolve, reject) => {
        Cart.findById(cartId)
        .exec()
        .then(doc => {
            if (doc) {
                resolve(true);
            } else {
                resolve(false);
            }
        }
        ).catch(err => {
            reject(err);
        }
        );
    });
}
