import crypto from 'crypto'
import fs from 'fs'
import bluebird from 'bluebird'
import util from 'util'

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

export const readDirPromise = bluebird.promisify(fs.readdir)
