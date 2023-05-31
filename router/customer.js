let express = require('express');
const checkAuth = require('../middleware/check-auth');
const {customerList,addCustomer,deleteCustomer,updateCustomer} =  require('../controller/customer_controller');
//"mongouri":"mongodb+srv://eezy:admin123@eezy.zppoawf.mongodb.net/eezy?retryWrites=true&w=majority",
let router = express.Router();

router.get('/customer-list',customerList)
router.post('/add-customer',checkAuth, addCustomer);
router.post('/customer',checkAuth, updateCustomer);
router.post('/remove-customer',checkAuth, deleteCustomer);



module.exports = router;