import path from 'path'
import util from 'util'
import sendgrid from '@sendgrid/mail'
import {
  readDirPromise,
  serviceLocator
} from '../utils'


export default async ({ server, log }) => {
  const dir = path.join(__dirname, './initializers')

  sendgrid.setApiKey(process.env.SEND_GRID_API_KEY)

  serviceLocator.registerService('sendgrid', sendgrid)
  serviceLocator.registerService('logger', log)

  const context = { server, log, serviceLocator }
  return readDirPromise(dir)
    .then(files => files.sort())
    .mapSeries(async (file) => {
      const { default: initializer } = require(`${dir}/${file}`) // eslint-disable-line
      await initializer(context)
      return null
    })
    .catch(err => log('error', util.inspect(err)))
}
