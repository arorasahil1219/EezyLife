const User = require('../models/user');
const UserLoginDetail = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const db = require("../app/models");
const UserAuth = db.userAuth;
/* controller to make user to login */
const userLogin = async (req,res) => {
    console.log('password::',req.body);
    await UserAuth.findAll(
        {
            where:{email:req.body.email}
        }
        )
    .then((user)=>{
        if(user.length < 1){
            return res.status(409).json({
                message:'error finding the user , auth issues'
            })
        }
        else{
            console.log('user record is',user);
            bcrypt.compare(req.body.password,user[0].password,async(err,result)=>{
                if(err){
                    return res.status(500).json({
                        message:'error while decrypting '
                    })
                }
                if(result){
                    const token = jwt.sign({
                        email:user[0].email,
                        role:user[0].role || 'default'
                    },"secret",{
                        expiresIn:'365d'
                    });
                    return res.status(200).json({
                        message:'user logged in successfully..',
                        accessToken:token,
                        token:token,
                        email:user[0].email,
                        roles:user[0].role,
                        status:200
                    })
                }
                return res.status(401).json({
                    message:'auth failed'
                })
            })
        }
    })   
}


const userSignUp = async(req,res) => {
    let findUser =  await UserAuth.findAll(
        {
        where:{email:req.body.email},
        raw:true
        }
        )
    console.log("user find",findUser);
    if(findUser.length > 0 ){
        return res.status(409).json({
            messahe:'invalid user,auth failed'
        })
    }else {
        console.log('here:::');
        bcrypt.hash(req.body.password,10,async (err,hash)=>{
            if(err){
                return res.status(500).json({
                    message:'error while encrypting the password'
                })
            } else {
                const Users = new UserAuth({
                    _id:mongoose.Types.ObjectId(),
                    firstName:req.body.firstName,
                    lastName:req.body.lastName,
                    mobile:req.body.mobile,
                    email:req.body.email,
                    password:hash
                });
                try{
                    let saveUsers = await Users.save();
                    return res.status(200).json({
                        status:200,
                        message:"Successfully saved the user details",
                        response:saveUsers
                    })
                 } catch(err){
                     console.log("error while creating the user ?",err)
                    let response= {
                         status:500,
                         message:"Not able to save the Users details!",
                         response: err
                     }
                     return res.status(500).json({
                        response
                    })
                 };
            }
        })
    }
}


module.exports = {
    userLogin,
    userSignUp
}