module.exports = (sequelize, Sequelize, DataTypes) => {
  const order = sequelize.define(
    "orders",
    {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      BuyerEmail: {
        type: DataTypes.STRING(128),
      },
      AmazonOrderId: {
        type: DataTypes.STRING(128),
        unique:'AmazonOrderId'
      },
      EarliestDeliveryDate: {
        type: DataTypes.STRING(128),
      },
      EarliestShipDate: {
        type: DataTypes.STRING(128),
      },
      SalesChannel: {
        type: DataTypes.STRING(128),
      },
      HasAutomatedShippingSettings: {
        type: DataTypes.STRING(128),
      },
      OrderStatus: {
        type: DataTypes.STRING(128),
      },
      IsPremiumOrder: {
        type: DataTypes.BOOLEAN,
      },
      IsPrime: {
        type: DataTypes.BOOLEAN,
      },
      FulfillmentChannel: {
        type: DataTypes.STRING(128),
      },
      NumberOfItemsUnshipped: {
        type: DataTypes.INTEGER,
      },
      HasRegulatedItems: {
        type: DataTypes.BOOLEAN,
      },
      IsReplacementOrder: {
        type: DataTypes.STRING(128),
      },
      IsSoldByAB: {
        type: DataTypes.BOOLEAN,
      },
      LatestShipDate: {
        type: DataTypes.STRING(128),
      },
      ShipServiceLevel: {
        type: DataTypes.STRING(128),
      },
      DefaultShipFromLocAddressLine2: {
        type: DataTypes.STRING(128),
      },
      DefaultShipFromLocStateOrRegion: {
        type: DataTypes.STRING(128),
      },
      DefaultShipFromLocAddressLine1: {
        type: DataTypes.STRING(128),
      },
      DefaultShipFromLocPostalCode: {
        type: DataTypes.STRING(128),
      },
      DefaultShipFromLocCity: {
        type: DataTypes.STRING(128),
      },
      DefaultShipFromLocCountryCode: {
        type: DataTypes.STRING(128),
      },
      DefaultShipFromLocName: {
        type: DataTypes.STRING(128),
      },
      IsISPU: {
        type: DataTypes.BOOLEAN,
      },
      MarketplaceId: {
        type: DataTypes.STRING(128),
      },
      LatestDeliveryDate: {
        type: DataTypes.STRING(128),
      },
      ShippingAddressStateOrRegion: {
        type: DataTypes.STRING(128),
      },
      ShippingAddressPostalCode: {
        type: DataTypes.STRING(128),
      },
      ShippingAddressCity: {
        type: DataTypes.STRING(128),
      },
      ShippingAddressCountryCode: {
        type: DataTypes.STRING(128),
      },
      IsAccessPointOrder: {
        type: DataTypes.BOOLEAN,
      },
      PaymentMethod: {
        type: DataTypes.STRING(128),
      },
      IsBusinessOrder: {
        type: DataTypes.BOOLEAN,
      },
      OrderTotalCurrencyCode: {
        type: DataTypes.STRING(128),
      },
      OrderTotalAmount: {
        type: DataTypes.STRING(128),
      },
      EasyShipShipmentStatus: {
        type: DataTypes.STRING(128),
      },
      IsGlobalExpressEnabled: {
        type: DataTypes.BOOLEAN,
      },
      PurchaseDate: {
        type: DataTypes.STRING(128),
      },
      PurchaseTime: {
        type: DataTypes.STRING(128),
      },
      LastUpdateDate: {
        type: DataTypes.STRING(128),
      },
      ShipmentServiceLevelCategory: {
        type: DataTypes.STRING(128),
      },
      CustomerId: {
        type: DataTypes.STRING(128),
      },
      CustomerName: {
        type: DataTypes.STRING(128),
      },
      isActive: {
        type: DataTypes.BOOLEAN,
      },
      isDelete: {
        type: DataTypes.BOOLEAN,
      },
    },
    { timestamps: false }
  );

  return order;
};
