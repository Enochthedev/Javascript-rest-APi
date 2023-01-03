const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

//routes which should handle requests
const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false})); //only simple bodies
app.use(bodyParser.json()); //json bodies

app.use((req,re,next)=> {
    res.header('Access-Control-Allow-Origin','*');//change the star to the url of the website you want to allow access to
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
});


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