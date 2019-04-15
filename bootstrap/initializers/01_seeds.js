import util from 'util'
import default_data from '../../config/default_data'

export default ({ DB, log }) => {
  // insert default data
  return Promise.mapSeries(default_data, ({ table_name, data }) => {
    return DB.upsert(table_name, data)
  })
  .then(() => log('info', 'Seed data successfully added [Tables: %s]', default_data.map(e => e.table_name)))
  .catch(err => log('error', 'Error adding seed data [Error: %s]', util.inspect(err)))
}