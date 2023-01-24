const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const{ orders_get_all, orders_create_order, orders_get_order, } = require('../controllers/ordersController');
const Order = require('../models/order');

require("dotenv/config");
//get the url from the .env file
const site = process.env.url

//admin only route
router.get('/', orders_get_all);

//general (create order)
router.post('/create', orders_create_order);

//general (get order)
router.get('/:orderId', orders_get_order);


    

module.exports = router;
