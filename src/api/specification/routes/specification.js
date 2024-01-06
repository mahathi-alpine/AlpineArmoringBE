'use strict';

/**
 * specification router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::specification.specification');
