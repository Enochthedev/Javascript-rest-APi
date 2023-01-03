const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /orders'
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'orders were created'
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
