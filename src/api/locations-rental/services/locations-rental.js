'use strict';

/**
 * locations-rental service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::locations-rental.locations-rental');
