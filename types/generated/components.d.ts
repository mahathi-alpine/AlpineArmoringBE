import type { Schema, Attribute } from '@strapi/strapi';

export interface SharedMetaSocial extends Schema.Component {
  collectionName: 'components_shared_meta_socials';
  info: {
    displayName: 'metaSocial';
    icon: 'project-diagram';
  };
  attributes: {
    socialNetwork: Attribute.Enumeration<['Facebook', 'Twitter']> &
      Attribute.Required;
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    description: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 65;
      }>;
    image: Attribute.Media;
  };
}

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'search';
    description: '';
  };
  attributes: {
    metaTitle: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaDescription: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 50;
        maxLength: 160;
      }>;
    metaImage: Attribute.Media;
    metaSocial: Attribute.Component<'shared.meta-social', true>;
    keywords: Attribute.Text;
    metaRobots: Attribute.String;
    structuredData: Attribute.JSON;
    metaViewport: Attribute.String;
    canonicalURL: Attribute.String;
  };
}

export interface SlicesBanner extends Schema.Component {
  collectionName: 'components_slices_banners';
  info: {
    displayName: 'Banner';
    description: '';
  };
  attributes: {
    title: Attribute.Text;
    media: Attribute.Media;
    description: Attribute.Text;
    mediaMP4: Attribute.Media;
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
    linkText: Attribute.Text;
    linkURL: Attribute.String;
  };
}

export interface SlicesTextFilling extends Schema.Component {
  collectionName: 'components_slices_text_fillings';
  info: {
    displayName: 'TextFilling';
  };
  attributes: {
    text: Attribute.Text;
    title: Attribute.String;
  };
}

export interface SlicesVideo extends Schema.Component {
  collectionName: 'components_slices_videos';
  info: {
    displayName: 'video';
    icon: 'play';
  };
  attributes: {
    video_webm: Attribute.Media;
    video_mp4: Attribute.Media;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'shared.meta-social': SharedMetaSocial;
      'shared.seo': SharedSeo;
      'slices.banner': SlicesBanner;
      'slices.before-after-slider': SlicesBeforeAfterSlider;
      'slices.tab-section': SlicesTabSection;
      'slices.text-filling': SlicesTextFilling;
      'slices.video': SlicesVideo;
    }
  }
}
