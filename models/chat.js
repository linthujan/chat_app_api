'use strict';
const { Model } = require('sequelize');
const { defaultKeys, modelDefaults } = require('../sequelizeDefaults');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      Chat.belongsToMany(models.User, {
        through: {
          model: models.UserChat,
        },
        foreignKey: 'chat_id',
        sourceKey: 'chat_id',
        targetKey: 'user_id',
        otherKey: 'user_id',
        as: 'users',
      });
      Chat.hasMany(models.Message, {
        sourceKey: 'chat_id',
        foreignKey: 'chat_id',
        as: 'messages',
      })
    }
  }
  Chat.init({
    ...defaultKeys("chat_id"),
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, modelDefaults(sequelize, 'chats'));
  return Chat;
};