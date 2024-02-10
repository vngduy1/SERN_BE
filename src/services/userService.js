import db from '../models/index'
import bcrypt from 'bcryptjs'

const handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {}
      let isExist = await checkUserEmail(email)
      if (isExist) {
        let user = await db.User.findOne({
          attributes: ['email', 'roleId', 'password'],
          where: {
            email: email,
          },
          raw: true,
        })
        if (user) {
          let check = await bcrypt.compareSync(password, user.password)
          if (check) {
            userData.errCode = 0
            userData.errMessage = `successfully`
            delete user.password
            userData.user = user
          } else {
            userData.errCode = 3
            userData.errMessage = `Wrong password`
          }
        } else {
          userData.errCode = 2
          userData.errMessage = `User not found`
          resolve(userData)
        }
      } else {
        userData.errCode = 1
        userData.errMessage = `Your Email is not exist in your system`
      }
      resolve(userData)
    } catch (error) {
      reject(error)
    }
  })
}

const checkUserEmail = (emailUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { email: emailUser } })
      if (user === null) {
        console.log('Not found!')
      }
      if (user) {
        resolve(true)
      } else {
        resolve(false)
      }
    } catch (error) {
      reject(error)
    }
  })
}

const getAllUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = ''
      if (userId === 'ALL') {
        users = await db.User.findAll({
          attributes: { exclude: ['password'] },
          raw: true,
        })
      }
      if (userId && userId !== 'ALL') {
        users = await db.User.findOne({
          where: {
            id: userId,
          },
          attributes: { exclude: ['password'] },
          raw: true,
        })
      }
      resolve(users)
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  handleUserLogin,
  getAllUser,
}
