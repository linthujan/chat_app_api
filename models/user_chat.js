'use strict';
const { Model } = require('sequelize');
const { defaultKeys, modelDefaults } = require('../sequelize/defaults');
/** @param {import("sequelize").DataTypes} DataTypes */
module.exports = (sequelize, DataTypes) => {
  class UserChat extends Model {
    static associate(models) {
      UserChat.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'user_id',
        as: 'user',
      });
      UserChat.belongsTo(models.Chat, {
        foreignKey: 'chat_id',
        targetKey: 'chat_id',
        as: 'chat',
      });
    }
  }
  UserChat.init({
    ...defaultKeys("user_chat_id"),
    type: {
      type: DataTypes.ENUM(['ADMIN', 'MEMBER', 'OPPONENT']),
      allowNull: false,
    },
  }, modelDefaults(sequelize, 'user_chats', {
    paranoid: false,
    indexes: [
      {
        fields: ['user_id', 'chat_id'],
        name: 'user_id_chat_id_unique',
        unique: true,
      }
    ],
  }));
  return UserChat;
};