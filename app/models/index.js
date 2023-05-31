const dbConfig = require("../../config/db.config");
const Sequelize = require("sequelize");
const {DataTypes} = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  timestamps:false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.customers = require("./customer.model")(sequelize, Sequelize,DataTypes);
db.orders = require("./order.model")(sequelize, Sequelize,DataTypes);
db.orderDetails = require("./orderDetail.model")(sequelize, Sequelize,DataTypes);
db.userAuth= require("./userauth.model")(sequelize, Sequelize,DataTypes);
db.customerTrendz= require("./trendz.model")(sequelize, Sequelize,DataTypes);
module.exports = db;