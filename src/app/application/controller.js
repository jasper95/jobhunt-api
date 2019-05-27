import { formatHTML } from 'utils'
import { startCase, toLower } from 'lodash'

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
    const response = await this.DB.insert('application', params)
    const [job, company, admin] = await Promise.all([
      this.DB.find('job', job_id, ['name', 'slug']),
      this.DB.find('company', company_id, ['name', 'email']),
      this.DB.find('system_user', company_id, [], 'company_id')
    ])
    const html = await formatHTML(
      'company-application',
      {
        job_link: `${process.env.PORTAL_LINK}/job/${job.slug}`,
        job_name: job.name,
        company_name: company.name
      }
    )
    await this.DB.insert('notification', {
      body: {
        message: `New Application received for ${startCase(toLower(`${job.name}`))}`,
        icon: 'info',
        type: 'success'
      },
      user_id: admin.id,
      status: 'unread'
    })
    await sendgrid.send({
      from: {
        name: 'Internlink',
        email: process.env.EMAIL_FROM
      },
      to: company.email,
      subject: 'Internlink - New Application Received',
      html
    })
    return response
  }

  async updateApplication({ params }) {
    const response = await this.DB.updateById('application', params)
    const { status } = params
    if (['accepted', 'rejected'].includes(status)) {
      const sendgrid = this.serviceLocator.get('sendgrid')
      const { user_id, company_id, job_id } = response
      const [user, company, job] = await Promise.all([
        this.DB.find('system_user', user_id, ['email', 'first_name']),
        this.DB.find('company', company_id, ['name']),
        this.DB.find('job', job_id, ['name'])
      ])
      await this.DB.insert('notification', {
        body: {
          message: `${startCase(toLower(company.name))} ${status} your application`,
          icon: status === 'accepted' ? 'thumb_up' : 'thumb_down',
          type: status === 'accepted' ? 'success' : 'warning'
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
        subject: 'Internlink - Application Status',
        html
      })
    }
    return response
  }
}
