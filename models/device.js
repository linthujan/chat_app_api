'use strict';
const { Model } = require('sequelize');
const { defaultKeys, modelDefaults } = require('../sequelize/defaults');
module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    static associate(models) {
      Device.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'user_id',
        as: 'user',
      });
    }
  }
  Device.init({
    ...defaultKeys("device_id"),
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    device_unique_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    device_unique_id_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    platform: {
      type: DataTypes.ENUM(["ANDROID", "IOS", "WEB"]),
      allowNull: false,
    },
    fcm_token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    app_version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, modelDefaults(sequelize, 'devices'));
  return Device;
};