
export default class UserModel {
  constructor({ DB, knex }) {
    this.DB = DB
    this.knex = knex
  }

  async getApplicantSuggestion(params) {
    const { company_id } = params
    const postings = await this.DB
      .filter('tbl_Job', { company_id }, ['job_category_id', 'skills'])
      .reduce((acc, el) => {
        acc.categories = [...acc.categories, el.job_category_id]
        acc.skills = [...acc.skills, ...el.skills.map(e => e.toLowerCase())]
        return acc
      }, { categories: [], skills: [] })
    const users_with_skill = await this.knex('tbl_Skill as skill')
      .select('user_id')
      .whereRaw('LOWER(skill.name) in = ?', [postings.skills])
      .map(e => e.user_id)

    return this.knex
      .select('user.*')
      .from('tbl_User as user')
      .whereIn('id', users_with_skill)
      .orWhereIn('job_category_id', postings.categories)
  }
}
