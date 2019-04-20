const routes = {
  get: [
    {
      url: '/application',
      handler: 'getApplicationList'
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
