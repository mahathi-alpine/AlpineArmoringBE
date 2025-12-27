'use strict';

/**
 * vehicles-we-armor router - TEMPORARILY DISABLED
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

// BLOCKED: Uncomment to re-enable
/*
module.exports = createCoreRouter('api::vehicles-we-armor.vehicles-we-armor', {
    config: {
        find: {
            middlewares: ['api::vehicles-we-armor.vehicles-we-armor-populate']
        }, findOne: {
            middlewares: ['api::vehicles-we-armor.vehicles-we-armor-populate']
        }
    }
});
*/

// Return empty router to disable endpoint
module.exports = {
  routes: []
};

