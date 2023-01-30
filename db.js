const {Sequelize} = require('sequelize')


module.exports= new Sequelize(
   'AMBotOne',
   'root',
   'root',
   {
    host:'45.130.8.11',
    port: '6432',
    dialect: 'postgres'
   }
)