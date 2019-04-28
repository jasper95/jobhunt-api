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
  put: [
    {
      url: '/job',
      handler: 'updateJob'
    }
  ]
}
export default routes
