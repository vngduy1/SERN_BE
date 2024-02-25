import db from '../models/index'
require('dotenv').config()
import _ from 'lodash'

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

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
        !inputData.action ||
        !inputData.selectedPrice ||
        !inputData.selectedPayment ||
        !inputData.selectedProvince ||
        !inputData.nameClinic ||
        !inputData.addressClinic ||
        !inputData.note
      ) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter saveDetailInfoDoctor',
        })
      } else {
        //upsert to Markdown
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

        //upsert to Doctor info table
        let doctorInfo = await db.Doctor_Info.findOne({
          where: {
            doctorId: inputData.doctorId,
          },
          raw: false,
        })
        if (doctorInfo) {
          //update
          doctorInfo.priceId = inputData.selectedPrice
          doctorInfo.paymentId = inputData.selectedPayment
          doctorInfo.provinceId = inputData.selectedProvince
          doctorInfo.nameClinic = inputData.nameClinic
          doctorInfo.addressClinic = inputData.addressClinic
          doctorInfo.note = inputData.note
          await doctorInfo.save()
        } else {
          //create
          await db.Doctor_Info.create({
            doctorId: inputData.doctorId,
            priceId: inputData.selectedPrice,
            paymentId: inputData.selectedPayment,
            provinceId: inputData.selectedProvince,
            nameClinic: inputData.nameClinic,
            addressClinic: inputData.addressClinic,
            note: inputData.note,
          })
        }
        resolve({
          errCode: 0,
          errMessage: 'Save info doctor success',
        })
      }
    } catch (error) {
      console.log(error)
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
            {
              model: db.Doctor_Info,
              attributes: {
                exclude: ['id', 'doctorId'],
              },
              include: [
                {
                  model: db.Allcode,
                  as: 'priceTypeData',
                  attributes: ['valueEn', 'valueVi'],
                },
                {
                  model: db.Allcode,
                  as: 'paymentTypeData',
                  attributes: ['valueEn', 'valueVi'],
                },
                {
                  model: db.Allcode,
                  as: 'provinceTypeData',
                  attributes: ['valueEn', 'valueVi'],
                },
              ],
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

const buildCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.date) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required param!',
        })
      } else {
        let schedule = data.arrSchedule
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE
            return item
          })
        }
        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.date },
          attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
          raw: true,
        })
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date
        })
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate)
        }
        resolve({
          errCode: 0,
          errMessage: 'ok',
        })
      }
    } catch (error) {
      reject(error)
    }
  })
}

const getScheduleByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: 'Missing from getScheduleByDate',
        })
      } else {
        let data = await db.Schedule.findAll({
          where: {
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.Allcode,
              as: 'timeTypeData',
              attributes: ['valueEn', 'valueVi'],
            },
          ],
        })

        if (!data) {
          data = []
        }

        resolve({
          errCode: 0,
          data: data,
          errMessage: 'success fully',
        })
      }
    } catch (error) {
      reject(
        resolve({
          errCode: 2,
          errMessage: 'Missing from err getScheduleByDate',
        }),
      )
    }
  })
}

const getExtraInfoDoctorById = (idInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!idInput) {
        resolve({
          errCode: 1,
          errMessage: 'Missing from getExtraInfoDoctorById',
        })
      } else {
        let data = await db.Doctor_Info.findOne({
          where: {
            doctorId: idInput,
          },
          attributes: {
            exclude: ['id', 'doctorId'],
          },
          include: [
            {
              model: db.Allcode,
              as: 'priceTypeData',
              attributes: ['valueEn', 'valueVi'],
            },
            {
              model: db.Allcode,
              as: 'paymentTypeData',
              attributes: ['valueEn', 'valueVi'],
            },
            {
              model: db.Allcode,
              as: 'provinceTypeData',
              attributes: ['valueEn', 'valueVi'],
            },
          ],
          raw: false,
          nest: true,
        })
        if (!data) data = {}
        resolve({
          errCode: 0,
          data: data,
          errMessage: 'success fully',
        })
      }
    } catch (error) {
      reject(
        resolve({
          errCode: 2,
          errMessage: 'Missing from err getExtraInfoDoctorById',
        }),
      )
    }
  })
}

const getProfileDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing from getProfileDoctorById',
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
            {
              model: db.Doctor_Info,
              attributes: {
                exclude: ['id', 'doctorId'],
              },
              include: [
                {
                  model: db.Allcode,
                  as: 'priceTypeData',
                  attributes: ['valueEn', 'valueVi'],
                },
                {
                  model: db.Allcode,
                  as: 'paymentTypeData',
                  attributes: ['valueEn', 'valueVi'],
                },
                {
                  model: db.Allcode,
                  as: 'provinceTypeData',
                  attributes: ['valueEn', 'valueVi'],
                },
              ],
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
      reject(
        resolve({
          errCode: 2,
          errMessage: 'Missing from err getProfileDoctorById',
        }),
      )
    }
  })
}

module.exports = {
  getTopDoctorHome,
  getAllDoctors,
  saveDetailInfoDoctor,
  getDetailDoctorByIdService,
  buildCreateSchedule,
  getScheduleByDate,
  getExtraInfoDoctorById,
  getProfileDoctorById,
}
