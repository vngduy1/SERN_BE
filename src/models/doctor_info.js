'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Doctor_Info extends Model {
    static associate(models) {
      //Định danh các mối quan hệ
    }
  }
  Doctor_Info.init(
    {
      doctorId: DataTypes.INTEGER,
      priceId: DataTypes.STRING,
      provinceId: DataTypes.STRING,
      paymentId: DataTypes.STRING,
      addressClinic: DataTypes.STRING,
      nameClinic: DataTypes.STRING,
      note: DataTypes.STRING,
      count: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Doctor_Info',
      freezeTableName: true,
    },
  )
  return Doctor_Info
}
