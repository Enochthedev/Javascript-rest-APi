//call user model, mongoose, 
const user = require('../models/user');
const bcrypt = require('bcrypt');
const cart = require('../models/cart');
const mongoose = require('mongoose');
const order = require('../models/order');
const generaluserdb = require('../models/userdb');
const jwt = require('jsonwebtoken');
require("dotenv/config");

const SECRET_KEY = process.env.SECRET_KEY;
//password validator function
const passwordCheck = (password) => {
    if (password.length < 8) {
        return false;
    }
    if (password.search(/\d/) == -1) {
        return false;
    }
    if (password.search(/[a-zA-Z]/) == -1) {
        return false;
    }
    if (password.search(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/) == -1) {
        return false;
    }
    return true;
}
//hash password function
const passwordHash = (password) => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

//password compare function
const passwordCompare = (password, hash) => {
    bcrypt.compare(password, hash, (err, result) => {
        if (err) {
            return res.status(401).json({
                message: 'Auth failed'
            });
            console.log(err);
        }
        if (result) {
            return true;
            
        }
        return false;
    });
}

//email validator function
const validateEmail = (email) => {
    if (email.length < 5) {
        return false;
    }
    if (email.length > 50) {
        return false;
    }
    if (email.search(/@/) == -1) {
        return false;
    }
    if (email.search(/./) == -1) {
        return false;
    }
    return true;
}

//check if user already exists
const userExists = (email) => {
    user.find({ email: email})  
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return true;
            } else {
                return false;
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

const activateUser = (email) => {
    //check the general db for the user and change it to active 
    generaluserdb.findOne({ email: email })
        .exec()
        .then(user => {
            if (user) {
                if (user.status == 'inactive') {
                    //change the status to active
                    user.status = 'active';
                    user.save()
                        .then(result => {
                            console.log("User status changed to active");
                            return true;
                        })
                        .catch(err => {
                            console.log(err);
                            return false;
                        });
                } else {
                    return false;
                }
            } else {
                return false;
            }
        })
        .catch(err => {
            console.log(err);
            return false;
        });
}

const deactivateUser = (email) => {
    //check the general db for the user and change it to inactive
    generaluserdb.findOne({ email: email })
        .exec()
        .then(user =>  {
            //deactivate the user
            if (user) {
                if (user.status == 'active') {
                    //change the status to inactive
                    user.status = 'inactive';
                    user.save()
                        .then(result => {
                            console.log("User status changed to inactive");
                            return true;
                        })
                        .catch(err => {
                            console.log(err);
                            return false;
                        });
                } else {
                    return false;
                }
            }
        })
        .catch(err => {
            console.log(err);
            return false;
        });

}

const addUser = (email,firsname,lastname) => {
    //add the user to the general db
    const User = new generaluserdb({
        _id: new mongoose.Types.ObjectId(),
        email: email,
        firstname: firsname,
        lastname: lastname,
        status: 'active'
    });
    User.save()
        .then(result => {
            console.log("User added to general db");
            return true;
        })
        .catch(err => {
            console.log(err);
            return false;
        });
}

//admin validator function get password from env
const adminValidator = (password) => {
    if (password == process.env.ADMIN_PASSWORD) {
        return true;
    } else {
        return false;
    }
}

//admin lock function , take the id of the user and check in the database if he is admin
const adminLock = (id) => {
    user.findById(id)
        .exec()
        .then(user => {
            if (user.admin == true) {
                return true;
            } else {
                return false;
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

//detail protector
const detailProtector = (id) => {
    //check if the user is admin or the user is the owner of the details
    if (adminLock(id) || id == req.userData.userId) {
        return true;
    } else {
        return false;
    }
}

//create an empty cart and send back id
const createCart = () => {
    const Cart = new cart({
        _id: new mongoose.Types.ObjectId(),
        items: []
    });
    Cart.save()
        .then(result => {
            return result._id;
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

function compareLists(list1, list2) {
    // Find elements that are in list1 but not list2
    const difference = list1.filter(x => !list2.includes(x));
    return difference;
}

//verify token function
function verifyToken(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).send('Unauthorized');
    }
    try {
        const token = authorization.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({
                message: 'Invalid Token Format'
            })
        }
        const decode = jwt.verify(token, SECRET_KEY);
        req.user = decode
        next()
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: 'Session Expired',
                error: error.message,
            })
        }
        if (error instanceof jwt.JsonWebTokenError || error instanceof TokenError) {
            return res.status(401).json({
                message: 'Invalid Token',
                error: error.message,
            })
        }
        res.status(500).json({
            message: 'Internal server Error',
            error: error.message,
            stack: error.stack
        });
    }
  }

    
function checkForDuplicates(products) {
    // Create an array to store the non-duplicate products
    const uniqueProducts = [];
    // Loop through the products
    for (const product of products) {
      // Check if a product with the same name already exists in the database
      const existingProduct = Product.findOne({ name: product.name });
      if (!existingProduct) {
        // If a product with the same name does not exist, add it to the array
        uniqueProducts.push(product);
      }
    }
    return uniqueProducts;
}
// export the functions
module.exports = {
    passwordCheck,
    passwordHash,
    passwordCompare,
    adminValidator,
    validateEmail,
    createCart,
    userExists,
    detailProtector,
    adminLock,
    compareLists,
    checkForDuplicates,
    verifyToken,
    activateUser,
    addUser, 
    deactivateUser
}
