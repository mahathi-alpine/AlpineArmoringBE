import type { Schema, Attribute } from '@strapi/strapi';

export interface SlicesHomepageTopBanner extends Schema.Component {
  collectionName: 'components_slices_homepage_top_banners';
  info: {
    displayName: 'Homepage Top Banner';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    subtitle: Attribute.String;
    media: Attribute.Media & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'slices.homepage-top-banner': SlicesHomepageTopBanner;
    }
  }
}
