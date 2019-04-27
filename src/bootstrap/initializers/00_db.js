import {
  QueryWrapper
} from 'knex-wrapper'
import knex from 'knex'
import {
  database,
  schema
} from '../../../config'
import {
  createProxy,
  serviceLocator
} from '../../utils'

export default (self) => {
  const { db_name, port, host } = database.connection
  const query_wrapper = createProxy(new QueryWrapper(schema, knex, database))
  self.DB = query_wrapper
  self.knex = query_wrapper.knex
  serviceLocator.registerService('DB', query_wrapper)
  serviceLocator.registerService('knex', query_wrapper.knex)
  self.log('info', 'Connected to Database [Connection: %s:%s, Name: %s]', host, port, db_name)
}
