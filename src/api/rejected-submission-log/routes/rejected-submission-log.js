'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/rejected-submissions/log',
      handler: 'rejected-submission-log.create',
      config: {
        auth: false, // called server-to-server from each site's own /api/contact route
      },
    },
  ],
};
