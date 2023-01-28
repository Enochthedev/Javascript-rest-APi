const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Carts = require('../model/Carts');
const tools = require('../tools/tools');
//routes, login, signup, get payment status 


// Get all carts
router.get('/',tools.verifyToken)

// Create a new carts
router.post('/')

// Get carts By ID
router.get('/:id')

// Update carts By ID
router.put('/:id')

// Delete carts By ID
router.delete('/:id')

module.exports = router




module.exports = router;