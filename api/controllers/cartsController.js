const Cart = require('../models/cart');
const Product = require('../models/product');
const user = require('../models/user');



exports.create_cart = (req, res, next) => {}//check if user has a cart currently open if user does then open their cart else create a new cart for them

//not done
exports.add_to_cart = (req, res, next) => {
    const userId = req.body.userId;
    const productId = req.body.productId;
    const quantity = Number.parseInt(req.body.quantity);
    const price = Number.parseInt(req.body.price);
    const total = quantity * price;
    //use the userid to get their cart
    
    

    //check if product exists
    checkProductExists(productId);
    //check if product is in cart
    checkProductInCart(productId);
    //if product exists and is not in cart, add it to cart

};

exports.get_all_carts = (req, res, next) => {
    Cart.find()
        .select('_id productId quantity price total')
        .exec()
        .then(docs => {
            res.status(200).json({
                numberOfItems: docs.length,
                carts: docs.map(doc => {
                    return {
                        _id: doc._id,
                        productId: doc.productId,
                        quantity: doc.quantity,
                        price: doc.price,
                        total: doc.total,
                        request: {
                            type: 'GET',
                            url: site + 'carts/' + doc._id
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

exports.get_cart = (req, res, next) => {
    const id = req.params.cartId;
    Cart.findById(id)
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    cart: doc,
                    request: {
                        type: 'GET',
                        description: 'Get all carts',
                        url: site + 'carts'
                    }
                });
            } else {
                res.status(404).json({
                    message: 'That cart does not exist'
                });
            }
        })
        .catch(err => { //error handling
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.empty_cart = (req, res, next) => {

    Cart.remove()
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Cart emptied',
                request: {
                    type: 'POST',
                    url: site + 'carts',
                    body: {
                        productId: 'ID',
                        quantity: 'Number'
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


//functions 

//check if product exists
function checkProductExists(productId){
    Product
    .findById(productId)
    .exec()
    .then(doc => {
        if(doc){
            return true;
        }
        else{
            return false;
        }
    })
    .catch(err => {
        console.log(err);
        return false;
    });
}
//check if product is in cart
function checkProductInCart(productId){
    Cart
    .findById(productId)
    .exec()
    .then(doc => {
        if(doc){
            return true;
        }
        else{
            return false;
        }
    })
    .catch(err => {
        console.log(err);
        return false;
    });
}