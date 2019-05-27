import {
  generateHash,
  generateSalt,
  formatHTML,
  generateSlug
} from 'utils'

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
    let [user] = await this.DB.filter('system_user', { id: user_id })
    user = await this.Model.auth.getUserData(user)
    return {
      ...user,
      token
    }
  }

  async signup({ params }) {
    // validate email
    const [user_exists] = await this.Model.base.validateUnique('system_user', { email: params.email })
    if (user_exists) {
      throw { success: false, message: 'Email already taken.' }
    }

    if (params.role === 'ADMIN') {
      const [company_exists] = await this.Model.base.validateUnique('company', { name: params.company_name })
      if (company_exists) {
        throw { success: false, message: 'Company name already taken' }
      }
      const company = await this.DB.insert('company', { ...params, name: params.company_name })
      params.company_id = company.id
      params.slug = generateSlug(company.name)
    } else {
      params.slug = generateSlug(params.first_name, params.last_name)
    }

    const user = await this.DB.insert('system_user', params)
    const salt = generateSalt()
    this.DB.insert('user_auth',
      { user_id: user.id, password: generateHash(params.password, salt), salt })
    const sendgrid = this.serviceLocator.get('sendgrid')
    const name = params.role === 'ADMIN' ? params.company_name : params.first_name
    const html = await formatHTML('signup', { confirm_link: `${process.env.PORTAL_LINK}/confirm?user_id=${user.id}`, name })
    await sendgrid.send({
      from: {
        name: 'Internlink',
        email: process.env.EMAIL_FROM
      },
      to: user.email,
      subject: 'Verify Internlink Account',
      html
    })

    return {
      success: true
    }
  }

  async login({ params }) {
    const { email, password } = params
    let [user] = await this.DB.filter('system_user', { email })
    if (!user) {
      throw { success: false, message: 'Email does not exists' }
    }
    if (!user.verified) {
      throw { success: false, message: 'Please verify email to login' }
    }
    const { id } = user
    const [{ salt, password: hash_password }] = await this.DB.filter('user_auth', { user_id: id })
    const hash = generateHash(password, salt)
    if (hash !== hash_password) {
      throw { success: false, message: 'Incorrect Password' }
    }
    const token = await this.Model.auth.authenticateUser(user)
    user = await this.Model.auth.getUserData(user)
    return {
      ...user,
      token
    }
  }

  async forgotPassword({ params }) {
    const { email } = params
    const user = await this.DB.find('system_user', email, [], 'email')
    if (!user) {
      throw { success: false, message: 'Email does not exists' }
    }
    if (user.role === 'ADMIN') {
      const { name } = await this.DB.find('company', user.company_id)
      user.first_name = name
    }
    const html = await formatHTML(
      'reset-password',
      { reset_link: `${process.env.PORTAL_LINK}/reset-password?user_id=${user.id}`, name: user.first_name }
    )
    const sendgrid = this.serviceLocator.get('sendgrid')
    await sendgrid.send({
      from: {
        name: 'Internlink',
        email: process.env.EMAIL_FROM
      },
      to: email,
      subject: 'Reset Internlink Account Password',
      html
    })
    return { success: true }
  }

  async resetPassword({ params }) {
    const { user_id, password } = params
    const salt = generateSalt()
    await this.DB.updateByFilter(
      'user_auth',
      { user_id, password: generateHash(password, salt), salt },
      { user_id }
    )
    return { success: true }
  }

  async logout({ session }) {
    return this.DB.deleteById('user_session', { id: session.id })
  }
}
