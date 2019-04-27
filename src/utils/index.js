import crypto from 'crypto'
import fs from 'fs'
import bluebird from 'bluebird'
import util from 'util'
import path from 'path'

export const serviceLocator = {
  services: {},
  registerService(service_name, service) {
    if (!this.services[service_name]) {
      this.services[service_name] = service
    }
  },
  get(service_name) {
    return this.services[service_name]
  }
}

export const generateSalt = (length = 16) => crypto
  .randomBytes(Math.ceil(length / 2))
  .toString('hex')
  .slice(0, length)

export const generateHash = (password, salt) => crypto
  .createHmac('sha512', salt)
  .update(password)
  .digest('hex')

const proxyHandler = (targetValue, { prototype, target }, ...args) => {
  const log = serviceLocator.get('logger')
  if (!prototype.includes('_')) {
    log('info', '%s - %s Params: %s', target.constructor.name, prototype, util.inspect(args))
  }
  return targetValue.apply(target, args)
}

export const selectJsonObject = (fields, alias) => `
  json_build_object(${fields.map(field => `'${field}', ${alias}.${field}`).join(', ')}) as ${alias}
`

export const selectFields = (fields, alias) => fields.map(field => `${alias}.${field}`)

export const createProxy = (object, cb = proxyHandler) => {
  const handler = {
    get(target, prototype, receiver) {
      const targetValue = Reflect.get(target, prototype, receiver)
      if (prototype in Object.getPrototypeOf(target) && typeof targetValue === 'function') {
        return (...args) => cb(targetValue, { target, prototype }, ...args)
      }
      return targetValue
    }
  }
  return new Proxy(object, handler)
}

export const formatHTML = async (template_name, content) => {
  const readFile = Promise.promisify(fs.readFile)
  const file_path = path.join(process.cwd(), 'resources', 'html-templates', `${template_name}.html`)
  const html = await readFile(file_path, 'utf-8')
  return Object.entries(content)
    .reduce((acc, [key, value]) => {
      acc = acc.replace(new RegExp(`\\\${\\s*${key}\\s*}`, 'g'), value)
      return acc
    }, html)
}

export const readDirPromise = bluebird.promisify(fs.readdir)
