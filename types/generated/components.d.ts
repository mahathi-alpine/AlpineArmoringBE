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

export interface SlicesTabSection extends Schema.Component {
  collectionName: 'components_slices_tab_sections';
  info: {
    displayName: 'Media';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text & Attribute.Required;
    image: Attribute.Media & Attribute.Required;
    titleNav: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'slices.homepage-top-banner': SlicesHomepageTopBanner;
      'slices.tab-section': SlicesTabSection;
    }
  }
}
