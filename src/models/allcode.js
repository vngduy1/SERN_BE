'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {
    static associate(models) {
      //Định danh các mối quan hệ
      Allcode.hasMany(models.User, {
        foreignKey: 'positionId',
        as: 'positionData',
      })
      Allcode.hasMany(models.User, { foreignKey: 'gender', as: 'genderData' })
      Allcode.hasMany(models.Schedule, {
        foreignKey: 'timeType',
        as: 'timeTypeData',
      })
    }
  }
  Allcode.init(
    {
      keyMap: DataTypes.STRING,
      type: DataTypes.STRING,
      valueEn: DataTypes.STRING,
      valueVi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Allcode',
    },
  )
  return Allcode
}
