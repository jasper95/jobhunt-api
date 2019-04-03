const routes = {
  get: [
    {
      url: '/session',
      handler: 'getSession'
    }
  ],
  post: [
    {
      url: '/signup',
      handler: 'signup'
    },
    {
      url: '/login',
      handler: 'login'
    },
    {
      url: '/logout',
      handler: 'logout'
    }
  ],
  put: [],
  del: []
}
export default routes
