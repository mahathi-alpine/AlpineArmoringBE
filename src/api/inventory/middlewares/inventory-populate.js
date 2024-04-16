'use strict';

/**
 * `inventory-populate` middleware
 */

const populate = {
  specifications:{
    populate: {
      image: {
        populate: true
      }
    },
  },
  accessories:{
    populate: {
      image: {
        populate: true
      }
    },
  },
  gallery:{
    populate: true
  },
  video:{
    populate: true,
    fields: ['url']
  },
  categories:{
    populate: true,
    fields: ['title', 'slug']
  },
  featuredImage:{
    populate: true
  },
  OEMWindowSticker:{
    populate: true
  },
  OEMArmoringSpecs:{
    populate: true
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
