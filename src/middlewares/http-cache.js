'use strict';

/**
 * HTTP Cache Middleware
 *
 * Adds Cache-Control headers to API responses to optimize CDN caching.
 * Since Vercel rebuilds on every content change via webhook, we can use
 * aggressive cache times (24 hours) without serving stale content.
 *
 * Cache strategy:
 * - Public API content: 24h cache (safe because webhook rebuilds handle freshness)
 * - Admin panel: No caching
 * - Webhooks: No caching
 * - Authenticated requests: No caching
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    await next();

    // Skip caching for non-successful responses
    if (ctx.status < 200 || ctx.status >= 300) {
      return;
    }

    // Skip caching for admin panel
    if (ctx.path.startsWith('/admin')) {
      ctx.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      return;
    }

    // Skip caching for webhooks
    if (ctx.path.includes('/webhook') || ctx.path.startsWith('/api/webhooks')) {
      ctx.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      return;
    }

    // Skip caching for authenticated requests
    const isAuthenticated = ctx.state.user || ctx.request.headers.authorization;
    if (isAuthenticated) {
      ctx.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      return;
    }

    // Skip caching for mutations (POST, PUT, PATCH, DELETE)
    if (ctx.method !== 'GET' && ctx.method !== 'HEAD') {
      ctx.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      return;
    }

    // Content-type specific caching strategies
    const cacheConfig = getCacheConfigForPath(ctx.path);

    // Set cache headers
    ctx.set('Cache-Control', `public, max-age=${cacheConfig.maxAge}, s-maxage=${cacheConfig.sMaxAge}${cacheConfig.immutable ? ', immutable' : ''}`);

    // Add Vary header to ensure proper caching by locale/origin
    ctx.set('Vary', 'Accept-Encoding, Origin');
  };
};

/**
 * Get cache configuration based on API path
 *
 * Reason: Different content types have different update frequencies.
 * Since webhook rebuilds happen on every change, we can be aggressive
 * with cache times. Vercel will fetch fresh data during rebuilds.
 */
const getCacheConfigForPath = (path) => {
  // Homepage data - cache for 24 hours
  if (path.includes('/api/homepage')) {
    return {
      maxAge: 86400,      // 24 hours
      sMaxAge: 86400,     // 24 hours for CDN
      immutable: false
    };
  }

  // Blog posts and news - cache for 12 hours
  // (slightly shorter in case of urgent updates/corrections)
  if (path.includes('/api/blog') || path.includes('/api/article') || path.includes('/api/news')) {
    return {
      maxAge: 43200,      // 12 hours
      sMaxAge: 43200,     // 12 hours for CDN
      immutable: false
    };
  }

  // Vehicles, inventory, specifications - cache for 24 hours
  if (path.includes('/api/vehicles-we-armor') ||
      path.includes('/api/list-vehicles-we-armor') ||
      path.includes('/api/inventories') ||
      path.includes('/api/sold-vehicles') ||
      path.includes('/api/specifications') ||
      path.includes('/api/makes')) {
    return {
      maxAge: 86400,      // 24 hours
      sMaxAge: 86400,     // 24 hours for CDN
      immutable: false
    };
  }

  // Rentals content - cache for 24 hours
  if (path.includes('/api/rentals-') || path.includes('/api/locations-rental')) {
    return {
      maxAge: 86400,      // 24 hours
      sMaxAge: 86400,     // 24 hours for CDN
      immutable: false
    };
  }

  // SWAT content - cache for 24 hours
  if (path.includes('/api/swat-')) {
    return {
      maxAge: 86400,      // 24 hours
      sMaxAge: 86400,     // 24 hours for CDN
      immutable: false
    };
  }

  // Pitbull content - cache for 24 hours
  if (path.includes('/api/pitbull-')) {
    return {
      maxAge: 86400,      // 24 hours
      sMaxAge: 86400,     // 24 hours for CDN
      immutable: false
    };
  }

  // Static pages (about, contact, FAQs, etc.) - cache for 24 hours
  if (path.includes('/api/about') ||
      path.includes('/api/contact-page') ||
      path.includes('/api/faq') ||
      path.includes('/api/knowledge-base') ||
      path.includes('/api/locations-we-serve') ||
      path.includes('/api/media') ||
      path.includes('/api/video')) {
    return {
      maxAge: 86400,      // 24 hours
      sMaxAge: 86400,     // 24 hours for CDN
      immutable: false
    };
  }

  // Default caching for all other API routes
  return {
    maxAge: 43200,        // 12 hours
    sMaxAge: 43200,       // 12 hours for CDN
    immutable: false
  };
};
