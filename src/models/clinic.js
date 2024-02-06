'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    static associate(models) {
      //Định danh các mối quan hệ
    }
  }
  Clinic.init(
    {
      address: DataTypes.STRING,
      description: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Clinic',
    },
  )
  return Clinic
}
