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
    .mapSeries(async (file) => {
      const { default: initializer } = require(`${dir}/${file}`) // eslint-disable-line
      await initializer(context)
      return null
    })
    .catch(err => log('error', util.inspect(err)))
}
