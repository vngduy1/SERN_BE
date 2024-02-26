import db from '../models/index'
require('dotenv').config()

const postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.doctorId || !data.timeType || !data.date) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter',
        })
      } else {
        let user = await db.User.findOrCreate({
          where: {
            email: data.email,
          },
          attributes: { exclude: ['password'] },
          defaults: {
            email: data.email,
            roleId: 'R3',
          },
        })

        if (user && user[0]) {
          await db.Booking.findOrCreate({
            where: {
              patientId: user[0].id,
            },
            defaults: {
              statusId: 'S1',
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
            },
          })
        }
        resolve({
          errCode: 0,
          errMessage: 'Save info successfully',
        })
      }
    } catch (error) {
      reject(
        resolve({
          errCode: 2,
          errMessage: 'Missing from err postBookAppointment',
        }),
      )
    }
  })
}

module.exports = {
  postBookAppointment,
}
