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

  async getUserNotification({ user }) {
    const filters = { user_id: user.id }
    const response = await this.DB.filter(
      'tbl_Notification',
      filters, [], [{ column: 'created_date', direction: 'asc' }]
    )
    this.DB.updateByFilter(
      'tbl_Notification',
      { status: 'read' },
      { user_id: user.id, status: 'unread' }
    )
    return response
  }
}
