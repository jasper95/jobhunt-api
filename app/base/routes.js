const routes = {
  get: [
    {
      url: '/:node/:id',
      handler: 'getNodeDetails'
    },
    {
      url: '/:node',
      handler: 'getNodeList'
    }
  ],
  post: [
    {
      url: '/:node',
      handler: 'createNode'
    }
  ],
  put: [
    {
      url: '/:node/:id',
      handler: 'updateNode'
    }
  ],
  del: [
    {
      url: '/:node/:id',
      handler: 'deleteNode'
    }
  ]
}
export default routes
