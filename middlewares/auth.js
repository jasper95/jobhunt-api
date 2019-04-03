import jwt from 'jsonwebtoken'
import {
  serviceLocator
} from '../utils'

const unprotected_routes = {
  GET: [],
  POST: [
    '/signup',
    '/login'
  ],
  PUT: [],
  DELETE: []
}

export default async (req, res, next) => {
  const DB = serviceLocator.get('DB')
  let authenticated = true
  let auth_error = ''
  const { token } = req.headers
  if (unprotected_routes[req.method].includes(req.url)) {
    if (req.username !== process.env.BASIC_USERNAME
      || req.authorization.basic.password !== process.env.BASIC_PASSWORD) {
      auth_error = 'Incorrect basic auth credentials'
      authenticated = false
    }
  } else if (token) {
    try {
      const { id } = jwt.verify(token, process.env.AUTH_SECRET)
      const [session] = await DB.filter('tbl_UserSession', { id })
      if (!session || session.status !== 'Online') {
        auth_error = 'Invalid token'
        authenticated = false
      } else if (session) {
        req.session = session
      }
    } catch (err) {
      authenticated = false
      auth_error = err
    }
  } else {
    auth_error = 'Invalid Token'
    authenticated = false
  }
  req.authenticated = authenticated
  req.auth_error = auth_error
  return next()
}
