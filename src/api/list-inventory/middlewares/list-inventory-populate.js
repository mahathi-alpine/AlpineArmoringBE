'use strict';

/**
 * `list-inventory-populate` middleware
 */
const populate = { 
  banner:{
    populate: {
      media: {
        fields: ['url', 'mime', 'alternativeText', 'width', 'height', 'formats']
      },
      imageMobile: {
        fields: ['url', 'mime', 'alternativeText', 'width', 'height', 'formats']
      },
      mediaMP4: {
        fields: ['url', 'mime', 'width', 'height']
      },
    },
  },  
  seo: {
    metaImage: {
      populate: true,
      fields: ['url']
    },
    metaSocial: {
      image: {
        populate: true,
        fields: ['url']
      }
    }
  }
}

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In list-inventory-populate middleware.');

    ctx.query = {
      populate,
      ...ctx.query
    }

    await next();
  };
};
