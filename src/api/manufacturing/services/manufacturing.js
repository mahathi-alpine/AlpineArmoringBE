'use strict';

/**
 * manufacturing service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::manufacturing.manufacturing');
