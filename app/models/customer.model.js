module.exports = (sequelize, Sequelize, DataTypes) => {
  const customer = sequelize.define(
    "customer",
    {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      customerId: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      customerName: {
        type: DataTypes.STRING(128),
      },
      customerMobile: {
        type: DataTypes.STRING(20),
      },
      customerRefreshToken: {
        type: DataTypes.STRING(2000),
      },
      isActive: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      isDelete: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    { timestamps: false }
  );

  return customer;
};
