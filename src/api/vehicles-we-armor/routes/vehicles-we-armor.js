'use strict';

/**
 * vehicles-we-armor router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

// module.exports = createCoreRouter('api::vehicles-we-armor.vehicles-we-armor', {
//     config: {
//         find: {
//             middlewares: ['api::vehicles-we-armor.vehicles-we-armor-populate']
//         }, findOne: {
//             middlewares: ['api::vehicles-we-armor.vehicles-we-armor-populate']
//         }
//     }
// });

module.exports = createCoreRouter('api::vehicles-we-armor.vehicles-we-armor');
