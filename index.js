let express = require('express');
let cors = require('cors');
const db = require("./app/models");
let mongoose = require('mongoose');
let userAuth = require('./router/user');
let customer = require('./router/customer');
let order = require('./router/order');
let product = require('./router/product'); 
let bodyParser = require('body-parser');
const scheduledFunctions = require('./scheduledFunctions/job');
const scheduledEveningJobFunction = require('./scheduledFunctions/eveningjob');

const Config = require('./config/dev.json');
let app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}))

const uri = Config.mongouri;

mongoose.connect(uri).then((response)=>{
    console.log(`connection eastablished with the database`)
}).catch((error)=>{
    console.log(`issues while connecting with the db`,error)
})


db.sequelize.sync({force:false})
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
});

app.get('/',(req,res)=>{
  res.status(200).json({
    message:'welcome to eezy life sales application'
  })
})

app.use(userAuth);
app.use(customer);
app.use(order);
app.use(product);
let PORT = process.env.PORT || 5000
scheduledFunctions.initScheduledJobs();
scheduledEveningJobFunction.initEveningScheduledJobs();
app.listen(PORT,()=>{
    console.log('app is running at',PORT);
});

