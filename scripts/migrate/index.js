require('dotenv').config()
const {
  SchemaBuilder,
  QueryWrapper
} = require('knex-wrapper')
const knex = require('knex')
const chalk = require('chalk')
const util = require('util')
const {
  seeds,
  database,
  schema
} = require('../../config')

global.Promise = require('bluebird')

const { log } = console
const { db_name, port, host } = database.connection
const query_wrapper = new QueryWrapper(schema, knex, database)
const schema_builder = new SchemaBuilder(schema, query_wrapper);

(async () => {
  await schema_builder.setupSchema()
    .then(() => log(chalk.green(`Database schema successfully updated [Connection: ${host}:${port}, Name: ${db_name}]`)))
    .catch(err => log(chalk.red(`'Error updating up schema [Error: ${util.inspect(err)}]`)))
  await Promise.mapSeries(seeds, ({ table_name, data }) => query_wrapper.upsert(table_name, data))
    .then(() => log(chalk.green(`Seed successfully updated [Tables: ${seeds.map(e => e.table_name).join(', ')}]`)))
    .catch(err => log(chalk.red(`'Error updating seeds [Error: ${util.inspect(err)}]`)))
  process.exit(0)
})()
