const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    try{
    const token = req.headers.authorization.split(" ")[1];
    console.log('token is',token);
    const decoded = jwt.verify(token,'secret');
    console.log('decoded token',decoded);
    req.userData = decoded
    next();
    }
    catch(eror){
        return res.status(401).json({
            message:'Auth failed'
        })
    }
}