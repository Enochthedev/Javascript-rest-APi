const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
require("dotenv/config");

//routes which should handle requests
const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
mongoose.set("strictQuery", false);

if (!process.env.DB_CONNECTION) {
  console.log("Error: DB_CONNECTION is not set");
  process.exit(1);
}





mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  
).then(()=>{
  console.log("Connected to database");
}).catch(err => console.log(err))



app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false})); //only simple bodies
app.use(bodyParser.json()); //json bodies




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