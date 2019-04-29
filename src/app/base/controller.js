import { isUuid } from 'utils'

export default class BaseController {
  constructor({ DB, knex, Model }) {
    this.DB = DB
    this.knex = knex
    this.Model = Model
  }

  async getNodeList({ params }) {
    const { node, fields = [], ...other_params } = params
    return this.DB.filter(this.Model.base.getTable(node), other_params, fields)
  }

  async getNodeDetails({ params }) {
    const { node, id } = params
    const record = await this.DB.find(this.Model.base.getTable(node), id, [], isUuid(id) ? 'id' : 'slug')
    if (!record) {
      throw { status: 404 }
    }
    return record
  }

  async createNode({ params }) {
    const { node } = params
    return this.DB.insert(this.Model.base.getTable(node), params)
  }

  async updateNode({ params }) {
    const { node } = params
    return this.DB.updateById(this.Model.base.getTable(node), params)
  }

  async deleteNode({ params }) {
    const { node } = params
    return this.DB.deleteById(this.Model.base.getTable(node), params)
  }
}
