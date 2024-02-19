'use strict';

/**
 * trade-show service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::trade-show.trade-show');
