import {
  generateHash,
  generateSalt
} from '../../utils'

export default class UserController {
  constructor({
    DB, knex, Model, serviceLocator
  }) {
    this.DB = DB
    this.knex = knex
    this.Model = Model
    this.serviceLocator = serviceLocator
  }

  async getSession({ session }) {
    const { user_id, token } = session
    const [user] = await this.DB.filter('tbl_User', { id: user_id })
    if (user.role === 'ADMIN' && user.company_id) {
      const company = await this.DB.find('tbl_Company', user.company_id)
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
      const company = await this.DB.insert('tbl_Company', { ...params, name: params.company_name })
      params.company_id = company.id
    }

    const user = await this.DB.insert('tbl_User', params)
    const salt = generateSalt()
    this.DB.insert('tbl_UserAuth',
      { user_id: user.id, password: generateHash(params.password, salt), salt })
    const sendgrid = this.serviceLocator.get('sendgrid')

    await sendgrid.send({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Verify Account',
      text: `Please click this link to verify your account ${process.env.PORTAL_LINK}/confirm?user_id=${user.id}`
    })

    return {
      success: true
    }
    // const token = await this.Model.auth.authenticateUser(user)

    // return {
    //   ...user,
    //   token
    // }
  }

  async login({ params }) {
    const { email, password } = params
    const [user] = await this.DB.filter('tbl_User', { email })
    if (!user) {
      throw { success: false, message: 'Email does not exists' }
    }
    if (!user.verified) {
      throw { success: false, message: 'Please verify email to login' }
    }
    const { id } = user
    const [{ salt, password: hash_password }] = await this.DB.filter('tbl_UserAuth', { user_id: id })
    const hash = generateHash(password, salt)
    if (hash !== hash_password) {
      throw { success: false, message: 'Incorrect Password' }
    }
    const token = await this.Model.auth.authenticateUser(user)
    if (user.role === 'ADMIN' && user.company_id) {
      const company = await this.DB.find('tbl_Company', user.company_id)
      if (company) {
        user.company = company
      }
    }
    return {
      ...user,
      token
    }
  }

  async logout({ session }) {
    return this.DB.deleteById('tbl_UserSession', { id: session.id })
  }
}
