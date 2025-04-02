'use strict';

/**
 * `inventory-populate` middleware
 */

const populate = {
  seo:{
    populate: {
      metaImage: {
        populate: {
          image: {
            populate: true
          }
        },
      },
      metaSocial: {
        populate: {
          image: {
            populate: true
          }
        },
      }
    }
  },
  localizations:{
    populate: true
  },
  gallery:{
    populate: true
  },
  rentalsGallery:{
    populate: true
  },
  video:{
    populate: true,
    // fields: ['url', 'mime']
  },
  videoMP4:{
    populate: true,
    // fields: ['url', 'mime']
  },
  categories:{
    populate: true,
    fields: ['title', 'slug']
  },
  faqs:{
    populate: true
  },
  featuredImage:{
    populate: true
  },
  rentalsFeaturedImage:{
    populate: true
  },  
  transparentImage:{
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
