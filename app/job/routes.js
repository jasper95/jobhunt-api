const routes = {
  get: [
    {
      url: '/job/:id',
      handler: 'getJobDetails'
    }
  ],
  post: [
    {
      url: '/job',
      handler: 'createJob'
    }
  ]
}
export default routes
