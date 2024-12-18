import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: 'strapi_releases';
  info: {
    singularName: 'release';
    pluralName: 'releases';
    displayName: 'Release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    scheduledAt: Attribute.DateTime;
    timezone: Attribute.String;
    status: Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Attribute.Required;
    actions: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Schema.CollectionType {
  collectionName: 'strapi_release_actions';
  info: {
    singularName: 'release-action';
    pluralName: 'release-actions';
    displayName: 'Release Action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
    entry: Attribute.Relation<
      'plugin::content-releases.release-action',
      'morphToOne'
    >;
    contentType: Attribute.String & Attribute.Required;
    locale: Attribute.String;
    release: Attribute.Relation<
      'plugin::content-releases.release-action',
      'manyToOne',
      'plugin::content-releases.release'
    >;
    isEntryValid: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface PluginSitemapSitemap extends Schema.CollectionType {
  collectionName: 'sitemap';
  info: {
    singularName: 'sitemap';
    pluralName: 'sitemaps';
    displayName: 'sitemap';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    sitemap_string: Attribute.Text & Attribute.Required;
    name: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'default'>;
    type: Attribute.Enumeration<['default_hreflang', 'index']> &
      Attribute.DefaultTo<'default_hreflang'>;
    delta: Attribute.Integer & Attribute.DefaultTo<1>;
    link_count: Attribute.Integer;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::sitemap.sitemap',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::sitemap.sitemap',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginSitemapSitemapCache extends Schema.CollectionType {
  collectionName: 'sitemap_cache';
  info: {
    singularName: 'sitemap-cache';
    pluralName: 'sitemap-caches';
    displayName: 'sitemap-cache';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    sitemap_json: Attribute.JSON & Attribute.Required;
    name: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'default'>;
    sitemap_id: Attribute.Integer & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::sitemap.sitemap-cache',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::sitemap.sitemap-cache',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginRedirectsRedirect extends Schema.CollectionType {
  collectionName: 'redirects';
  info: {
    singularName: 'redirect';
    pluralName: 'redirects';
    displayName: 'redirect';
  };
  options: {
    draftAndPublish: false;
    comment: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    from: Attribute.String & Attribute.Required;
    to: Attribute.String & Attribute.Required;
    type: Attribute.Enumeration<['permanent', 'temporary']> &
      Attribute.Required &
      Attribute.DefaultTo<'permanent'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::redirects.redirect',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::redirects.redirect',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 50;
        },
        number
      >;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiAboutAbout extends Schema.SingleType {
  collectionName: 'abouts';
  info: {
    singularName: 'about';
    pluralName: 'abouts';
    displayName: 'About';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    banner: Attribute.Component<'slices.banner'>;
    text: Attribute.RichText;
    seo: Attribute.Component<'shared.seo'>;
    boxes: Attribute.Component<'slices.tab-section', true>;
    certificate1: Attribute.Media;
    certificate2: Attribute.Media;
    timeline1: Attribute.Component<'shared.timeline', true>;
    quote: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::about.about',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::about.about',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiAllDownloadAllDownload extends Schema.SingleType {
  collectionName: 'all_downloads';
  info: {
    singularName: 'all-download';
    pluralName: 'all-downloads';
    displayName: 'AllDownloads';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    banner: Attribute.Component<'slices.banner'>;
    seo: Attribute.Component<'shared.seo'>;
    OEMBrochures2024: Attribute.Media;
    PDFDocuments: Attribute.Media;
    ArmoredVehicles: Attribute.Media;
    stockVideos: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::all-download.all-download',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::all-download.all-download',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiArticleArticle extends Schema.CollectionType {
  collectionName: 'articles';
  info: {
    singularName: 'article';
    pluralName: 'articles';
    displayName: 'Article';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    title: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    slug: Attribute.UID<'api::article.article', 'title'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    thumbnail: Attribute.Media &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    excerpt: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    seo: Attribute.Component<'shared.seo'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    order: Attribute.Integer &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    content: Attribute.RichText &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    region: Attribute.Enumeration<
      [
        'North America',
        'South America',
        'Central America',
        'Europe',
        'Middle East',
        'Africa',
        'Asia',
        'Oceania'
      ]
    > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    type: Attribute.Enumeration<['country', 'state', 'city']> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    flag: Attribute.Media &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::article.article',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::article.article',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    localizations: Attribute.Relation<
      'api::article.article',
      'oneToMany',
      'api::article.article'
    >;
    locale: Attribute.String;
  };
}

export interface ApiAuthorAuthor extends Schema.CollectionType {
  collectionName: 'authors';
  info: {
    singularName: 'author';
    pluralName: 'authors';
    displayName: 'Authors';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Name: Attribute.String;
    linkedinURL: Attribute.Text;
    blogs: Attribute.Relation<
      'api::author.author',
      'oneToMany',
      'api::blog.blog'
    >;
    slug: Attribute.UID<'api::author.author', 'Name'>;
    description: Attribute.RichText;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::author.author',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::author.author',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiBallisticChartBallisticChart extends Schema.SingleType {
  collectionName: 'ballistic_charts';
  info: {
    singularName: 'ballistic-chart';
    pluralName: 'ballistic-charts';
    displayName: 'Ballistic Chart';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    banner: Attribute.Component<'slices.banner'>;
    seo: Attribute.Component<'shared.seo'>;
    BallisticStandards: Attribute.Component<'slices.ballistic-standard', true>;
    bulletPoster: Attribute.Media;
    ammunitionChartPDF: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::ballistic-chart.ballistic-chart',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::ballistic-chart.ballistic-chart',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiBallisticTestingBallisticTesting extends Schema.SingleType {
  collectionName: 'ballistic_testings';
  info: {
    singularName: 'ballistic-testing';
    pluralName: 'ballistic-testings';
    displayName: 'Ballistic Testing';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    banner: Attribute.Component<'slices.banner'>;
    seo: Attribute.Component<'shared.seo'>;
    section1Title: Attribute.Text;
    section2Title: Attribute.Text;
    section3Title: Attribute.Text;
    mainTitle: Attribute.String;
    heading: Attribute.RichText;
    section3Video: Attribute.Relation<
      'api::ballistic-testing.ballistic-testing',
      'oneToMany',
      'api::video.video'
    >;
    section2Armor: Attribute.Component<'slices.tab-section', true>;
    section1Gallery1: Attribute.Media;
    section1Gallery2: Attribute.Media;
    titleGallery1: Attribute.String;
    titleGallery2: Attribute.String;
    certificate1: Attribute.Media;
    certificate2: Attribute.Media;
    section1Gallery12: Attribute.Media;
    section1Gallery22: Attribute.Media;
    linkURL1: Attribute.String;
    linkURL2: Attribute.String;
    section1Heading: Attribute.RichText;
    section2Heading: Attribute.RichText;
    section3Heading: Attribute.RichText;
    section4Title: Attribute.RichText;
    section4Heading: Attribute.RichText;
    flipImage1: Attribute.Media;
    flipImage2: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::ballistic-testing.ballistic-testing',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::ballistic-testing.ballistic-testing',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiBecomeADealerBecomeADealer extends Schema.SingleType {
  collectionName: 'become_a_dealers';
  info: {
    singularName: 'become-a-dealer';
    pluralName: 'become-a-dealers';
    displayName: 'BecomeADealer';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    banner: Attribute.Component<'slices.banner'>;
    text: Attribute.RichText;
    seo: Attribute.Component<'shared.seo'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::become-a-dealer.become-a-dealer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::become-a-dealer.become-a-dealer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiBlogBlog extends Schema.CollectionType {
  collectionName: 'blogs';
  info: {
    singularName: 'blog';
    pluralName: 'blogs';
    displayName: 'Blog';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    title: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    slug: Attribute.UID<'api::blog.blog', 'title'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    thumbnail: Attribute.Media &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    excerpt: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    content: Attribute.RichText &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    categories: Attribute.Relation<
      'api::blog.blog',
      'oneToMany',
      'api::blog-category.blog-category'
    >;
    seo: Attribute.Component<'shared.seo'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    date: Attribute.DateTime &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    order: Attribute.Integer &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    videos: Attribute.Component<'shared.you-tube-video', true> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    authors: Attribute.Relation<
      'api::blog.blog',
      'manyToOne',
      'api::author.author'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::blog.blog', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::blog.blog', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    localizations: Attribute.Relation<
      'api::blog.blog',
      'oneToMany',
      'api::blog.blog'
    >;
    locale: Attribute.String;
  };
}

export interface ApiBlogCategoryBlogCategory extends Schema.CollectionType {
  collectionName: 'blog_categories';
  info: {
    singularName: 'blog-category';
    pluralName: 'blog-categories';
    displayName: 'BlogCategories';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    slug: Attribute.UID<'api::blog-category.blog-category', 'name'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::blog-category.blog-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::blog-category.blog-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiCategoryCategory extends Schema.CollectionType {
  collectionName: 'categories';
  info: {
    singularName: 'category';
    pluralName: 'categories';
    displayName: 'Categories';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String & Attribute.Required & Attribute.Unique;
    image: Attribute.Media;
    slug: Attribute.UID<'api::category.category', 'title'> & Attribute.Required;
    order: Attribute.Integer;
    inventoryBanner: Attribute.Component<'slices.banner'>;
    allBanner: Attribute.Component<'slices.banner'>;
    inventory_vehicles: Attribute.Relation<
      'api::category.category',
      'manyToMany',
      'api::inventory.inventory'
    >;
    seo: Attribute.Component<'shared.seo'>;
    vehicles_we_armors: Attribute.Relation<
      'api::category.category',
      'manyToMany',
      'api::vehicles-we-armor.vehicles-we-armor'
    >;
    bottomText: Attribute.RichText;
    bottomTextInventory: Attribute.RichText;
    heading: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::category.category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::category.category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiContactPageContactPage extends Schema.SingleType {
  collectionName: 'contact_pages';
  info: {
    singularName: 'contact-page';
    pluralName: 'contact-pages';
    displayName: 'Contact Page';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    banner: Attribute.Component<'slices.banner'>;
    salesInfo: Attribute.RichText;
    partsInfo: Attribute.RichText;
    seo: Attribute.Component<'shared.seo'>;
    fa_qs: Attribute.Relation<
      'api::contact-page.contact-page',
      'oneToMany',
      'api::fa-q.fa-q'
    >;
    mapImage: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::contact-page.contact-page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::contact-page.contact-page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiDesignAndEngineeringDesignAndEngineering
  extends Schema.SingleType {
  collectionName: 'design_and_engineerings';
  info: {
    singularName: 'design-and-engineering';
    pluralName: 'design-and-engineerings';
    displayName: 'DesignAndEngineering';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    section1Title: Attribute.Text;
    section1Text: Attribute.RichText;
    section1Image: Attribute.Media;
    section1Text2: Attribute.RichText;
    section2Title: Attribute.Text;
    section2Text: Attribute.RichText;
    section2Image: Attribute.Media;
    section2Text2: Attribute.RichText;
    section2Image2: Attribute.Media;
    banner: Attribute.Component<'slices.banner'>;
    section3Title: Attribute.Text;
    section3Heading: Attribute.RichText;
    section3Text: Attribute.RichText;
    section3Armor: Attribute.Component<'slices.tab-section', true>;
    section4Title: Attribute.Text;
    section4Heading: Attribute.RichText;
    section4Image: Attribute.Media;
    section4Text: Attribute.RichText;
    section5Image: Attribute.Media;
    seo: Attribute.Component<'shared.seo'>;
    section1Image2: Attribute.Media;
    section6Title: Attribute.Text;
    section6Text: Attribute.RichText;
    section6Gallery: Attribute.Media;
    section6Image: Attribute.Media;
    section6Image2: Attribute.Media;
    section6Text2: Attribute.RichText;
    section6Heading: Attribute.RichText;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::design-and-engineering.design-and-engineering',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::design-and-engineering.design-and-engineering',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiEmailEmail extends Schema.CollectionType {
  collectionName: 'emails';
  info: {
    singularName: 'email';
    pluralName: 'emails';
    displayName: 'Emails';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    email: Attribute.Email;
    name: Attribute.Text;
    phoneNumber: Attribute.String;
    mobileNumber: Attribute.String;
    company: Attribute.String;
    inquiry: Attribute.String;
    preferredContact: Attribute.String;
    country: Attribute.String;
    message: Attribute.Text;
    date: Attribute.DateTime;
    route: Attribute.String;
    state: Attribute.String;
    hear: Attribute.String;
    vehicleType: Attribute.String;
    vehicleModel: Attribute.String;
    fromDate: Attribute.Date;
    toDate: Attribute.Date;
    driverNeeded: Attribute.String;
    mileage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::email.email',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::email.email',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiFaQFaQ extends Schema.CollectionType {
  collectionName: 'fa_qs';
  info: {
    singularName: 'fa-q';
    pluralName: 'fa-qs';
    displayName: 'FAQs';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String;
    text: Attribute.RichText;
    order: Attribute.Integer;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::fa-q.fa-q', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::fa-q.fa-q', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiFaQsRentalFaQsRental extends Schema.CollectionType {
  collectionName: 'fa_qs_rentals';
  info: {
    singularName: 'fa-qs-rental';
    pluralName: 'fa-qs-rentals';
    displayName: 'FAQsRentals';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String;
    text: Attribute.RichText;
    order: Attribute.Integer;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::fa-qs-rental.fa-qs-rental',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::fa-qs-rental.fa-qs-rental',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiFaqFaq extends Schema.SingleType {
  collectionName: 'faqs';
  info: {
    singularName: 'faq';
    pluralName: 'faqs';
    displayName: 'FAQ';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    banner: Attribute.Component<'slices.banner'>;
    seo: Attribute.Component<'shared.seo'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::faq.faq', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::faq.faq', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiHomepageHomepage extends Schema.SingleType {
  collectionName: 'homepages';
  info: {
    singularName: 'homepage';
    pluralName: 'homepages';
    displayName: 'Homepage';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tabSection: Attribute.DynamicZone<['slices.tab-section']>;
    allVehiclesImage: Attribute.Media;
    ballistingTestingsMedia: Attribute.DynamicZone<['slices.tab-section']>;
    blogs: Attribute.Relation<
      'api::homepage.homepage',
      'oneToMany',
      'api::blog.blog'
    >;
    quote: Attribute.Component<'slices.text-filling'>;
    hpMiddleText: Attribute.Component<'slices.text-filling'>;
    seo: Attribute.Component<'shared.seo'>;
    topBannerTitle: Attribute.Text;
    topBannerDescription: Attribute.Text;
    disableCoolVideos: Attribute.Boolean;
    bannerVideo: Attribute.Component<'slices.video'>;
    industryPartners: Attribute.Component<'slices.tab-section', true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::homepage.homepage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::homepage.homepage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiInventoryInventory extends Schema.CollectionType {
  collectionName: 'inventories';
  info: {
    singularName: 'inventory';
    pluralName: 'inventories';
    displayName: 'Inventory';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    slug: Attribute.UID<'api::inventory.inventory', 'title'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    featuredImage: Attribute.Media &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    shortDescription: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Attribute.DefaultTo<'This armored vehicle is in stock and available to ship immediately'>;
    VIN: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    vehicleID: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    engine: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    order: Attribute.Integer &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Attribute.DefaultTo<50>;
    gallery: Attribute.Media &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    trans: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    power: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    color_ext: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    color_int: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    trim: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    wheels: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    driveTrain: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    armor_level: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    year: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    specifications: Attribute.Relation<
      'api::inventory.inventory',
      'oneToMany',
      'api::specification.specification'
    >;
    description: Attribute.RichText &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Attribute.Text &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    video: Attribute.Media &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    height: Attribute.Decimal &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    width: Attribute.Decimal &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    length: Attribute.Decimal &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    wheelbase: Attribute.Decimal &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    weight: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    seo: Attribute.Component<'shared.seo'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    flag: Attribute.Enumeration<
      ['sold', 'coming soon', 'pre-owned', 'export only']
    > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    ownPage: Attribute.Boolean &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Attribute.DefaultTo<true>;
    label: Attribute.Boolean &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    categories: Attribute.Relation<
      'api::inventory.inventory',
      'manyToMany',
      'api::category.category'
    >;
    OEMWindowSticker: Attribute.Media &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    OEMArmoringSpecs: Attribute.Media &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    videoMP4: Attribute.Media &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    miles: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    hide: Attribute.Boolean &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    vehicles_we_armor: Attribute.Relation<
      'api::inventory.inventory',
      'manyToMany',
      'api::vehicles-we-armor.vehicles-we-armor'
    >;
    videoURL: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    transparentImage: Attribute.Media &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    rentalsGallery: Attribute.Media &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    rentalsVehicleID: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    rentalsFeaturedImage: Attribute.Media &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    rentalsDescription: Attribute.RichText &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    faqs: Attribute.Component<'slices.accordion', true> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    rentalsShortDescription: Attribute.RichText &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::inventory.inventory',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::inventory.inventory',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    localizations: Attribute.Relation<
      'api::inventory.inventory',
      'oneToMany',
      'api::inventory.inventory'
    >;
    locale: Attribute.String;
  };
}

export interface ApiLandingLanding extends Schema.SingleType {
  collectionName: 'landings';
  info: {
    singularName: 'landing';
    pluralName: 'landings';
    displayName: 'Landing';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    banner: Attribute.Component<'slices.banner'>;
    seo: Attribute.Component<'shared.seo'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::landing.landing',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::landing.landing',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiListInventoryListInventory extends Schema.SingleType {
  collectionName: 'list_inventories';
  info: {
    singularName: 'list-inventory';
    pluralName: 'list-inventories';
    displayName: 'ListInventory';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    banner: Attribute.Component<'slices.banner'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    seo: Attribute.Component<'shared.seo'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    bottomText: Attribute.RichText &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::list-inventory.list-inventory',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::list-inventory.list-inventory',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    localizations: Attribute.Relation<
      'api::list-inventory.list-inventory',
      'oneToMany',
      'api::list-inventory.list-inventory'
    >;
    locale: Attribute.String;
  };
}

export interface ApiListVehiclesWeArmorListVehiclesWeArmor
  extends Schema.SingleType {
  collectionName: 'list_vehicles_we_armors';
  info: {
    singularName: 'list-vehicles-we-armor';
    pluralName: 'list-vehicles-we-armors';
    displayName: 'ListVehiclesWeArmor';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    banner: Attribute.Component<'slices.banner'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    seo: Attribute.Component<'shared.seo'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::list-vehicles-we-armor.list-vehicles-we-armor',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::list-vehicles-we-armor.list-vehicles-we-armor',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    localizations: Attribute.Relation<
      'api::list-vehicles-we-armor.list-vehicles-we-armor',
      'oneToMany',
      'api::list-vehicles-we-armor.list-vehicles-we-armor'
    >;
    locale: Attribute.String;
  };
}

export interface ApiMakeMake extends Schema.CollectionType {
  collectionName: 'makes';
  info: {
    singularName: 'make';
    pluralName: 'makes';
    displayName: 'Makes';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    title: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    slug: Attribute.UID &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    vehicles_we_armors: Attribute.Relation<
      'api::make.make',
      'oneToMany',
      'api::vehicles-we-armor.vehicles-we-armor'
    >;
    order: Attribute.Integer &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::make.make', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::make.make', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    localizations: Attribute.Relation<
      'api::make.make',
      'oneToMany',
      'api::make.make'
    >;
    locale: Attribute.String;
  };
}

export interface ApiManufacturingManufacturing extends Schema.SingleType {
  collectionName: 'manufacturings';
  info: {
    singularName: 'manufacturing';
    pluralName: 'manufacturings';
    displayName: 'Manufacturing';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    section1Image: Attribute.Media;
    section1Text1: Attribute.RichText;
    section1Text2: Attribute.RichText;
    section1Gallery: Attribute.Media;
    banner: Attribute.Component<'slices.banner'>;
    section2Image: Attribute.Media;
    section2Text: Attribute.RichText;
    section2Gallery: Attribute.Media;
    section2Text2: Attribute.RichText;
    section3Text: Attribute.RichText;
    section3Gallery: Attribute.Media;
    section3Text2: Attribute.RichText;
    section3Image: Attribute.Media;
    section3Heading: Attribute.RichText;
    seo: Attribute.Component<'shared.seo'>;
    section1Title: Attribute.Text;
    section2Title: Attribute.Text;
    section2Text3: Attribute.RichText;
    section3Title: Attribute.Text;
    section1Heading: Attribute.RichText;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::manufacturing.manufacturing',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::manufacturing.manufacturing',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiMediaMedia extends Schema.SingleType {
  collectionName: 'medias';
  info: {
    singularName: 'media';
    pluralName: 'medias';
    displayName: 'Media';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    banner: Attribute.Component<'slices.banner'>;
    seo: Attribute.Component<'shared.seo'>;
    blogs: Attribute.Relation<
      'api::media.media',
      'oneToMany',
      'api::blog.blog'
    >;
    videos: Attribute.Relation<
      'api::media.media',
      'oneToMany',
      'api::video.video'
    >;
    tradeShows: Attribute.Relation<
      'api::media.media',
      'oneToMany',
      'api::trade-show.trade-show'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::media.media',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::media.media',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiNewsPageNewsPage extends Schema.SingleType {
  collectionName: 'news_pages';
  info: {
    singularName: 'news-page';
    pluralName: 'news-pages';
    displayName: 'NewsPage';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    banner: Attribute.Component<'slices.banner'>;
    seo: Attribute.Component<'shared.seo'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::news-page.news-page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::news-page.news-page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiPrivacyPolicyPrivacyPolicy extends Schema.SingleType {
  collectionName: 'privacy_policies';
  info: {
    singularName: 'privacy-policy';
    pluralName: 'privacy-policies';
    displayName: 'PrivacyPolicy';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    seo: Attribute.Component<'shared.seo'>;
    text: Attribute.RichText;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::privacy-policy.privacy-policy',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::privacy-policy.privacy-policy',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiRentalPolicyRentalPolicy extends Schema.SingleType {
  collectionName: 'rental_policies';
  info: {
    singularName: 'rental-policy';
    pluralName: 'rental-policies';
    displayName: 'RentalPolicy';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    text: Attribute.RichText;
    seo: Attribute.Component<'shared.seo'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::rental-policy.rental-policy',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::rental-policy.rental-policy',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiRentalsContactPageRentalsContactPage
  extends Schema.SingleType {
  collectionName: 'rentals_contact_pages';
  info: {
    singularName: 'rentals-contact-page';
    pluralName: 'rentals-contact-pages';
    displayName: 'RentalsContactPage';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    banner: Attribute.Component<'slices.banner'>;
    salesInfo: Attribute.RichText;
    seo: Attribute.Component<'shared.seo'>;
    fa_qs: Attribute.Relation<
      'api::rentals-contact-page.rentals-contact-page',
      'oneToMany',
      'api::fa-qs-rental.fa-qs-rental'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::rentals-contact-page.rentals-contact-page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::rentals-contact-page.rentals-contact-page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiRentalsHomepageRentalsHomepage extends Schema.SingleType {
  collectionName: 'rentals_homepages';
  info: {
    singularName: 'rentals-homepage';
    pluralName: 'rentals-homepages';
    displayName: 'RentalsHomepage';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    bannerVideo: Attribute.Component<'slices.video'>;
    topBannerTitle: Attribute.Text;
    topBannerDescription: Attribute.Text;
    quote: Attribute.Component<'slices.text-filling'>;
    featuredRentalVehicles: Attribute.Relation<
      'api::rentals-homepage.rentals-homepage',
      'oneToMany',
      'api::inventory.inventory'
    >;
    seo: Attribute.Component<'shared.seo'>;
    featuredVehiclesTitle: Attribute.Text;
    section1Title: Attribute.Text;
    section1Text: Attribute.RichText;
    section1text2: Attribute.RichText;
    section1List: Attribute.Component<'slices.tab-section', true>;
    section2title: Attribute.Text;
    section2text: Attribute.RichText;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::rentals-homepage.rentals-homepage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::rentals-homepage.rentals-homepage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiRentalsListingRentalsListing extends Schema.SingleType {
  collectionName: 'rentals_listings';
  info: {
    singularName: 'rentals-listing';
    pluralName: 'rentals-listings';
    displayName: 'RentalsListing';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    banner: Attribute.Component<'slices.banner'>;
    seo: Attribute.Component<'shared.seo'>;
    bottomText: Attribute.RichText;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::rentals-listing.rentals-listing',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::rentals-listing.rentals-listing',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiShippingShipping extends Schema.SingleType {
  collectionName: 'shippings';
  info: {
    singularName: 'shipping';
    pluralName: 'shippings';
    displayName: 'Shipping';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    heading: Attribute.RichText;
    banner: Attribute.Component<'slices.banner'>;
    seo: Attribute.Component<'shared.seo'>;
    boxes: Attribute.Component<'slices.tab-section', true>;
    licenseText: Attribute.RichText;
    licenseImage: Attribute.Media;
    licensePDF1: Attribute.Media;
    licensePDF2: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::shipping.shipping',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::shipping.shipping',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiSoldVehicleSoldVehicle extends Schema.SingleType {
  collectionName: 'sold_vehicles';
  info: {
    singularName: 'sold-vehicle';
    pluralName: 'sold-vehicles';
    displayName: 'SoldVehicles';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    banner: Attribute.Component<'slices.banner'>;
    seo: Attribute.Component<'shared.seo'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::sold-vehicle.sold-vehicle',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::sold-vehicle.sold-vehicle',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiSpecificationSpecification extends Schema.CollectionType {
  collectionName: 'specifications';
  info: {
    singularName: 'specification';
    pluralName: 'specifications';
    displayName: 'Specifications';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String;
    image: Attribute.Media;
    displayTitle: Attribute.String;
    category: Attribute.Enumeration<
      [
        'Armoring Features',
        'Conversion Accessories',
        'Communications & Electronics',
        'Other Options'
      ]
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::specification.specification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::specification.specification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiTradeShowTradeShow extends Schema.CollectionType {
  collectionName: 'trade_shows';
  info: {
    singularName: 'trade-show';
    pluralName: 'trade-shows';
    displayName: 'TradeShows';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String;
    category: Attribute.Enumeration<
      ['International Trade Shows', 'USA Trade Shows']
    >;
    description: Attribute.Text;
    gallery: Attribute.Media;
    date: Attribute.Date;
    location: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::trade-show.trade-show',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::trade-show.trade-show',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiTradeShowsPageTradeShowsPage extends Schema.SingleType {
  collectionName: 'trade_shows_pages';
  info: {
    singularName: 'trade-shows-page';
    pluralName: 'trade-shows-pages';
    displayName: 'TradeShowsPage';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    banner: Attribute.Component<'slices.banner'>;
    seo: Attribute.Component<'shared.seo'>;
    titleH1: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::trade-shows-page.trade-shows-page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::trade-shows-page.trade-shows-page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiVehiclesWeArmorVehiclesWeArmor
  extends Schema.CollectionType {
  collectionName: 'vehicles_we_armors';
  info: {
    singularName: 'vehicles-we-armor';
    pluralName: 'vehicles-we-armors';
    displayName: 'VehiclesWeArmor';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    slug: Attribute.UID<'api::vehicles-we-armor.vehicles-we-armor', 'title'> &
      Attribute.Required;
    featuredImage: Attribute.Media;
    category: Attribute.Relation<
      'api::vehicles-we-armor.vehicles-we-armor',
      'manyToMany',
      'api::category.category'
    >;
    make: Attribute.Relation<
      'api::vehicles-we-armor.vehicles-we-armor',
      'manyToOne',
      'api::make.make'
    >;
    beforeAfterSlider: Attribute.Component<'slices.before-after-slider'>;
    description: Attribute.RichText;
    dimensions1: Attribute.Media;
    dimensions2: Attribute.Media;
    gallery: Attribute.Media;
    title: Attribute.Text;
    pdf: Attribute.Media;
    videoUpload: Attribute.Media;
    videoYoutube: Attribute.String;
    descriptionBanner: Attribute.Text;
    protectionLevel: Attribute.String & Attribute.DefaultTo<'A4, A6, A9, A11'>;
    seo: Attribute.Component<'shared.seo'>;
    armoringFeatures: Attribute.Relation<
      'api::vehicles-we-armor.vehicles-we-armor',
      'oneToMany',
      'api::specification.specification'
    >;
    conversionAccessories: Attribute.Relation<
      'api::vehicles-we-armor.vehicles-we-armor',
      'oneToMany',
      'api::specification.specification'
    >;
    communications: Attribute.Relation<
      'api::vehicles-we-armor.vehicles-we-armor',
      'oneToMany',
      'api::specification.specification'
    >;
    otherOptions: Attribute.Relation<
      'api::vehicles-we-armor.vehicles-we-armor',
      'oneToMany',
      'api::specification.specification'
    >;
    videoMP4: Attribute.Media;
    videoURL: Attribute.String;
    stock: Attribute.Relation<
      'api::vehicles-we-armor.vehicles-we-armor',
      'manyToMany',
      'api::inventory.inventory'
    >;
    order: Attribute.Integer & Attribute.DefaultTo<100>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::vehicles-we-armor.vehicles-we-armor',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::vehicles-we-armor.vehicles-we-armor',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiVideoVideo extends Schema.CollectionType {
  collectionName: 'videos';
  info: {
    singularName: 'video';
    pluralName: 'videos';
    displayName: 'Videos';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: Attribute.String;
    URLExternal: Attribute.String;
    media: Attribute.Media;
    location: Attribute.Text;
    order: Attribute.Integer;
    category: Attribute.Relation<
      'api::video.video',
      'oneToOne',
      'api::videos-category.videos-category'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::video.video',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::video.video',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiVideoPageVideoPage extends Schema.SingleType {
  collectionName: 'videos_pages';
  info: {
    singularName: 'video-page';
    pluralName: 'videos-pages';
    displayName: 'VideosPage';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    banner: Attribute.Component<'slices.banner'>;
    seo: Attribute.Component<'shared.seo'>;
    titleH1: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::video-page.video-page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::video-page.video-page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface ApiVideosCategoryVideosCategory extends Schema.CollectionType {
  collectionName: 'videos_categories';
  info: {
    singularName: 'videos-category';
    pluralName: 'videos-categories';
    displayName: 'VideosCategories';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String;
    slug: Attribute.UID<'api::videos-category.videos-category', 'name'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::videos-category.videos-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::videos-category.videos-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    sitemap_exclude: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::sitemap.sitemap': PluginSitemapSitemap;
      'plugin::sitemap.sitemap-cache': PluginSitemapSitemapCache;
      'plugin::redirects.redirect': PluginRedirectsRedirect;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'api::about.about': ApiAboutAbout;
      'api::all-download.all-download': ApiAllDownloadAllDownload;
      'api::article.article': ApiArticleArticle;
      'api::author.author': ApiAuthorAuthor;
      'api::ballistic-chart.ballistic-chart': ApiBallisticChartBallisticChart;
      'api::ballistic-testing.ballistic-testing': ApiBallisticTestingBallisticTesting;
      'api::become-a-dealer.become-a-dealer': ApiBecomeADealerBecomeADealer;
      'api::blog.blog': ApiBlogBlog;
      'api::blog-category.blog-category': ApiBlogCategoryBlogCategory;
      'api::category.category': ApiCategoryCategory;
      'api::contact-page.contact-page': ApiContactPageContactPage;
      'api::design-and-engineering.design-and-engineering': ApiDesignAndEngineeringDesignAndEngineering;
      'api::email.email': ApiEmailEmail;
      'api::fa-q.fa-q': ApiFaQFaQ;
      'api::fa-qs-rental.fa-qs-rental': ApiFaQsRentalFaQsRental;
      'api::faq.faq': ApiFaqFaq;
      'api::homepage.homepage': ApiHomepageHomepage;
      'api::inventory.inventory': ApiInventoryInventory;
      'api::landing.landing': ApiLandingLanding;
      'api::list-inventory.list-inventory': ApiListInventoryListInventory;
      'api::list-vehicles-we-armor.list-vehicles-we-armor': ApiListVehiclesWeArmorListVehiclesWeArmor;
      'api::make.make': ApiMakeMake;
      'api::manufacturing.manufacturing': ApiManufacturingManufacturing;
      'api::media.media': ApiMediaMedia;
      'api::news-page.news-page': ApiNewsPageNewsPage;
      'api::privacy-policy.privacy-policy': ApiPrivacyPolicyPrivacyPolicy;
      'api::rental-policy.rental-policy': ApiRentalPolicyRentalPolicy;
      'api::rentals-contact-page.rentals-contact-page': ApiRentalsContactPageRentalsContactPage;
      'api::rentals-homepage.rentals-homepage': ApiRentalsHomepageRentalsHomepage;
      'api::rentals-listing.rentals-listing': ApiRentalsListingRentalsListing;
      'api::shipping.shipping': ApiShippingShipping;
      'api::sold-vehicle.sold-vehicle': ApiSoldVehicleSoldVehicle;
      'api::specification.specification': ApiSpecificationSpecification;
      'api::trade-show.trade-show': ApiTradeShowTradeShow;
      'api::trade-shows-page.trade-shows-page': ApiTradeShowsPageTradeShowsPage;
      'api::vehicles-we-armor.vehicles-we-armor': ApiVehiclesWeArmorVehiclesWeArmor;
      'api::video.video': ApiVideoVideo;
      'api::video-page.video-page': ApiVideoPageVideoPage;
      'api::videos-category.videos-category': ApiVideosCategoryVideosCategory;
    }
  }
}
