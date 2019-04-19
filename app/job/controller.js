import shortid from 'shortid'
import slugify from 'slugify'

export default class JobController {
  constructor({ DB, knex, Model }) {
    this.DB = DB
    this.knex = knex
    this.Model = Model
  }

  async getJobDetails({ params }) {
    return this.Model.job.getJobDetails(params)
  }

  async createJob({ params }) {
    params.slug = `${slugify(params.name.toLowerCase())}-${shortid.generate()}`
    return this.DB.insert('tbl_Job', params)
  }
}
