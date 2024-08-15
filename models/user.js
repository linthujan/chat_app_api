'use strict';
const { Model } = require('sequelize');
const { defaultKeys, modelDefaults } = require('../sequelizeDefaults');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Chat, {
        through: {
          model: models.UserChat,
        },
        foreignKey: 'user_id',
        sourceKey: 'user_id',
        targetKey: 'chat_id',
        otherKey: 'chat_id',
        as: 'chats',
      });
      User.hasMany(models.Message, {
        foreignKey: 'user_id',
        sourceKey: 'user_id',
      })
    }
  }
  User.init({
    ...defaultKeys("user_id"),
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      },
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, modelDefaults(sequelize, 'users'));
  return User;
};