'use strict';

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Log vehicles-we-armor and inventories requests
    if (ctx.path.includes('vehicles-we-armor') || ctx.path.includes('vehicles-we-armors') || ctx.path.includes('inventories')) {
      const ip = ctx.request.headers['x-forwarded-for']?.split(',')[0]?.trim()
              || ctx.request.headers['x-real-ip']
              || ctx.request.ip
              || ctx.ip;

      const userAgent = ctx.request.headers['user-agent'] || 'unknown';
      const referer = ctx.request.headers['referer'] || ctx.request.headers['referrer'] || 'none';
      const origin = ctx.request.headers['origin'] || 'none';

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔍 API REQUEST DETECTED (vehicles-we-armor / inventories)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`⏰ Time: ${new Date().toISOString()}`);
      console.log(`🌐 IP: ${ip}`);
      console.log(`🔗 Origin: ${origin}`);
      console.log(`📄 Referer: ${referer}`);
      console.log(`🤖 User-Agent: ${userAgent}`);
      console.log(`📍 Path: ${ctx.path}`);
      console.log(`🔧 Method: ${ctx.method}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }

    await next();
  };
};
