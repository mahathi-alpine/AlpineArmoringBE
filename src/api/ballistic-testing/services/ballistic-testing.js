'use strict';

/**
 * ballistic-testing service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::ballistic-testing.ballistic-testing');
