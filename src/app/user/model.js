import { selectJsonArray, selectFields } from 'utils'

export default class UserModel {
  constructor({ DB, knex }) {
    this.DB = DB
    this.knex = knex
  }

  async getApplicantSuggestion(params) {
    console.log('params: ', params);
    const { company_id } = params
    const postings = await this.DB
      .filter('tbl_Job', { company_id }, ['job_category_id', 'skills'])
      .reduce((acc, el) => {
        acc.categories = [...acc.categories, el.job_category_id]
        acc.skills = [...acc.skills, ...el.skills.map(e => e.toLowerCase())]
        return acc
      }, { categories: [], skills: [] })
    const users_with_skill = await this.knex('tbl_Skill')
      .select('user_id')
      .whereIn(this.knex.raw('LOWER("name")'), postings.skills)
      .map(e => e.user_id)

    const users_with_education = await this.knex('tbl_Education')
      .select('user_id')
      .whereIn('job_category_id', postings.categories)
      .map(e => e.user_id)

    const education_category = this.knex('tbl_Education as education')
      .select('education.*', 'category.name as category')
      .leftJoin('tbl_JobCategory as category', 'education.job_category_id', 'category.id')
      .orderBy('education.end_date', 'desc')
      .as('education_category')

    return this.knex
      .select(
        ...selectFields(
          ['id', 'first_name', 'last_name', 'address', 'contact_number', 'birth_date'],
          'user'
        ),
        this.knex.raw(selectJsonArray(['name', 'id'], 'skill', 'user_id', 'skills')),
        this.knex.raw(selectJsonArray(['position', 'id', 'company', 'start_date', 'end_date'], 'experience', 'user_id', 'experiences')),
        this.knex.raw(selectJsonArray(['school', 'id', 'school', 'category', 'start_date', 'end_date'], 'education_category', 'user_id', 'educations'))
      )
      .from(
        'tbl_User as user',
        'tbl_Skill as skill',
        'tbl_Experience as experience',
        education_category
      )
      .leftJoin('tbl_Skill as skill', 'user.id', 'skill.user_id')
      .leftJoin('tbl_Experience as experience', 'user.id', 'experience.user_id')
      .leftJoin(education_category, 'user.id', 'education_category.user_id')
      .whereIn('user.id', users_with_skill.concat(users_with_education))
      .groupBy('user.id')
  }
}
