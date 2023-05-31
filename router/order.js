let express = require('express');
const checkAuth = require('../middleware/check-auth');
const {orderList,orderById,syncOrder,syncOrderItems,orderTrendz,
    orderTrendzJob,listOrderTrendz,getOrders,getOrderDetials,
    netSaleCustomerData,refundSaleCustomerData,cancelSaleCustomerData,
    grossSaleCustomerData,getOrderSkuData} =  require('../controller/order_controller');
//"mongouri":"mongodb+srv://eezy:admin123@eezy.zppoawf.mongodb.net/eezy?retryWrites=true&w=majority",
let router = express.Router();

router.post('/order-list',checkAuth,orderList);
router.get('/order-detail',checkAuth,orderById);
/* fetch gross sale data */
router.post('/order-gross-sale',checkAuth,grossSaleCustomerData);
router.post('/order-net-sale',checkAuth,netSaleCustomerData);
router.post('/order-refund-sale',checkAuth,refundSaleCustomerData);
router.post('/order-cancel-sale',checkAuth,cancelSaleCustomerData);
router.post('/order-sku-data',checkAuth,getOrderSkuData);

router.get('/sync-order',syncOrder);

router.get('/sync-order-items',syncOrderItems);

router.post('/order-trendz',checkAuth,orderTrendz);
router.get('/order-trendz',checkAuth,listOrderTrendz);
router.get('/job',orderTrendzJob);

router.get('/orders',getOrders);
router.get('/order-details',getOrderDetials);

module.exports = router;