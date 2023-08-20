let express = require('express');
const {userLogin,userSignUp,greet} =  require('../controller/user_controller');

/*
const checkAuth = require('../middleware/check-auth');
const checkPermission = require('../middleware/check-user-permission');
const checkFeatures = require('../middleware/check-features');
*/
let router = express.Router();

router.post('/register',userSignUp)
router.post('/login', userLogin);
router.get('/', greet);



module.exports = router;