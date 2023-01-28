const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Carts = require('../models/cart');
const tools = require('../tools/tools');
//routes, login, signup, get payment status 


// Get all carts
router.get('/',tools.verifyToken)

// Create a new carts
router.post('/',tools.verifyToken)

// Get carts By ID
router.get('/:id',tools.verifyToken)

// Update carts By ID
router.put('/:id',tools.verifyToken)

// Delete carts By ID
router.delete('/:id',tools.verifyToken)





module.exports = router;