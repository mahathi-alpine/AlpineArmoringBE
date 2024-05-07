'use strict';

/**
 * `inventory-populate` middleware
 */

const populate = {
  seo:{
    metaImage: {
      populate: true,
      fields: ['url']
    },
    metaSocial: {
      image: {
        populate: true,
        fields: ['url']
      },
    }
  },
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
    fields: ['url', 'mime']
  },
  videoMP4:{
    populate: true,
    fields: ['url', 'mime']
  },
  categories:{
    populate: true,
    fields: ['title', 'slug']
  },
  featuredImage:{
    populate: true
  },
  OEMWindowSticker:{
    populate: true,
    fields: ['url', 'isUrlSigned', 'provider', 'createdAt', 'ext', 'hash',  'mime', 'name', 'updatedAt', 'provider_metadata']
  },
  OEMArmoringSpecs:{
    populate: true,
    fields: ['url', 'isUrlSigned', 'provider', 'createdAt', 'ext', 'hash',  'mime', 'name', 'updatedAt', 'provider_metadata']
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
