'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Specialty extends Model {
    static associate(models) {
      //Định danh các mối quan hệ
    }
  }
  Specialty.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Specialty',
    },
  )
  return Specialty
}
