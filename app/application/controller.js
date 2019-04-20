
export default class ApplicationController {
  constructor(context) {
    const {
      DB, knex, Model, serviceLocator
    } = context
    this.DB = DB
    this.knex = knex
    this.Model = Model
    this.serviceLocator = serviceLocator
  }

  async getApplicationList({ params }) {
    return this.Model.application.getApplicationList(params)
  }

  async updateApplication({ params }) {
    const response = await this.DB.updateById('tbl_Application', params)
    if (['accepted', 'rejected'].includes(params.status)) {
      const sendgrid = this.serviceLocator.get('sendgrid')
      const user = await this.DB.find('tbl_User', response.user_id, ['email'])
      await sendgrid.send({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Application Status',
        text: `You application has been ${params.status}`,
        html: '<strong>and easy to do anywhere, even with Node.js</strong>'
      })
    }
    return response
  }
}
