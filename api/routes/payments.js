const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//routes, get payment status, update payment status
const Payments = require('../model/Payments') 

// Get all paymentss
router.get('/', async(req, res) => {
    try {
        const paymentss = await Payments.find()
        res.send(paymentss)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Create a new payments
router.post('/', async(req, res) => {
    try {
        let payments = new Payments({
            key:value
        })
        payments = await payments.save()
        res.send(payments)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Get payments By ID
router.get('/:id', async(req, res) => {
    try {
        const payments = await Payments.findById(req.params.id)
        res.send(payments)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Update payments By ID
router.put('/:id', async(req, res) => {
    try {
        const payments = await Payments.findByIdAndUpdate(req.params.id, {
            key:value
        },{new: true})
        res.send(payments)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Delete payments By ID
router.delete('/:id', async(req, res) => {
    try {
        const payments = await Payments.findByIdAndDelete(req.params.id)
        res.send(payments)
    } catch (error) {
        res.status(500).send(error.message)
    }
})




module.exports = router;