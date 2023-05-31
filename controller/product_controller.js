let spApi = require('../aws-sp-api/spapi');
let Order = require('../models/orders');
let OrderDetail = require('../models/orderDetail');
let Customer = require('../models/customers'); 

let {getAllCustomers,getCustomerById} = require('../Repository/query');

const productPrice = async (req, res) => {
    try {
        let query = {
            MarketplaceIds:['A21TJRUUN4KGV'],
            CreatedAfter:'2022-09-01T00:00:00-07:00', 
        }
        let getAllAsin = await OrderDetail.distinct('ASIN')
        return res.status(200).json({
            message: 'list of active orders!',
            response: getAllAsin,
        });
    } catch (err) {
        console.log("error while listing the order from amazon", err)
        return res.status(500).json({
            message: "Not able to get the asin",
            response: err
        })
    };
}


module.exports = {
    productPrice
}