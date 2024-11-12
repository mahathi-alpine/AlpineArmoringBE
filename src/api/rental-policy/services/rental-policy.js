'use strict';

/**
 * rental-policy service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::rental-policy.rental-policy');
