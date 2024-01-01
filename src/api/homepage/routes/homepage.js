'use strict';

/**
 * homepage router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::homepage.homepage', {
    config: {
        find: {
            middlewares: ['api::homepage.homepage-populate']
        }, findOne: {
            middlewares: ['api::homepage.homepage-populate']
        }
    }
});
