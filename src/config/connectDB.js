const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('dvn', 'root', null, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
})

let connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('connect DB is successfully!!')
  } catch (error) {
    console.error('connect default', error)
  }
}

module.exports = connectDB
