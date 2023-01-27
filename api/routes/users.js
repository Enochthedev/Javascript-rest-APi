const express = require('express');
const router = express.Router();
const tools = require('../tools/tools');
const usersController = require('../controllers/usersController');

//routes, create new user , get all users, get a particular user, delete a user, update a user


// get all users route(admin only)
router.get('/',tools.verifyToken,usersController.get_all_users);

//get a particular user route
router.get('/details/:userId',tools.verifyToken,usersController.get_user_details);

//create a new user route
router.post('/signup',usersController.create_user);

//login route
router.post('/login',usersController.login_user);

//update a user route
router.patch('/:userId',tools.verifyToken,usersController.update_user);


//delete a user route
router.delete('/:userId',tools.verifyToken,usersController.delete_user);






module.exports = router;