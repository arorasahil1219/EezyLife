const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema; 
const Schema = mongoose.Schema;

const customerSchema  = new Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    customerId:{
        type:String,
        required:true,
        unique:true
    },
    customerName:{
        type:String,
        required:false
    },
    customerMobile:{
        type:String,
        required:false
    },
    customerRefreshToken:{
        type:String,
        required:false
    },
    isActive:{
        type:Boolean,
        required:true,
        default:true
    },
    isDelete:{
        type:Boolean,
        default:false        
    }
});


const Customer = mongoose.model("customer", customerSchema);
module.exports = Customer;