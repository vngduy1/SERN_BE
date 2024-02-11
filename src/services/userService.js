import db from '../models/index'
import bcrypt from 'bcryptjs'
var salt = bcrypt.genSaltSync(10)

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

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt)
      resolve(hashPassword)
    } catch (error) {
      reject(error)
    }
  })
}

const createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check email
      let check = await checkUserEmail(data.email)
      if (check) {
        resolve({
          errCode: 1,
          errMessage: 'Your email is already',
        })
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password)
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          phonenumber: data.phonenumber,
          address: data.address,
          gender: data.gender === '1' ? true : false,
          roleId: data.roleId,
        })
        resolve({
          errCode: 0,
          message: 'ok',
        })
      }
    } catch (error) {
      reject(error)
    }
  })
}

const editUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      })
      if (!user) {
        resolve({
          errCode: 2,
          errMessage: `The user is not exist`,
        })
      }
      if (user) {
        user.firstName = data.firstName
        user.lastName = data.lastName
        user.address = data.address
        await user.save()
        resolve({
          errCode: 0,
          errMessage: 'Update success',
        })
      }
    } catch (error) {
      reject({
        errCode: 1,
        errMessage: 'User not found',
      })
    }
  })
}

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: id },
      })
      if (!user) {
        resolve({
          errCode: 2,
          errMessage: `The user is not exist`,
        })
      }

      await user.destroy()
      resolve({
        errCode: 0,
        errMessage: 'delete success',
      })
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  handleUserLogin,
  getAllUser,
  createNewUser,
  editUser,
  deleteUser,
}
