# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is Alpine Armoring's backend - a Strapi v4.23.1 CMS application managing content for armored vehicles company. Uses PostgreSQL database and serves multiple frontend applications (main site, rentals, SWAT divisions).

## Development Commands
- `yarn run dev` - Start development server (Strapi develop mode)
- `yarn start` - Start production server 
- `yarn build` - Build the application
- `strapi` - Direct Strapi CLI access

## Database Setup
Uses PostgreSQL with connection configured via environment variables:
- DATABASE_HOST, DATABASE_PORT, DATABASE_NAME
- DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_SCHEMA
- Environment file template available in .env.example
- MCP postgres connection available for this project

## Architecture

### Content Types Structure
The API contains extensive content types organized by business function:
- **Core Business**: homepage, about, contact-page, locations-we-serve-page
- **Vehicle Content**: vehicles-we-armor, list-vehicles-we-armor, inventory, sold-vehicle, specification, make
- **Rentals Division**: rentals-homepage, rentals-contact-page, rentals-listing, rentals-locations-page, locations-rental
- **SWAT Division**: swat-homepage, swat-contact-page, swat-listing-inventory, swat-listing-model, swat-about
- **Pitbull Division**: pitbull-homepage, pitbull-contact, pitbull-about  
- **Content Management**: blog, blog-evergreen, blog-page, article, news-page, media, video, video-page
- **Knowledge/Support**: knowledge-base, knowledge-base-category, faq, fa-q, fa-qs-rental, fa-qs-swat

### Key Plugins Configuration
- **Translation**: DeepL integration for EN-US/ES localization
- **File Upload**: AWS S3 + CloudFront CDN with image breakpoints (thumbnail: 500px, medium: 750px, large: 1300px, xlarge: 2200px)
- **SEO**: Strapi SEO plugin enabled
- **Email**: Amazon SES provider
- **Additional**: Excel export, populate deep, redirects, drag-drop content types

### Code Standards
- ESLint configured with babel-eslint parser
- 2-space indentation, single quotes, semicolons required
- Unix line endings enforced
- `strapi` global available in all contexts

## Initial Setup Process
1. Clone repository
2. Run `yarn install`
3. Install PostgreSQL locally
4. Copy .env.example to .env and configure DATABASE_* variables
5. Import production/staging database for content
6. Run `yarn run dev`


### Testing & Reliability
- **Always do eslint tests after any code changes**

### 📚 Documentation & Explainability
- **Comment non-obvious code** and ensure everything is understandable to a mid-level developer.
- When writing complex logic, **add an inline `# Reason:` comment** explaining the why, not just the what.
- Prefer arrow functions
- Annotate return types
- Always destructure props
- Avoid any type, use unknown or strict generics
- Group imports: react → next → libraries → local

### 🧠 AI Behavior Rules
- **Never assume missing context. Ask questions if uncertain.**
- **Never hallucinate libraries or functions** – only use known, verified javascript packages.
- **Always confirm file paths and module names** exist before referencing them in code or tests.
- Use the context7 MCP to fetch up to date documentation that is not available in hex docs, like Strapi docs
- walk me through your thought process step by step
- before you get started, ask me for any information you need to do a good job
- in git commit, never mention AI or Claude
- Don't remove comments and console.logs that I already had in the script
