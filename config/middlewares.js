module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', 'strapi.io', 'alpine-backend-992382787275.s3.us-east-1.amazonaws.com', 'd102sycao8uwt8.cloudfront.net'],
          'media-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', 'strapi.io', 'alpine-backend-992382787275.s3.us-east-1.amazonaws.com', 'd102sycao8uwt8.cloudfront.net'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public'
];
