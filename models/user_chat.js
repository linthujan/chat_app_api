'use strict';
const { Model } = require('sequelize');
const { defaultKeys, modelDefaults } = require('../sequelizeDefaults');
module.exports = (sequelize, DataTypes) => {
  class UserChat extends Model {
    static associate(models) {
      UserChat.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'user_id',
      });
      UserChat.belongsTo(models.Chat, {
        foreignKey: 'chat_id',
        targetKey: 'chat_id',
      });
    }
  }
  UserChat.init({
    ...defaultKeys("user_chat_id"),

  }, modelDefaults(sequelize, 'user_chats'));
  return UserChat;
};