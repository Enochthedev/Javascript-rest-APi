const express = require('express');
const app = express();
// const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

//routes which should handle requests
const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false})); //only simple bodies
app.use(bodyParser.json()); //json bodies


// app.use(cors(
//     // {
//     //     origin: 'domain name or ip address'
//     // }
// ));

app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
            }
        });
});
            
module.exports = app;