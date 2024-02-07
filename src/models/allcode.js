'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {
    static associate(models) {
      //Định danh các mối quan hệ
    }
  }
  Allcode.init(
    {
      key: DataTypes.STRING,
      type: DataTypes.STRING,
      valueEn: DataTypes.STRING,
      value_Vi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Allcode',
    },
  )
  return Allcode
}