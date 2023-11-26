'use strict';

/**
 * inventory-vehicle service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::inventory-vehicle.inventory-vehicle');
