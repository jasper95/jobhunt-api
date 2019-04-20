export default class EducationController {
  constructor({ DB, knex, Model }) {
    this.DB = DB
    this.knex = knex
    this.Model = Model
  }

  async getEducationList({ params }) {
    return this.Model.education.getEducationList(params)
  }
}
