let express = require('express');
const checkAuth = require('../middleware/check-auth');
const {productPrice} =  require('../controller/product_controller');
let router = express.Router();

router.get('/product-pricing',productPrice)

module.exports = router;