'use strict';
const { Model } = require('sequelize');
const { defaultKeys, modelDefaults } = require('../sequelizeDefaults');
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
    }
  }
  Message.init({
    ...defaultKeys("message_id"),
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, modelDefaults(sequelize, 'messages'));
  return Message;
};
