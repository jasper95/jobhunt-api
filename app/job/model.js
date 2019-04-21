import { selectJsonObject, selectFields } from '../../utils'

export default class JobModel {
  constructor({ DB, knex }) {
    this.DB = DB
    this.knex = knex
  }

  async getJobDetails({ id }) {
    const uuid_regexp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    const key = uuid_regexp.test(id) ? 'job.id' : 'job.slug'

    const job = await this.knex
      .select(
        'job.*',
        this.knex.raw(selectJsonObject(['id', 'name'], 'company')),
      )
      .from('tbl_Job as job', 'tbl_Company as company')
      .leftJoin('tbl_Company as company', 'job.company_id', 'company.id')
      .where({ [key]: id })
      .first()

    return {
      ...job,
      applicants: await this.knex('tbl_Application')
        .where({ job_id: job.id })
        .map(e => e.user_id)
    }
  }

  async getJobSearch(params) {
    const job_fields = ['id', 'name', 'description', 'address_description', 'slug']
    const company_fields = ['id', 'name']
    const category_fields = ['id', 'name']
    return this.knex
      .select(
        ...selectFields(job_fields, 'job'),
        this.knex.raw(selectJsonObject(company_fields, 'company')),
        this.knex.raw(selectJsonObject(category_fields, 'category'))
      )
      .from('tbl_Job as job', 'tbl_Company as company')
      .leftJoin('tbl_Company as company', 'job.company_id', 'company.id')
      .leftJoin('tbl_JobCategory as category', 'job.job_category_id', 'category.id')
      .orderBy([{ column: 'job.created_date', order: 'desc' }])
  }

  async getJobList(params) {
    const { company_id } = params
    const job_fields = ['id', 'name', 'description', 'address_description', 'slug', 'status']
    const application = this.knex('tbl_Application as application')
      .select('application.job_id', this.knex.raw('COUNT(application.job_id) as applicants_count'))
      .groupBy('application.job_id')
      .as('application')
    return this.knex('tbl_Job as job')
      .select(
        ...selectFields(job_fields, 'job'),
        'application.applicants_count'
      )
      .leftJoin(application, 'job.id', 'application.job_id')
      .where({ 'job.company_id': company_id })
  }
}
