const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /orders'
    });
});

router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }  
    res.status(201).json({
        message: 'orders were created',
        order: order
    });
});

router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'orders details',
        orderId: req.params.orderId
    });
});


router.delete('/', (req, res, next) => {
    res.status(200).json({
        message: 'orders were deleted'
    });
});



module.exports = router;
