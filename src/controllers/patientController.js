import patientService from '../services/patientService'

const postBookAppointment = async (req, res) => {
  try {
    let info = await patientService.postBookAppointment(req.body)
    return res.status(200).json(info)
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from postBookAppointment',
    })
  }
}

module.exports = {
  postBookAppointment,
}
