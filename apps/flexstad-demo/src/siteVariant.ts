// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * Which look the site ships with.
 *
 *   'huidig' the earlier aubergine and orange design
 *   'wit'    white page and pale bands, same layout (src/variantWit.css) (default)
 *
 * To switch after the client decides, change this one value. Add
 * ?variant=wit or ?variant=huidig to any URL to compare both side by side;
 * remove that override and the losing variant once the choice is made.
 */
export type SiteVariant = 'huidig' | 'wit';

export const SITE_VARIANT: SiteVariant = 'wit';
