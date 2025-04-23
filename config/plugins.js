module.exports = ({ env }) => ({
  translate: {
    enabled: true,
    config: {
      provider: 'deepl',
      providerOptions: {
        apiKey: env('DEEPL_API_KEY'),
        // apiUrl: 'https://api-free.deepl.com',
        localeMap: {
          EN: 'EN-US',
          ES: 'ES',
        },
        apiOptions: {
          // see <https://github.com/DeepLcom/deepl-node#text-translation-options> for supported options.
          formality: 'default'
        },
      },
      translatedFieldTypes: [
        'string',
        { type: 'text', format: 'plain' },
        { type: 'richtext', format: 'markdown' },
        'component',
        'dynamiczone',
      ],
    },
  },
  'drag-drop-content-types': {
    enabled: true
  },
  // 'import-export-entries': {
  //   enabled: true
  // },
  seo: {
    enabled: true,
  },
  // 'sitemap': {
  //   enabled: true,
  //   config: {
  //     cron: '0 0 0 * * *',
  //     xsl: true,
  //     autoGenerate: false,
  //     caching: true,
  //     allowedFields: ['id', 'uid'],
  //   },
  // },
  redirects : {
    enabled: true,
  },
  upload: {
    config: {
      provider: 'strapi-provider-upload-aws-s3-plus-cdn',
      providerOptions: {
        // accessKeyId: env('AWS_ACCESS_KEY_ID'),
        // secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION'),
        params: {
          ACL: env('AWS_ACL', 'private'),
          signedUrlExpires: env('AWS_SIGNED_URL_EXPIRES', 15*60),
          Bucket: env('AWS_BUCKET'),
          ContentDisposition: 'inline',
          ResponseContentDisposition: 'inline',
          ContentType: 'image/jpeg',
        },
        contentType: 'image/jpeg',
        contentDisposition: 'inline',
        baseUrl: env('AWS_CLOUDFRONT_URL'),
        rootPath: '',
        cdnUrl: env('AWS_CLOUDFRONT_URL')
      },
      breakpoints: {
        xlarge: 2200,
        large: 1300,
        medium: 750,
        thumbnail: 500
      }
    },
  },
  email: {
    config: {
      provider: 'amazon-ses',
      providerOptions: {
        key: env('AWS_ACCESS_KEY_ID'),
        secret: env('AWS_ACCESS_SECRET'),
        amazon: 'https://email.us-east-1.amazonaws.com'
      },
      // settings: {
      //   defaultFrom: 'sales@alpineco.com',
      //   defaultReplyTo: 'sales@alpineco.com'
      // },
    },
  },
})