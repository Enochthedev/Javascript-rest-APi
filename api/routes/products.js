const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
require("dotenv/config");
//get the url from the .env file
const site = process.env.url

//function to check if a product already exists
async function checkForDuplicates(products) {
  // Create an array to store the non-duplicate products
  const uniqueProducts = [];
  // Loop through the products
  for (const product of products) {
    // Check if a product with the same name already exists in the database
    const existingProduct = await Product.findOne({ name: product.name });
    if (!existingProduct) {
      // If a product with the same name does not exist, add it to the array
      uniqueProducts.push(product);
    }
  }
  return uniqueProducts;
}
//function to see the duplicates in the array
function compareLists(list1, list2) {
    // Find elements that are in list1 but not list2
    const difference = list1.filter(x => !list2.includes(x));
    return difference;
}


router.get('/', (req, res, next) => {
    Product.find()
    .select('_id name price')
    .exec()
    .then(docs => {
        //if no products are found, return 404
        if(docs.length > 0){
            res.status(200).json({
                numberOfItems :docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        request: {
                            type: 'GET',
                            url: site+'products/' + doc._id
                        }
                    }
                })
            });
        } else {
            res.status(404).json({ 
                message: 'No products found'
            });
        }

    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.post('/', (req, res, next) => {
    //check if body is an array
    if(Array.isArray(req.body)){
        //check for duplicates
        checkForDuplicates(req.body).then(uniqueProducts => {
            //if there are no duplicates, create the products
            const duplicates=compareLists(req.body, uniqueProducts);
            if(uniqueProducts.length > 0){
                Product.insertMany(uniqueProducts)
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        Notice: 'The following products already exist',
                        AlreadyExisting: {
                            numberOfItems: duplicates.length,
                            products: duplicates.map(doc => {
                                return {
                                    name: doc.name,
                                    price: doc.price
                                }
                            })
                        },
                        message: 'Products created',
                        createdProducts: {
                            numberOfItems: uniqueProducts.length,
                            products: uniqueProducts.map(result => {
                                return {
                                    _id: result._id,
                                    name: result.name,
                                    price: result.price
                                }
                            }
                            )
                        }

                    });
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({error: err});
                }
                );
            } else {
                //if there are duplicates, return 409
                res.status(409).json({
                    message: 'All Products already exist',
                    AlreadyExisting: {
                        numberOfItems: duplicates.length,
                        products: duplicates.map(doc => {
                            return {
                                name: doc.name,
                                price: doc.price,
                            }
                        })
                    }
                });
            }
        });
        
    }
    //if it is not an array, then create a single product
    else{
        //check if the product already exists
        Product.find({name: req.body.name})
        .exec()
        .then(docs => {
            //if the product already exists, return 409
            if(docs.length > 0){
                res.status(409).json({
                    message: 'Product already exists',
                    //send the details of the product
                    details: {
                        _id: docs[0]._id,
                        name: docs[0].name,
                        price: docs[0].price,
                        request: {
                            type: 'GET',
                            url: site+'products/' + docs[0]._id
                        }
                    }

                });
            } else {
                //if the product does not exist, create it
                const product = new Product({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    price: req.body.price
                });
                product.save().then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: 'Product created',
                        createdProduct: {
                            _id: result._id,
                            name: result.name,
                            price: result.price,
                            return:{
                                type: 'GET',
                                url: site+'products/' + result._id
                            }
                        }
                    });
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({error: err});
                });
                }
        }).catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
    }
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if(doc){
            res.status(200).json({
                product:doc,
                request: {
                    type: 'GET',
                    description: 'Get all products',
                    url: site+'products'
                }
                });
                
        } else {
            res.status(404).json({message: 'That product does not exist'});
        }
    }).catch(err => {
        console.log(err);
        //if error is  cast error, then it is not a valid id
        if(err.name === 'CastError'){
            res.status(404).json({message: 'ID is not valid'});
        }
        else{
            res.status(500).json({error: err});
        }
    });

});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const Price = req.body.price;
    Product.findByIdAndUpdate(id, {price: Price})
    .exec()
    .then(result => {
        console.log(result);
        //if null is returned, then that product does not exist
        if(result === null){
            res.status(404).json({message: 'That product does not exist'});
        }
        else{

            res.status(200).json({
                message: "price has been updated",
                response : {
                    type: 'GET',
                    url: site+'products/' + id
                }
            });
        }
    }).catch(err => {
        console.log(err);
        //if error is that object id does not exist then send "that Product does not exist"
        if(err.name === 'CastError'){
            res.status(404).json({message: 'ID is not valid'});
        }
        //if it is null, then send "that product does not exist"
        else if(err.name === 'Null'){
            res.status(404).json({message: 'That product does not exist'});
        }
        else{
            res.status(500).json({error: err});
        }
    });

});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findByIdAndDelete(id)
    .exec()
    .then(result => {
        console.log(result);
        //if null is returned, then that product does not exist
        if(result === null){
            res.status(404).json({message: 'That product does not exist'});
        }
        else{
            res.status(200).json({
                message: "Product has been deleted",
                response : {
                    type: 'POST',
                    url: site+'products',
                    body: {name: 'String', price: 'Number'}
                }
                });
        }
    }).catch(err => {
        console.log(err);
        //if error is that object id does not exist then send "that Product does not exist"
        if(err.name === 'CastError'){
            res.status(404).json({message: 'ID is not valid'});
        }
        //if it is null, then send "that product does not exist"
        else if(err.name === 'Null'){
            res.status(404).json({message: 'That product does not exist'});
        }
        else{
            res.status(500).json({error: err});
        }
    });

});




module.exports = router;