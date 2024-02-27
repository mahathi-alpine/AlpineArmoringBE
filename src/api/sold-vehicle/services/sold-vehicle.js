'use strict';

/**
 * sold-vehicle service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::sold-vehicle.sold-vehicle');
