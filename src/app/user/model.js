import { selectJsonArray, selectFields } from 'utils'

export default class UserModel {
  constructor({ DB, knex }) {
    this.DB = DB
    this.knex = knex
  }

  async getApplicantSuggestion(params) {
    const { company_id, job_category_id, province } = params
    let postings = { categories: [], skills: [] }
    let users_with_skill = []
    if (!job_category_id) {
      postings = await this.DB
        .filter('job', { company_id }, ['job_category_id', 'skills'])
        .reduce((acc, el) => {
          acc.categories = [...acc.categories, el.job_category_id]
          acc.skills = [...acc.skills, ...el.skills.map(e => e.toLowerCase())]
          return acc
        }, postings)
      users_with_skill = await this.knex('skill')
        .select('user_id')
        .whereIn(this.knex.raw('LOWER("name")'), postings.skills)
        .map(e => e.user_id)
    } else {
      postings.categories = [job_category_id]
    }

    const users_with_education = await this.knex('education')
      .select('user_id')
      .whereIn('job_category_id', postings.categories)
      .map(e => e.user_id)

    const education_category = this.knex('education')
      .select('education.*', 'category.name as category')
      .leftJoin('job_category as category', 'education.job_category_id', 'category.id')
      .orderBy('education.end_date', 'desc')
      .as('education_category')

    let query = this.knex
      .select(
        ...selectFields(
          ['id', 'first_name', 'last_name', 'address_description', 'contact_number', 'birth_date'],
          'user'
        ),
        this.knex.raw(selectJsonArray(['name', 'id'], 'skill', 'user_id', 'skills')),
        this.knex.raw(selectJsonArray(['position', 'id', 'company', 'start_date', 'end_date'], 'experience', 'user_id', 'experiences')),
        this.knex.raw(selectJsonArray(['school', 'id', 'school', 'category', 'start_date', 'end_date'], 'education_category', 'user_id', 'educations'))
      )
      .from(
        'system_user as user',
        'skill as skill',
        'experience as experience',
        education_category
      )
      .leftJoin('skill as skill', 'user.id', 'skill.user_id')
      .leftJoin('experience as experience', 'user.id', 'experience.user_id')
      .leftJoin(education_category, 'user.id', 'education_category.user_id')

    if (province) {
      query = query.where({ 'user.province': province })
    }

    return query
      .whereIn('user.id', users_with_skill.concat(users_with_education))
      .groupBy('user.id')
  }
}
