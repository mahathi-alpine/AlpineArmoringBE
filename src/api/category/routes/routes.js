module.exports = {
    routes: [
      { // Path defined with an URL parameter
        method: 'GET',
        path: '/category/:slug', 
        // path: "/category/find-by-slug/:slug",
        handler: 'api::category.category.findBySlug',
      }
    ]
  }