export default class JobController {
  constructor({ DB, knex, Model }) {
    this.DB = DB
    this.knex = knex
    this.Model = Model
  }

  async getApplicantSuggestion({ user }) {
    return this.Model.user.getApplicantSuggestion(user)
  }
}
