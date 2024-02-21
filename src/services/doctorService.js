import db from '../models/index'

const getTopDoctorHome = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limitInput,
        where: { roleId: 'R2' },
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['password'] },
        include: [
          {
            model: db.Allcode,
            as: 'positionData',
            attributes: ['valueEn', 'valueVi'],
          },
          {
            model: db.Allcode,
            as: 'genderData',
            attributes: ['valueEn', 'valueVi'],
          },
        ],
        raw: true,
        nest: true,
      })

      resolve({
        errCode: 0,
        data: users,
      })
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}

const getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: 'R2' },

        attributes: { exclude: ['password'] },
        raw: true,
        nest: true,
      })

      resolve({
        errCode: 0,
        data: doctors,
      })
    } catch (error) {
      console.log(error)
      reject({
        errCode: 1,
        errMessage: 'getAllDoctors error',
      })
    }
  })
}

const saveDetailInfoDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !inputData.doctorId ||
        !inputData.contentHTML ||
        !inputData.contentMarkdown ||
        !inputData.action
      ) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter saveDetailInfoDoctor',
        })
      } else {
        if (inputData.action === 'ADD') {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
            doctorId: inputData.doctorId,
          })
        } else if (inputData.action === 'EDIT') {
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: inputData.doctorId },
            raw: false,
          })
          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = inputData.contentHTML
            doctorMarkdown.contentMarkdown = inputData.contentMarkdown
            doctorMarkdown.description = inputData.description
            await doctorMarkdown.save()
          }
        }
        resolve({
          errCode: 0,
          errMessage: 'Save info doctor success',
        })
      }
    } catch (error) {
      reject({ errCode: -1, errMessage: 'error from saveDetailInfoDoctor' })
    }
  })
}

const getDetailDoctorByIdService = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter getDetailDoctorByIdService',
        })
      } else {
        let data = await db.User.findOne({
          where: { id: inputId },
          attributes: { exclude: ['password'] },
          include: [
            {
              model: db.Markdown,
              attributes: ['description', 'contentHTML', 'contentMarkdown'],
            },
            {
              model: db.Allcode,
              as: 'positionData',
              attributes: ['valueEn', 'valueVi'],
            },
          ],
          raw: false,
          nest: true,
        })

        if (data && data.image) {
          data.image = new Buffer(data.image, 'base64').toString('binary')
        }

        if (!data) data = {}
        resolve({
          errCode: 0,
          data: data,
        })
      }
    } catch (error) {
      console.log(error)
      reject({
        errCode: -1,
        errMessage: 'error from getDetailDoctorByIdService',
      })
    }
  })
}

module.exports = {
  getTopDoctorHome,
  getAllDoctors,
  saveDetailInfoDoctor,
  getDetailDoctorByIdService,
}
