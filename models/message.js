'use strict';
const { Model } = require('sequelize');
const { defaultKeys, modelDefaults } = require('../sequelize/defaults');
/** @param {import("sequelize").DataTypes} DataTypes */
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'user_id',
        as: 'user',
      });
      Message.belongsTo(models.Chat, {
        foreignKey: 'chat_id',
        targetKey: 'chat_id',
        as: 'chat',
      });
      Message.hasOne(models.Asset, {
        foreignKey: 'owner_id',
        sourceKey: 'message_id',
        constraints: false,
        scope: {
          type: 'MESSAGE_IMAGE',
        },
        as: 'image',
      });
    }
  }
  Message.init({
    ...defaultKeys("message_id"),
    type: {
      type: DataTypes.ENUM(['TEXT', 'IMAGE']),
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // status: {
    //   type: DataTypes.ENUM(['FAILED', 'PENDING', 'SENT', 'DELIVERED', 'READ']),
    //   allowNull: false,
    // },
  }, modelDefaults(sequelize, 'messages'));
  return Message;
};
