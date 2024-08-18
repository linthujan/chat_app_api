'use strict';
const { Model } = require('sequelize');
const { defaultKeys, modelDefaults } = require('../sequelize/defaults');
/** @param {import("sequelize").DataTypes} DataTypes */
module.exports = (sequelize, DataTypes) => {
  class Asset extends Model {
    static associate(models) {
      Asset.belongsTo(models.User, {
        foreignKey: 'owner_id',
        targetKey: 'user_id',
        constraints: false,
      });
      Asset.belongsTo(models.Chat, {
        foreignKey: 'owner_id',
        targetKey: 'chat_id',
        constraints: false,
      });
      Asset.belongsTo(models.Message, {
        foreignKey: 'owner_id',
        targetKey: 'message_id',
        constraints: false,
      });
    }
  }
  Asset.init({
    ...defaultKeys("asset_id"),
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mimetype: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.BLOB('long'),
      allowNull: false,
      get() {
        return;
      }
    },
    uri: {
      type: DataTypes.VIRTUAL,
      get() {
        const data = this.getDataValue('data');
        if (!data) return;

        const base64 = Buffer.from(data).toString('base64');
        const mimetype = this.getDataValue('mimetype');

        return base64;
        // return `data:${mimetype};base64,${base64}`;
      },
    }
  }, modelDefaults(sequelize, 'assets'));
  return Asset;
};