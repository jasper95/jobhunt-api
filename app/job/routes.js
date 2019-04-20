const routes = {
  get: [
    {
      url: '/job/search',
      handler: 'getJobSearch'
    },
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
  ],
  put: [
    {
      url: '/job',
      handler: 'updateJob'
    }
  ]
}
export default routes
