const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const tools = require('../tools/tools');
//call controller
const {products_get_all, products_create_product, products_get_product, products_update_product, products_delete_product} = require('../controllers/productsController');





router.get('/', products_get_all);

//protect for only admins
router.post('/',tools.verifyToken, products_create_product);

router.get('/:productId', products_get_product);

//protect for only admins
router.patch('/:productId',tools.verifyToken, products_update_product);

//protect for only admins
router.delete('/:productId',tools.verifyToken, products_delete_product);



module.exports = router;