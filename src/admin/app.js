import Bell from '@strapi/icons/Bell';

const config = {
  locales: []
};

const bootstrap = (app) => {
  // Reason: Register custom menu link for push notification management pages
  app.addMenuLink({
    to: '/push-notifications',
    icon: Bell,
    intlLabel: {
      id: 'push-notifications.plugin.name',
      defaultMessage: 'Push Notifications'
    },
    Component: async () => {
      const component = await import('./pages/PushNotifications');
      return component;
    },
    permissions: []
  });
};

export default {
  config,
  bootstrap
};
