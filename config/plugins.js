module.exports = {
  'drag-drop-content-types': {
    enabled: true
  },
  'import-export-entries': {
    enabled: true,
    config: {
      // serverPublicHostname: 'https://res.cloudinary.com'
    },
  },
  seo: {
    enabled: true,
  },
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
      }
    },
  },
}