import pick from 'lodash/pick'

export default class JobController {
  constructor({ DB, knex, Model }) {
    this.DB = DB
    this.knex = knex
    this.Model = Model
  }

  async getApplicantSuggestion({ user, params }) {
    return this.Model.user
      .getApplicantSuggestion({
        ...pick(user, 'company_id'),
        ...pick(params, 'job_category_id', 'province')
      })
  }

  async getUserNotification({ user, params }) {
    const filters = { user_id: user.id }
    if (params.new) {
      filters.status = 'unread'
    }
    return this
      .DB.filter('tbl_Notification', filters)
  }
}
