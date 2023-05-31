module.exports = (sequelize, Sequelize, DataTypes) => {
    const orderDetail = sequelize.define(
      "orderDetails",
      {
        id: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        NumberOfItems:{
            type:DataTypes.STRING(128)
        },
        ItemTaxCurrencyCode:{
            type:DataTypes.STRING(128),
        },
        ItemTaxAmount:{
            type:DataTypes.STRING(128),
        },
        ItemPriceCurrencyCode:{
            type:DataTypes.STRING(128),
        },
        ItemPriceAmount:{
            type:DataTypes.STRING(128),
        },
        ASIN:{
            type:DataTypes.STRING(128),
        },
        SellerSKU:{
            type:DataTypes.STRING(128),
        },
        Title:{
            type:DataTypes.STRING(128),
        },
        SerialNumberRequired:{
            type:DataTypes.BOOLEAN,
        },
        IsGift:{
            type:DataTypes.STRING(128),
        },
        ConditionSubtypeId:{
            type:DataTypes.STRING(128),
        },
        IsTransparency:{
            type:DataTypes.BOOLEAN,
        },
        QuantityOrdered:{
            type:DataTypes.INTEGER,
        },
        PromotionDiscountTaxCurrencyCode:{
            type:DataTypes.STRING(128),
        },
        PromotionDiscountTaxAmount:{
            type:DataTypes.STRING(128),
        },
        ConditionId:{
            type:DataTypes.STRING(128)            
        },
        PromotionDiscountCurrencyCode:{
            type:DataTypes.STRING(128),
        },
        PromotionDiscountAmount:{
            type:DataTypes.STRING(128),
        },
        OrderItemId:{
            type:DataTypes.STRING(128),
        },
        AmazonOrderId:{
            type:DataTypes.STRING(128),
        },
        CustomerId:{
            type:DataTypes.STRING(128),
        },
        QuantityShipped:{
            type:DataTypes.INTEGER,
        },
        isActive:{
            type:DataTypes.BOOLEAN,
        },
        isDelete:{
            type:DataTypes.BOOLEAN     
        }
      },
      { timestamps: false }
    );
  
    return orderDetail;
  };
  