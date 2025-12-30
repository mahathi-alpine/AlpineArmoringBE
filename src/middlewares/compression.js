'use strict';

/**
 * Response Compression Middleware
 *
 * Compresses API responses using gzip/brotli to reduce bandwidth usage
 * and improve performance. Typically reduces JSON responses by 70-90%.
 */

const compress = require('koa-compress');
const { constants } = require('zlib');

module.exports = (config, { strapi }) => {
  return compress({
    // Only compress responses larger than 1KB
    threshold: 1024,

    // Gzip compression settings
    gzip: {
      level: 6, // Balance between speed and compression (1=fastest, 9=best compression)
      flush: constants.Z_SYNC_FLUSH
    },

    // Deflate compression settings (fallback for older browsers)
    deflate: {
      level: 6,
      flush: constants.Z_SYNC_FLUSH
    },

    // Brotli compression (better than gzip, supported by modern browsers)
    br: {
      params: {
        [constants.BROTLI_PARAM_QUALITY]: 4, // 0-11, 4 is good balance for dynamic content
        [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_TEXT
      }
    },

    // Filter function to skip already-compressed content types
    filter: (contentType) => {
      // Compress text-based content types
      const compressibleTypes = [
        'text/',
        'application/json',
        'application/javascript',
        'application/xml'
      ];

      if (compressibleTypes.some(type => contentType.includes(type))) {
        return true;
      }

      // Don't compress images, videos, or already compressed files
      const skipTypes = [
        'image/',
        'video/',
        'audio/',
        'application/pdf',
        'application/zip',
        'application/gzip',
        'application/x-gzip',
        'application/x-bzip2',
        'application/x-7z-compressed'
      ];

      return !skipTypes.some(type => contentType.includes(type));
    }
  });
};
