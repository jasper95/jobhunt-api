import { upperFirst, snakeCase } from 'lodash'

class BaseModel {
  getTable(node) {
    return `tbl_${upperFirst(snakeCase(node))}`
  }
}

export default BaseModel
