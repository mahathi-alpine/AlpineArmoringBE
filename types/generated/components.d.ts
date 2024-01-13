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
  };
}

export interface SlicesTabSection extends Schema.Component {
  collectionName: 'components_slices_tab_sections';
  info: {
    displayName: 'Media';
    description: '';
  };
  attributes: {
    title: Attribute.Text;
    description: Attribute.Text;
    image: Attribute.Media;
    titleNav: Attribute.String;
    subtitle: Attribute.String;
    linkText: Attribute.RichText;
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
