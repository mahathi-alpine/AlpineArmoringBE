'use strict';

const fs = require('fs');
const path = require('path');

// Deliberately outside /var/www/html/alpine (the CodeDeploy destination) so a fresh
// deploy never touches it — same convention already used for /home/ubuntu/logs/strapi.log.
const LOG_DIR = process.env.REJECTED_SUBMISSIONS_LOG_DIR || '/home/ubuntu/logs';
const LOG_FILE = path.join(LOG_DIR, 'rejected-contact-submissions.log');

// Created at most once per process instead of on every request. Cached as a promise
// so concurrent early requests await the same mkdir rather than racing separate ones;
// cleared on failure so a transient issue (e.g. disk momentarily unavailable) doesn't
// permanently wedge every later request behind one cached rejection.
let dirReady = null;
const ensureLogDir = () => {
  if (!dirReady) {
    dirReady = fs.promises.mkdir(LOG_DIR, { recursive: true }).catch((error) => {
      dirReady = null;
      throw error;
    });
  }
  return dirReady;
};

module.exports = {
  create: async (ctx) => {
    const { data } = ctx.request.body || {};
    if (!data) {
      return ctx.badRequest('Missing data');
    }

    // One JSON object per line (JSONL) — append-only, greppable, and nothing here
    // is ever read back by the app, so a slow/full disk just fails the write below
    // rather than affecting form submissions.
    const line = JSON.stringify({ ...data, loggedAt: new Date().toISOString() }) + '\n';

    try {
      await ensureLogDir();
      await fs.promises.appendFile(LOG_FILE, line, 'utf8');
    } catch (error) {
      strapi.log.error('rejected-submission-log error:', error);
      return ctx.internalServerError('Failed to write log');
    }

    ctx.body = { success: true };
  },
};
