export default class ApplicationModel {
  constructor({ DB, knex }) {
    this.DB = DB
    this.knex = knex
  }

  async getApplicationList(params) {
    const { company_id } = params
    const job_with_category = this.knex
      .select('job.id as job_id', 'category.name as job_category', 'job.name as job_name')
      .from('tbl_Job as job')
      .leftJoin('tbl_JobCategory as category', 'job.job_category_id', 'category.id')
      .as('job_with_category')
    const user = this.knex('tbl_User as user')
      .select(
        this.knex.raw(
          'array_to_string(ARRAY[??, ??], \' \') as applicant_name',
          ['user.first_name', 'user.last_name']
        ),
        'education.school as applicant_school',
        'user.id as user_id'
      )
      .leftJoin('tbl_Education as education', 'user.id', 'education.user_id')
      .orderBy([{ column: 'education.created_date', order: 'desc' }])
      .as('user')
    return this.knex('tbl_Application as application')
      .select(
        'application.id as id',
        'application.status as status',
        'user.*',
        'job_with_category.*',
      )
      .leftJoin(user, 'application.user_id', 'user.user_id')
      .leftJoin(
        job_with_category,
        'application.job_id',
        'job_with_category.job_id'
      )
      .where({ 'application.company_id': company_id })
  }
}
