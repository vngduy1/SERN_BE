'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      //Định danh các mối quan hệ
      Booking.belongsTo(models.User, {
        foreignKey: 'patientId',
        targetKey: 'id',
        as: 'patientData',
      })
      Booking.belongsTo(models.Allcode, {
        foreignKey: 'timeType',
        targetKey: 'keyMap',
        as: 'timeTypeDataPatient',
      })
    }
  }
  Booking.init(
    {
      statusId: DataTypes.STRING,
      doctorId: DataTypes.INTEGER,
      patientId: DataTypes.INTEGER,
      date: DataTypes.STRING,
      timeType: DataTypes.STRING,
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Booking',
    },
  )
  return Booking
}
