import path from 'path'
import util from 'util'
import {
  readDirPromise
} from '../utils'

export default async ({ server, log }) => {
  const context = { server, log }
  const dir = path.join(__dirname, './initializers')

  return readDirPromise(dir)
    .then(files => files.sort())
    .mapSeries((file) => {
      const { default: initializer } = require(`${dir}/${file}`) // eslint-disable-line
      initializer(context)
      return null
    })
    .catch(err => log('error', util.inspect(err)))
}
