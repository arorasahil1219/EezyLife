const Customer = require('../models/customers');
const mongoose = require("mongoose");
var qs = require('qs');
const axios = require('axios');

const db = require("../app/models");
const Customers = db.customers;

/* controller to get all customers */
const customerList = async (req, res) => {
    try {
        const getCustomers = await Customers.findAll({});
      //  console.log('get all customers', getCustomers);
        return res.status(200).json({
            message: 'list of active customers!',
            response: getCustomers,
        });
    } catch (err) {
       // console.log("error while listing the customers from db", err)
        return res.status(500).json({
            message: "Not able to get list of customers from db",
            response: err
        })
    };
}

const addCustomer = async (req, res) => {
    try {
        let data = qs.stringify({
            'grant_type': 'authorization_code',
            'code': req.body.spapi_oauth_code,
            'client_id': 'amzn1.application-oa2-client.cc8283ab552942e08c03a7eaa058320d',
            'client_secret': '465f4c2f8528633f6c3e51760a433230342943c83922fa48aa3ab052078e82f5',
            'redirect_uri': 'https://my.redirect.example.com',
            'version': 'beta' 
          });
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.amazon.com/auth/o2/token?version=beta',
            headers: { 
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
        };

        let getToken = await axios(config);
        const addNewCustomer=  await Customers.create({
            customerId:req.body.customerId,
            customerName:req.body.customerName || 'default',
            customerRefreshToken:getToken.data.refresh_token,
            isActive:1
      });
      // console.log('addNewCustomer',addNewCustomer)
       return res.status(200).json({
           message: 'New customer  Created successfully!',
           response: newCustomer,
       });
    } catch (err) { 
        return res.status(500).json({
            message: "Not able to create the customer",
            response: err
        })
    };
}

const deleteCustomer = async (req, res) => {
    try {
       const removeCustomer= await Customers.destroy({
        where:{
        customerId:req.body.customerId
        }    
    })
     //  console.log('removeCustomer',removeCustomer)
       return res.status(200).json({
           message: 'customer  removed successfully!',
           response: removeCustomer,
       });
    } catch (err) {
     //   console.log("error while removing the customer", err)
        return res.status(500).json({
            message: "Not able to remove the customer",
            response: err
        })
    };
}

const updateCustomer = async (req, res) => {
    try {
        let dt =req.body.customerSyncStartDate + 'T00:00:00-07:00'
        console.log('my date ',dt);
        let updateCustName = await Customers.update(
            {
              customerName: req.body.customerName,
              syncStart: dt,
              syncSelection:req.body.syncSelection
              //syncEnd: req.body.customerSyncEndDate
            },
            {
              where: { customerId: req.body.customerId },
            }
          );
       return res.status(200).json({
           message: 'customer  updated successfully!',
           response: updateCustName,
       });
    } catch (err) {
      //  console.log("error while updating the customer name", err)
        return res.status(500).json({
            message: "Not able to update the customer name",
            response: err
        })
    };
}

module.exports = {
    customerList,
    addCustomer,
    deleteCustomer,
    updateCustomer
}