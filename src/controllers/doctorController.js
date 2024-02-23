import doctorService from '../services/doctorService'

const getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit
  if (!limit) limit = 10

  try {
    let response = await doctorService.getTopDoctorHome(+limit)
    return res.status(200).json(response)
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from getTopDoctorHome',
    })
  }
}

const getAllDoctors = async (req, res) => {
  try {
    let doctors = await doctorService.getAllDoctors()
    return res.status(200).json(doctors)
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from getAllDoctor',
    })
  }
}

const postInfoDoctor = async (req, res) => {
  try {
    let response = await doctorService.saveDetailInfoDoctor(req.body)
    return res.status(200).json(response)
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from postInfoDoctor',
    })
  }
}

const getDetailDoctorById = async (req, res) => {
  try {
    let info = await doctorService.getDetailDoctorByIdService(req.query.id)
    return res.status(200).json(info)
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from getDetailDoctorById',
    })
  }
}

const buildCreateSchedule = async (req, res) => {
  try {
    let info = await doctorService.buildCreateSchedule(req.body)
    return res.status(200).json(info)
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from buildCreateSchedule',
    })
  }
}

module.exports = {
  getTopDoctorHome,
  getAllDoctors,
  postInfoDoctor,
  getDetailDoctorById,
  buildCreateSchedule,
}
