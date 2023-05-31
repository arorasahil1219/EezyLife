const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema; 
const Schema = mongoose.Schema;

const userSchema  = new Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password:{
        type:String,
        required:true,
        // match:[/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/,'Please fill a valid password']
    },
    role:{
        type:Array,
    },
    mobile:{
        type:String,
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


const User = mongoose.model("userauth", userSchema);
module.exports = User;