const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const tools = require('../tools/tools');

//routes, login, signup, get payment status
const Auths = require('../model/Auths') 

// Get all authss
router.get('/', async(req, res) => {
    try {
        const authss = await Auths.find()
        res.send(authss)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Create a new auths
router.post('/', async(req, res) => {
    try {
        let auths = new Auths({
            key:value
        })
        auths = await auths.save()
        res.send(auths)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Get auths By ID
router.get('/:id', async(req, res) => {
    try {
        const auths = await Auths.findById(req.params.id)
        res.send(auths)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Update auths By ID
router.put('/:id', async(req, res) => {
    try {
        const auths = await Auths.findByIdAndUpdate(req.params.id, {
            key:value
        },{new: true})
        res.send(auths)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Delete auths By ID
router.delete('/:id', async(req, res) => {
    try {
        const auths = await Auths.findByIdAndDelete(req.params.id)
        res.send(auths)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router;