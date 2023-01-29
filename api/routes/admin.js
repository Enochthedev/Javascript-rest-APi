const { Router } = require('express');
const router = Router(); 
const Admin = require('../model/Admin') 
const tools = require('../tools/tools');

// Get all admins
router.get('/', tools.verifyToken, async(req, res) => {
    try {
        const admins = await Admin.find()
        res.send(admins)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Create a new admin
router.post('/', tools.verifyToken, async(req, res) => {
    try {
        let admin = new Admin({
            key:value
        })
        admin = await admin.save()
        res.send(admin)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Get admin By ID
router.get('/:id', tools.verifyToken, async(req, res) => {
    try {
        const admin = await Admin.findById(req.params.id)
        res.send(admin)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Update admin By ID
router.put('/:id', tools.verifyToken, async(req, res) => {
    try {
        const admin = await Admin.findByIdAndUpdate(req.params.id, {
            key:value
        },{new: true})
        res.send(admin)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Delete admin By ID
router.delete('/:id', tools.verifyToken, async(req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id)
        res.send(admin)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router;