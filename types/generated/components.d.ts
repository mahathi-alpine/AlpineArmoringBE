import type { Schema, Attribute } from '@strapi/strapi';

export interface SlicesBanner extends Schema.Component {
  collectionName: 'components_slices_banners';
  info: {
    displayName: 'Banner';
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.RichText;
    media: Attribute.Media;
  };
}

export interface SlicesBeforeAfterSlider extends Schema.Component {
  collectionName: 'components_slices_before_after_sliders';
  info: {
    displayName: 'Before/After Slider';
  };
  attributes: {
    before: Attribute.Media;
    after: Attribute.Media;
  };
}

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
      'slices.banner': SlicesBanner;
      'slices.before-after-slider': SlicesBeforeAfterSlider;
      'slices.homepage-top-banner': SlicesHomepageTopBanner;
      'slices.tab-section': SlicesTabSection;
    }
  }
}
