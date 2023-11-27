'use strict';

/**
 * work controller
 */
const { sanitize } = require('@strapi/utils');
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::category.category', ({ strapi }) => ({
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const query = {
      filters: { slug },
      ...ctx.query,
    };

    const post = await strapi.entityService.findMany('api::category.category', query);
    const schema = strapi.getModel('api::category.category');
    const sanitizedEntity = await sanitize.contentAPI.output(post, schema);
    
    return this.transformResponse(sanitizedEntity[0]);
  },
}));