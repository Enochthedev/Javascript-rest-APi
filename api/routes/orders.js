const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
require("dotenv/config");
//get the url from the .env file
const site = process.env.url

//function to check if the product is already in the order list, if it is, increase the quantity by productQuantity
async function checkIfProductExists(product, productQuantity, orderList){
    //check if the product exists in the order list
    let productExists = false;
    orderList.forEach(item => {
        if(item.product == product){
            item.quantity += productQuantity;
            productExists = true;
        }
    });
    return productExists;
}

//admin only route
router.get('/', (req, res, next) => {
    //confirm that the user is an admin
    if(req.userData.isAdmin){
        Order.find()
        .select('_id product quantity')
        .exec()
        .then(docs => {
            //if no orders are found, return 404
            if(docs.length > 0){
                //if orders are found, return 200 with the orders
                res.status(200).json({
                    numberOfItems :docs.length,
                    orders: docs.map(doc => {
                        return {
                            _id: doc._id,
                            product: doc.product,
                            quantity: doc.quantity,
                            request: {
                                type: 'GET',
                                url: site+'orders/' + doc._id
                            }
                        }
                    })
                });
            } else {
                res.status(404).json({ 
                    message: 'No orders found'
                });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    } else {
        //send restricted access message if the user is not an admin
        res.status(401).json({
            message: 'Restricted Access'
        });
    }
});

router.post('/', (req, res, next) => {
    // if the product exists in the order list 
            
});

//admin route(only admin can see the order details of any user)
router.get('/:orderId', (req, res, next) => {
    //get the order by id for the admin 
    Order.findById(req.params.orderId)
    .select('_id product quantity')
    .exec()
    .then(doc => {
        //if the order is found, return 200 with the order
        if(doc){
            res.status(200).json({
                order: doc,
                request: {
                    type: 'GET',
                    url: site+'orders'
                }
            });
        } else {
            //if the order is not found, return 404
            res.status(404).json({ 
                message: 'No valid entry found for provided ID'
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.patch('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'orders updated',
        orderId: req.params.orderId
    });
});


router.delete('/', (req, res, next) => {
    res.status(200).json({
        message: 'orders were deleted'
    });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'order product deleted',
        orderId: req.params.orderId
    });
});




module.exports = router;
