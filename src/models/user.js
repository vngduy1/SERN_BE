'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      //Định danh các mối quan hệ
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      address: DataTypes.STRING,
      gender: DataTypes.BOOLEAN,
      typeRole: DataTypes.STRING,
      keyRole: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    },
  )
  return User
}
