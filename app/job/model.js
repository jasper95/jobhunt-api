class BaseModel {
  constructor({ DB, knex }) {
    this.DB = DB
    this.knex = knex
  }

  async getJobDetails({ id }) {
    const uuid_regexp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    const key = uuid_regexp.test(id) ? 'id' : 'slug'
    const job = await this.knex('tbl_Job')
      .where({ [key]: id })
      .first()
    if (job) {
      const company = await this.DB.find('tbl_Company', job.company_id, ['id', 'name', 'email'])
      job.company = company
    }
    return job
  }
}

export default BaseModel
