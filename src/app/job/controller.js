export default class JobController {
  constructor({ DB, knex, Model }) {
    this.DB = DB
    this.knex = knex
    this.Model = Model
  }

  async getJobSearch({ params }) {
    return this.Model.job.getJobSearch(params)
  }

  async getJobDetails({ params }) {
    return this.Model.job.getJobDetails(params)
  }

  async getJobList({ params }) {
    return this.Model.job.getJobList(params)
  }

  async updateJob({ params }) {
    const job = await this.DB.updateById('job', params)
    return {
      ...params,
      ...job
    }
  }
}
