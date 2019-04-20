import { pick } from 'lodash'

export default class EducationModel {
  constructor({ DB, knex }) {
    this.DB = DB
    this.knex = knex
  }

  async getEducationList(params) {
    const { fields = [], ...filters } = params
    return this.knex
      .select('education.*', 'category.name as job_category')
      .from('tbl_Education as education', 'tbl_JobCategory as category')
      .leftJoin('tbl_JobCategory as category', 'education.job_category_id', 'category.id')
      .where(filters)
      .map(e => pick(e, fields))
      // .pluck(fields)
  }
}
