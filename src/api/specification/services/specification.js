'use strict';

/**
 * specification service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::specification.specification');
