import { formatHTML } from 'utils'
import capitalize from 'lodash/capitalize'

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

  async createApplication({ params }) {
    const { company_id, job_id } = params
    const sendgrid = this.serviceLocator.get('sendgrid')
    const response = await this.DB.insert('tbl_Application', params)
    const [job, company] = await Promise.all([
      this.DB.find('tbl_Job', job_id, ['name', 'slug', 'email']),
      this.DB.find('tbl_Company', company_id, ['name'])
    ])
    const html = await formatHTML(
      'company-application',
      {
        job_link: `${process.env.PORTAL_LINK}/job/${job.slug}`,
        job_name: job.name,
        company_name: company.name
      }
    )
    await sendgrid.send({
      from: {
        name: 'Internlink',
        email: process.env.EMAIL_FROM
      },
      to: company.email,
      subject: 'Application Received',
      html
    })
    return response
  }

  async updateApplication({ params }) {
    const response = await this.DB.updateById('tbl_Application', params)
    const { status } = params
    if (['accepted', 'rejected'].includes(status)) {
      const sendgrid = this.serviceLocator.get('sendgrid')
      const { user_id, company_id, job_id } = response
      const [user, company, job] = await Promise.all([
        this.DB.find('tbl_User', user_id, ['email', 'first_name']),
        this.DB.find('tbl_Company', company_id, ['name']),
        this.DB.find('tbl_Job', job_id, ['name'])
      ])
      await this.DB.insert('tbl_Notification', {
        body: {
          message: `You application has been ${capitalize(status)}`,
          icon: status === 'accepted' ? 'thumb_up' : 'thumb_down'
        },
        user_id,
        status: 'unread'
      })
      const html = await formatHTML(
        'application-response',
        {
          name: user.first_name,
          job_name: job.name,
          message: this.Model.application
            .getApplicationResponse({ status, job, company })
        }
      )
      await sendgrid.send({
        from: {
          name: 'Internlink',
          email: process.env.EMAIL_FROM
        },
        to: user.email,
        subject: 'Application Status',
        html
      })
    }
    return response
  }
}
