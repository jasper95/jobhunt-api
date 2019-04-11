import { omit } from 'lodash'

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
    const { node } = params
    return this.DB.filter(this.Model.base.getTable(node), params)
  }

  async createNode({ params }) {
    const { node } = params
    return this.DB.insert(this.Model.base.getTable(node), params)
  }

  async updateNode({ params }) {
    const { node } = params
    return this.DB.updateById(this.Model.base.getTable(node), omit(params, 'node'))
  }

  async deleteNode({ params }) {
    const { node } = params
    return this.DB.deleteById(this.Model.base.getTable(node), params)
  }
}
