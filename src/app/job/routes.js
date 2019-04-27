const routes = {
  get: [
    {
      url: '/job/search',
      handler: 'getJobSearch'
    },
    {
      url: '/job/:id',
      handler: 'getJobDetails'
    },
    {
      url: '/job',
      handler: 'getJobList'
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
