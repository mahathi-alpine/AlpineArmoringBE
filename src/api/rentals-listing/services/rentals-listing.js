'use strict';

/**
 * rentals-listing service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::rentals-listing.rentals-listing');
