'use strict';

/**
 * rentals-website service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::rentals-website.rentals-website');
