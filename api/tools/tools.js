//call user model, mongoose, 
const user = require('../models/user');
const bcrypt = require('bcrypt');
const cart = require('../models/cart');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require("dotenv/config");
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
//create jwt token function that generates a token based on the users admin status
const createToken = (id, admin) => {
    const token = jwt.sign({
            email: user.email,
            userId: user._id,
            admin: user.admin
        },
        process.env.JWT_KEY, {
            expiresIn: "1h"
        }
    );
    return token;
}

//verify token function
function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send('Unauthorized');
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send('Unauthorized');
      }
      req.user = decoded;
      next();
    });
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
    createToken,
    verifyToken
}
