'use strict';

const fs = require('fs');
const path = require('path');

// Deliberately outside /var/www/html/alpine (the CodeDeploy destination) so a fresh
// deploy never touches it — same convention already used for /home/ubuntu/logs/strapi.log.
const LOG_DIR = process.env.REJECTED_SUBMISSIONS_LOG_DIR || '/home/ubuntu/logs';
const LOG_FILE = path.join(LOG_DIR, 'rejected-contact-submissions.log');

module.exports = {
  create: async (ctx) => {
    const { data } = ctx.request.body || {};
    if (!data) {
      ctx.status = 400;
      ctx.body = { error: 'Missing data' };
      return;
    }

    // One JSON object per line (JSONL) — append-only, greppable, and nothing here
    // is ever read back by the app, so a slow/full disk just fails the write below
    // rather than affecting form submissions.
    const line = JSON.stringify({ ...data, loggedAt: new Date().toISOString() }) + '\n';

    try {
      await fs.promises.mkdir(LOG_DIR, { recursive: true });
      await fs.promises.appendFile(LOG_FILE, line, 'utf8');
    } catch (error) {
      strapi.log.error('rejected-submission-log error:', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to write log' };
      return;
    }

    ctx.body = { success: true };
  },
};
