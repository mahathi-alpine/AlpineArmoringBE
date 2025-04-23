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
        maxLength: 200;
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
        maxLength: 200;
      }>;
    metaDescription: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 50;
        maxLength: 500;
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

export interface SharedTestimonials extends Schema.Component {
  collectionName: 'components_shared_testimonials';
  info: {
    displayName: 'Testimonials';
    description: '';
  };
  attributes: {
    title: Attribute.Text;
    testimonials: Attribute.Component<'slices.tab-section', true>;
  };
}

export interface SharedTimeline extends Schema.Component {
  collectionName: 'components_shared_timelines';
  info: {
    displayName: 'timeline';
    description: '';
  };
  attributes: {
    year: Attribute.Text;
    image: Attribute.Media;
    Caption: Attribute.Text;
  };
}

export interface SharedYouTubeVideo extends Schema.Component {
  collectionName: 'components_shared_you_tube_videos';
  info: {
    displayName: 'YouTubeVideo';
  };
  attributes: {
    videoLink: Attribute.String;
    text: Attribute.String;
  };
}

export interface SlicesAccordion extends Schema.Component {
  collectionName: 'components_slices_accordions';
  info: {
    displayName: 'Accordion';
  };
  attributes: {
    title: Attribute.String;
    text: Attribute.RichText;
  };
}

export interface SlicesBallisticStandard extends Schema.Component {
  collectionName: 'components_slices_ballistic_standards';
  info: {
    displayName: 'Ballistic Standard';
  };
  attributes: {
    label: Attribute.String;
    name: Attribute.String;
    text2: Attribute.String;
    pdf: Attribute.Media;
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
    mediaMP4: Attribute.Media;
    imageMobile: Attribute.Media;
    subtitle: Attribute.Text;
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

export interface SlicesMediaPasswordProtected extends Schema.Component {
  collectionName: 'components_slices_media_password_protecteds';
  info: {
    displayName: 'MediaPasswordProtected';
    icon: 'key';
  };
  attributes: {
    media: Attribute.Media;
    password: Attribute.String;
    text: Attribute.Text;
  };
}

export interface SlicesSingleMedia extends Schema.Component {
  collectionName: 'components_slices_single_medias';
  info: {
    displayName: 'SingleMedia';
    description: '';
  };
  attributes: {
    media: Attribute.Media;
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
    image: Attribute.Media;
    titleNav: Attribute.String;
    subtitle: Attribute.String;
    linkText: Attribute.Text;
    linkURL: Attribute.String;
    description: Attribute.RichText;
  };
}

export interface SlicesTextFilling extends Schema.Component {
  collectionName: 'components_slices_text_fillings';
  info: {
    displayName: 'TextFilling';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    text: Attribute.RichText;
  };
}

export interface SlicesText extends Schema.Component {
  collectionName: 'components_slices_texts';
  info: {
    displayName: 'Text';
  };
  attributes: {
    Content: Attribute.RichText;
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

export interface SlicesVideosSlider extends Schema.Component {
  collectionName: 'components_slices_videos_sliders';
  info: {
    displayName: 'VideosSlider';
  };
  attributes: {
    videos: Attribute.Relation<
      'slices.videos-slider',
      'oneToMany',
      'api::video.video'
    >;
  };
}

export interface SlicesYoutubeVideo extends Schema.Component {
  collectionName: 'components_slices_youtube_videos';
  info: {
    displayName: 'youtubeVideo';
  };
  attributes: {
    url: Attribute.Text &
      Attribute.SetPluginOptions<{
        translate: {
          translate: 'copy';
        };
      }>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'shared.meta-social': SharedMetaSocial;
      'shared.seo': SharedSeo;
      'shared.testimonials': SharedTestimonials;
      'shared.timeline': SharedTimeline;
      'shared.you-tube-video': SharedYouTubeVideo;
      'slices.accordion': SlicesAccordion;
      'slices.ballistic-standard': SlicesBallisticStandard;
      'slices.banner': SlicesBanner;
      'slices.before-after-slider': SlicesBeforeAfterSlider;
      'slices.media-password-protected': SlicesMediaPasswordProtected;
      'slices.single-media': SlicesSingleMedia;
      'slices.tab-section': SlicesTabSection;
      'slices.text-filling': SlicesTextFilling;
      'slices.text': SlicesText;
      'slices.video': SlicesVideo;
      'slices.videos-slider': SlicesVideosSlider;
      'slices.youtube-video': SlicesYoutubeVideo;
    }
  }
}
