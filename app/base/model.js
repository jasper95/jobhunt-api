import { upperFirst, snakeCase } from 'lodash'

class BaseModel {
  getTable(node) {
    return `${upperFirst(snakeCase(node))}`
  }
}

export default BaseModel
