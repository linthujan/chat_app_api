'use strict';
const { Model } = require('sequelize');
const { defaultKeys, modelDefaults } = require('../sequelize/defaults');
/** @param {import("sequelize").DataTypes} DataTypes */
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      Chat.belongsToMany(models.User, {
        through: {
          model: models.UserChat,
          unique: false,
          scope: {
            type: 'ADMIN',
          },
        },
        foreignKey: 'chat_id',
        sourceKey: 'chat_id',
        targetKey: 'user_id',
        otherKey: 'user_id',
        as: 'admins',
      });
      Chat.belongsToMany(models.User, {
        through: {
          model: models.UserChat,
          unique: false,
          scope: {
            type: 'MEMBER',
          },
        },
        foreignKey: 'chat_id',
        sourceKey: 'chat_id',
        targetKey: 'user_id',
        otherKey: 'user_id',
        as: 'members',
      });
      Chat.belongsToMany(models.User, {
        through: {
          model: models.UserChat,
          unique: false,
          scope: {
            type: 'OPPONENT',
          },
        },
        foreignKey: 'chat_id',
        sourceKey: 'chat_id',
        targetKey: 'user_id',
        otherKey: 'user_id',
        as: 'opponents',
      });
      Chat.belongsToMany(models.User, {
        through: {
          model: models.UserChat,
          unique: false,
        },
        foreignKey: 'chat_id',
        sourceKey: 'chat_id',
        targetKey: 'user_id',
        otherKey: 'user_id',
        as: 'users',
      });
      Chat.hasMany(models.UserChat, {
        sourceKey: 'chat_id',
        foreignKey: 'chat_id',
        as: 'userChats',
      });
      Chat.hasMany(models.Message, {
        sourceKey: 'chat_id',
        foreignKey: 'chat_id',
        as: 'messages',
      });
      Chat.hasOne(models.Asset, {
        foreignKey: 'owner_id',
        sourceKey: 'chat_id',
        constraints: false,
        scope: {
          type: 'CHAT_IMAGE',
        },
        as: 'image',
      });
    }
  }
  Chat.init({
    ...defaultKeys("chat_id"),
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM(['PRIVATE', 'GROUP']),
      allowNull: false,
    },
  }, modelDefaults(sequelize, 'chats'));
  return Chat;
};