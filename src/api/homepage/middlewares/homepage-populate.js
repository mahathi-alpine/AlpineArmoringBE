'use strict';

/**
 * `homepage-populate` middleware
 */

const populate = {
  topBanner:{
    populate: true
  },
  horizontalSlider:{
    populate: {
      image: {
        populate: true,
        fields: ['url', 'formats']
      }
    }
  },
  tabSection:{
    populate: {
      image: {
        populate: true,
        fields: ['url', 'alternativeText']
      }
    }
  },
  allVehiclesImage:{
    populate: true,
    fields: ['url']
  },
  quote:{
    populate: true
  },
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
  hpMiddleText:{
    populate: true
  },
  industryPartners:{
    populate: true,
    fields: ['url', 'alternativeText', 'width', 'height', 'formats']
  },
  blogs:{
    populate: {
      thumbnail: {
        populate: true,
        fields: ['url', 'alternativeText', 'width', 'height', 'formats']
      },    
      categories: {
        populate: true
      }
    }
  },
  ballistingTestingsMedia:{
    populate: {
      image: {
        populate: true,
        fields: ['formats', 'url', 'mime', 'alternativeText', 'width', 'height', 'previewUrl']
      }
    }
  }
};

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In homepage-populate middleware.');
    
    ctx.query = {
      populate,
      ...ctx.query
    }

    await next();
  };
};
