import db from '../models/index'

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll()
    return res.render('homepage.ejs', { data: JSON.stringify(data) })
  } catch (error) {
    console.log('error from getHomePage', error)
  }
}

module.exports = {
  getHomePage,
}
