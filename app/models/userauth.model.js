module.exports = (sequelize, Sequelize, DataTypes) => {
    const userAuth = sequelize.define(
      "userauths",
      {
        id: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        firstName:{
            type:DataTypes.STRING(128),
        },
        lastName:{
            type:DataTypes.STRING(128),
        },
        email:{
            type:DataTypes.STRING(128),
            //match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        password:{
            type:DataTypes.STRING(128),
            
            // match:[/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/,'Please fill a valid password']
        },
        // role:{
        //     type:Array,
        // },
        mobile:{
            type:DataTypes.STRING(128),
        },
        isActive:{
            type:DataTypes.BOOLEAN,
        },
        isDelete:{
            type:DataTypes.BOOLEAN, 
        }
      },
      { timestamps: false }
    );
  
    return userAuth;
  };
  