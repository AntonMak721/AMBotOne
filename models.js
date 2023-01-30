const sequelize = require('./db');
const {DataTypes} = require('sequelize');


const User = sequelize.define(
    'user', {
        id:{type: DataTypes.INTEGER,
             primaryKey: true,
             uniqe: true,
             autoIncrement: true},
        chatId: {type: DataTypes.STRING, uniqe: true},
        right: {type: DataTypes.INTEGER, defaultValue: 0},
        wrong: {type: DataTypes.INTEGER, defaultValue: 0},
    }
  );

  module.exports = User;