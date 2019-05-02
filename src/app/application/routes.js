const routes = {
  get: [
    {
      url: '/application',
      handler: 'getApplicationList'
    }
  ],
  post: [
    {
      url: '/application',
      handler: 'createApplication'
    }
  ],
  put: [
    {
      url: '/application',
      handler: 'updateApplication'
    }
  ]
}
export default routes
