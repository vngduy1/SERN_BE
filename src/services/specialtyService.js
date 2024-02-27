import { raw } from 'body-parser'
import db from '../models/index'

let createSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.imageBase64 ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: -1,
          errMessage: 'Missing parameter',
        })
      } else {
        await db.Specialty.create({
          name: data.name,
          image: data.imageBase64,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
        })
        resolve({
          errCode: 0,
          errMessage: 'Create successfully',
        })
      }
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}

const getAllSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll({})

      if (!data) {
        resolve({
          errCode: -1,
          errMessage: 'NULL!!!!',
        })
      }
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = new Buffer(item.image, 'base64').toString('binary')
        })
      }

      resolve({
        errCode: 0,
        data,
      })
    } catch (error) {
      console.log(error)
      reject({
        errCode: 2,
        errMessage: 'Missing from getAllSpecialty',
      })
    }
  })
}

module.exports = {
  createSpecialty,
  getAllSpecialty,
}
