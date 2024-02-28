import clinicService from '../services/clinicService'

const createClinic = async (req, res) => {
  try {
    let info = await clinicService.createClinic(req.body)
    return res.status(200).json(info)
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from createClinic',
    })
  }
}

const getAllClinic = async (req, res) => {
  try {
    let info = await clinicService.getAllClinic()
    return res.status(200).json(info)
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from getAllClinic',
    })
  }
}

const getDetailClinicById = async (req, res) => {
  try {
    let info = await clinicService.getDetailClinicById(req.query.id)
    return res.status(200).json(info)
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from getDetailClinicById',
    })
  }
}

module.exports = {
  createClinic,
  getAllClinic,
  getDetailClinicById,
}
