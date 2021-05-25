'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cryptocompare extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  cryptocompare.init({
    RAW: DataTypes.JSONB,
    DISPLAY: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'cryptocompare',
  });
  return cryptocompare;
};