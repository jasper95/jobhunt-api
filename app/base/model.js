import { upperFirst, camelCase } from 'lodash'

class BaseModel {
  getTable(node) {
    return `tbl_${upperFirst(camelCase(node))}`
  }
}

export default BaseModel
