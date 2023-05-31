let Customer = require('../models/customers');
const getAllCustomers = async (req, res) => {
    let getCustomers = await Customer.find({})
    return getCustomers;
}

const getCustomerById = async (data) => {
    return await Customer.find({customerId:data}).select('customerRefreshToken')
}


module.exports= {
    getAllCustomers,
    getCustomerById
}