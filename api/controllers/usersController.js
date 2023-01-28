const user = require('../models/user');
const mongoose = require('mongoose');
const cart = require('../models/cart');
//call tools to validate email and password
const tools = require('../tools/tools');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
//call dotenv
require('dotenv/config');
site = process.env.url;

//signup
const create_user = (req, res, next) => {
    //check if email is valid
    if (!tools.validateEmail(req.body.email)) {
        return res.status(400).json({
            message: 'Invalid email'
        });
    }
    //check if user already exists
    if (!tools.userExists(req.body.email)) {
        return res.status(400).json({
            message: 'User already exists'
        });
    }
    //check if password is valid
    if (!tools.passwordCheck(req.body.password)) {
        return res.status(400).json({
            message: 'Invalid password format'
        });
    }

    //check if req.body.adminpin is empty, if it is , isaAdmin = false else call adminPinCompare
    if (req.body.adminPin == '') {
        req.body.isAdmin = false;
    } else {
        req.body.isAdmin = tools.adminValidator(req.body.adminPin);
    }
    //hash password
    const hash = tools.passwordHash(req.body.password);
    //auto cart creation call from tools
    const cartId = tools.createCart();
    //create new user
    const User = new user({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        cart: cartId,
        isAdmin: req.body.isAdmin,
    });
    User.save()
        .then(result => {
            console.log(result);
            //create token and login
            if (tools.adminLock(result._id)) {
                const adminToken = jwt.sign(
                    {
                        email: result.email,
                        userId: result._id,
                        role: admin
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                );
                return res.status(200).json({
                    message: 'Admin user created',
                    status: 'Auth successful',
                    createdUser: {
                        _id: result._id,
                        email: result.email,
                        request: {
                            type: 'GET',
                            url: site + 'users/details' + result._id
                        },
                    },
                    token: adminToken,
                    user: result
                });
            } else {
                const userToken = jwt.sign(
                    {
                        email: result.email,
                        userId: result._id,
                        role: user
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                );

            res.status(201).json({
                message: 'User created',
                createdUser: {
                    _id: result._id,
                    email: result.email,
                    request: {
                        type: 'GET',
                        url: site + 'users/details' + result._id
                    },
                    token: userToken
                }
            });
        }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        }
        );
};

//login
const login_user = (req, res, next) => {
    //check if email is valid
    if (!tools.validateEmail(req.body.email)) {
        return res.status(400).json({
            message: 'Invalid email'
        });
    }
    //check if password is valid
    if (!tools.passwordCheck(req.body.password)) {
        return res.status(400).json({
            message: 'Invalid password format'
        });
    }
    user.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'User not found'
                });
            }
            //compare password
            if (!tools.passwordCompare(req.body.password, user[0].password)) {
                //create token 
                //check if user is admin before creating token using adminlock
                if (!tools.adminLock(user[0]._id)) {
                    const adminToken = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id,
                            role: 'admin'
                        },
                        process.env.JWT_KEY, {
                        expiresIn: "1h"
                    }
                    );
                    return res.json({token: adminToken});
                } else {
                    const userToken = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id,
                            role: 'user'
                        },
                        process.env.JWT_KEY, {
                        expiresIn: "1h"
                    }
                    );
                    return res.json({token: userToken});
                }
            }
            res.status(401).json({
                message: 'Auth failed'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        }
        );
};

//get user details by id
const get_user_details = (req, res, next) => {
    const id = req.params.userId;
    // check if user is admin or if user is the same as the one requesting details
    if (!tools.adminLock(decoded.userId) && decoded.userId != id) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }    
    console.log(id, token)

    user.findById(id)
        .select('_id email firstName lastName address phoneNumber cart orders isAdmin')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    user: doc,
                    request: {
                        type: 'GET',
                        url: site + 'users/'
                    }
                });
            } else {
                res.status(404).json({ message: 'No valid entry found for provided ID' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

//get all users 
const get_all_users = (req, res, next) => {
    user.find()
        .select('_id email firstName lastName address phoneNumber cart orders isAdmin')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                users: docs.map(doc => {
                    return {
                        _id: doc._id,
                        email: doc.email,
                        firstName: doc.firstName,
                        lastName: doc.lastName,
                        address: doc.address,
                        phoneNumber: doc.phoneNumber,
                        cart: doc.cart,
                        orders: doc.orders,
                        isAdmin: doc.isAdmin,
                        request: {
                            type: 'GET',
                            url: site + 'users/details/' + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

//update user
const update_user = (req, res, next) => {
    const id = req.params.userId;
    // check if user is admin or if user is the same as the one requesting details
    if (!tools.adminLock(decoded.userId) && decoded.userId != id) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    user.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User updated',
                request: {
                    type: 'GET',
                    url: site + 'users/details/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


//delete user
const delete_user = (req, res, next) => {
    const id = req.params.userId;
    // check if user is admin or if user is the same as the one requesting details
    if (!tools.adminLock(decoded.userId) && decoded.userId != id) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
    user.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted',
                request: {
                    type: 'POST',
                    url: site + 'users/signup',
                    body: { email: 'String', password: 'String' }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};




module.exports = {
    create_user,
    login_user,
    get_user_details,
    get_all_users,
    update_user,
    delete_user
};