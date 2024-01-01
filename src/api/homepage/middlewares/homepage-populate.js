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
        fields: ['url']
      }
    }
  },
  tabSection:{
    populate: {
      image: {
        populate: true,
        fields: ['url']
      }
    }
  },
  allVehiclesImage:{
    populate: true,
    fields: ['url']
  },
  industryPartners:{
    populate: true,
    fields: ['url']
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
