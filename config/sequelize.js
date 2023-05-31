
let {Sequelize}= require('sequelize')


export const dbConfig = {
    dialect: 'mysql',
    database: 'EezyLIfe_EcomTool',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false,
    replication: {
        read: [
            {
                host: 'sg2nlmysql57plsk.secureserver.net',
                username: 'EezyLife_Tool',
                password: 'Deepak@123',
            },
        ],
        write: {
            host: 'sg2nlmysql57plsk.secureserver.net',
            username: 'EezyLife_Tool',
            password: 'Deepak@123',
        },
    },
};

//export const sequelize = new Sequelize(dbConfig.database, null!, null!, dbConfig);


//sequelize.authenticate();
// sequelize
//     .authenticate()
//     .then(function () {
//         console.log('database connected');
//     })
//     .catch(function (err) {
//         console.error('Sequelize connection error.');
//     });
