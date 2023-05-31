module.exports = (sequelize, Sequelize, DataTypes) => {
    const customerTrendz = sequelize.define(
      "customerTrendz",
      {
        id: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        customerId:{
            type:DataTypes.STRING(128),
        },
        productName:{
            type:DataTypes.STRING(128),
        },
        geoName:{
            type:DataTypes.STRING(128),
        },
        formattedValue:{
            type:DataTypes.STRING(128),
        },
      },
      { timestamps: false }
    );
  
    return customerTrendz;
  };
  