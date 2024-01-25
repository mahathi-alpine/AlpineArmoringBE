'use strict';

/**
 * `inventory-populate` middleware
 */

const populate = {
  specifications:{
    populate: {
      image: {
        populate: true,
        fields: ['url']
      }
    },
  },
  accessories:{
    populate: {
      image: {
        populate: true,
        fields: ['url']
      }
    },
  },
  gallery:{
    populate: true,
    fields: ['url', 'alternativeText', 'height', 'width', 'formats']
  },
  category:{
    populate: true,
    fields: ['title', 'slug']
  }
};

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In inventory-populate middleware.');

    ctx.query = {
      populate,
      ...ctx.query
    }

    await next();
  };
};
