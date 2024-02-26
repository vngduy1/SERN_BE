'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      //Định danh các mối quan hệ
    }
  }
  Booking.init(
    {
      statusId: DataTypes.STRING,
      doctorId: DataTypes.INTEGER,
      patientId: DataTypes.INTEGER,
      date: DataTypes.STRING,
      timeType: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Booking',
    },
  )
  return Booking
}
