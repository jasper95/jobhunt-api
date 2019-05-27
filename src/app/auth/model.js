import jwt from 'jsonwebtoken'

class AuthModel {
  constructor({ DB, knex, Model }) {
    this.DB = DB
    this.knex = knex
    this.Model = Model
  }

  async authenticateUser(user) {
    const session = await this.DB.insert('user_session', { user_id: user.id, status: 'Online', device_type: 'Web' })
    return jwt.sign(session, process.env.AUTH_SECRET, {
      expiresIn: process.env.AUTH_VALIDITY
    })
  }

  async getUserData(user) {
    if (user.role === 'ADMIN' && user.company_id) {
      const company = await this.DB.find('company', user.company_id)
      if (company) {
        user.company = company
      }
    }
    const { id } = user
    user.unread_notifications = await this.knex('notification')
      .where({ user_id: id, status: 'unread' })
      .count()
      .first()
      .then(e => e.count)
    return user
  }
}

export default AuthModel
