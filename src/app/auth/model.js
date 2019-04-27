import jwt from 'jsonwebtoken'

class AuthModel {
  constructor({ DB, knex, Model }) {
    this.DB = DB
    this.knex = knex
    this.Model = Model
  }

  async authenticateUser(user) {
    const session = await this.DB.insert('tbl_UserSession', { user_id: user.id, status: 'Online', device_type: 'Web' })
    return jwt.sign(session, process.env.AUTH_SECRET, {
      expiresIn: process.env.AUTH_VALIDITY
    })
  }
}

export default AuthModel
