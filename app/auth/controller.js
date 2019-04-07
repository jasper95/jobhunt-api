import {
  generateHash,
  generateSalt
} from '../../utils'

export default class UserController {
  constructor({ DB, knex, Model }) {
    this.DB = DB
    this.knex = knex
    this.Model = Model
  }

  async getSession({ session }) {
    const { user_id, token } = session
    const [user] = await this.DB.filter('tbl_User', { id: user_id })
    if (user.role === 'ADMIN' && user.company_id) {
      const [company] = await this.DB.filter('tbl_Company', { id: user.company_id })
      if (company) {
        user.company = company
      }
    }
    return {
      ...user,
      token
    }
  }

  async signup({ params }) {
    if (params.role === 'ADMIN') {
      const company = await this.DB.insert('tbl_Company', { name: params.company_name })
      params.company_id = company.id
    }

    const user = await this.DB.insert('tbl_User', params)
    const salt = generateSalt()
    this.DB.insert('tbl_UserAuth',
      { user_id: user.id, password: generateHash(params.password, salt), salt })

    const token = await this.Model.auth.authenticateUser(user)

    return {
      ...user,
      token
    }
  }

  async login({ params }) {
    const { email, password } = params
    const [user] = await this.DB.filter('tbl_User', { email })
    const { id } = user
    const [{ salt, password: hash_password }] = await this.DB.filter('tbl_UserAuth', { user_id: id })
    const hash = generateHash(password, salt)
    if (hash !== hash_password) {
      throw { success: false, message: 'Incorrect Password' }
    }
    const token = await this.Model.auth.authenticateUser(user)
    return {
      ...user,
      token
    }
  }

  async logout({ session }) {
    return this.DB.deleteById('tbl_UserSession', { id: session.id })
  }
}
