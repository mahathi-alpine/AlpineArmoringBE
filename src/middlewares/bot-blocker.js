module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const ip = ctx.request.headers['x-forwarded-for']?.split(',')[0]?.trim()
            || ctx.request.headers['x-real-ip']
            || ctx.request.ip
            || ctx.ip;

    const userAgent = ctx.request.headers['user-agent'] || '';

    // Blocked IP ranges - ONLY these will be blocked
    const blockedIPRanges = [
      '43.173.',      // Tencent Cloud Singapore
      '43.134.',      // Tencent Cloud
      '43.135.',      // Tencent Cloud
      '43.136.',      // Tencent Cloud
      '43.137.',      // Tencent Cloud
      '43.138.',      // Tencent Cloud
      '43.139.',      // Tencent Cloud
      '43.140.',      // Tencent Cloud
      '43.141.',      // Tencent Cloud
      '43.142.',      // Tencent Cloud
      '43.143.',      // Tencent Cloud
      '129.226',
      '101.32',
      '170.106',
      '150.109'
    ];

    const isBlockedIP = blockedIPRanges.some(range => ip.startsWith(range));

    if (isBlockedIP) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🚫 BOT BLOCKED');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`⏰ Time: ${new Date().toISOString()}`);
      console.log(`🌐 IP: ${ip}`);
      console.log(`🤖 User-Agent: ${userAgent}`);
      console.log(`📍 Path: ${ctx.path}`);
      console.log(`🔧 Method: ${ctx.method}`);
      console.log(`🔗 Referer: ${ctx.request.headers['referer'] || 'none'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      // Return 404 instead of 403 to hide the fact we're blocking
      ctx.status = 404;
      ctx.body = {
        data: null,
        error: {
          status: 404,
          name: 'NotFoundError',
          message: 'Not Found',
        },
      };
      return;
    }

    await next();
  };
};
