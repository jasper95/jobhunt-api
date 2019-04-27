import jwt from 'jsonwebtoken'
import pathToRegexp from 'path-to-regexp'
import {
  serviceLocator
} from '../utils'

const public_routes = {
  GET: [
    '/job/:id',
    '/file/download'
  ],
  POST: [],
  PUT: [],
  DELETE: []
}

const basic_auth_routes = {
  GET: [],
  POST: [
    '/signup',
    '/login'
  ],
  PUT: [
    '/user'
  ],
  DELETE: []
}

function matchRoutes(routes, req) {
  return routes[req.method].some(pathname => pathToRegexp(pathname).test(req.getPath()))
}

export default async function authMiddleware(req, res, next) {
  const DB = serviceLocator.get('DB')
  req.authenticated = true
  const { token } = req.headers
  if (matchRoutes(public_routes, req)) {
    return next()
  }
  if (matchRoutes(basic_auth_routes, req)) {
    if (req.username !== process.env.BASIC_USERNAME
      || req.authorization.basic.password !== process.env.BASIC_PASSWORD) {
      req.auth_error = 'Invalid credentials'
      req.authenticated = false
    }
  } else if (token) {
    try {
      const { id } = jwt.verify(token, process.env.AUTH_SECRET)
      const [session] = await DB.filter('tbl_UserSession', { id })
      if (!session || session.status !== 'Online') {
        req.auth_error = 'Invalid token'
        req.authenticated = false
      } else if (session) {
        req.session = session
      }
    } catch (err) {
      req.authenticated = false
      req.auth_error = err.message
    }
  } else {
    req.auth_error = 'Authentication is required'
    req.authenticated = false
  }
  return next()
}
