'use strict';
const { Model } = require('sequelize');
const { defaultKeys, modelDefaults } = require('../sequelize/defaults');
/** @param {import("sequelize").DataTypes} DataTypes */
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Device, {
        foreignKey: 'user_id',
        sourceKey: 'user_id',
        as: 'devices',
      });
      User.belongsToMany(models.Chat, {
        through: {
          model: models.UserChat,
          unique: false,
        },
        foreignKey: 'user_id',
        sourceKey: 'user_id',
        targetKey: 'chat_id',
        otherKey: 'chat_id',
        scope: {
          type: 'PRIVATE',
        },
        as: 'privateChats',
      });
      User.belongsToMany(models.Chat, {
        through: {
          model: models.UserChat,
          unique: false,
        },
        foreignKey: 'user_id',
        sourceKey: 'user_id',
        targetKey: 'chat_id',
        otherKey: 'chat_id',
        scope: {
          type: 'GROUP',
        },
        as: 'groupChats',
      });
      User.belongsToMany(models.Chat, {
        through: {
          model: models.UserChat,
          unique: false,
        },
        foreignKey: 'user_id',
        sourceKey: 'user_id',
        targetKey: 'chat_id',
        otherKey: 'chat_id',
        as: 'chats',
      });
      // User.hasMany(models.Message, {
      //   foreignKey: 'user_id',
      //   sourceKey: 'user_id',
      // });
      User.hasOne(models.Asset, {
        foreignKey: 'owner_id',
        sourceKey: 'user_id',
        constraints: false,
        scope: {
          type: 'USER_PROFILE',
        },
        as: 'image',
      });
    }
  }
  User.init({
    ...defaultKeys("user_id"),
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, modelDefaults(sequelize, 'users'));
  return User;
};