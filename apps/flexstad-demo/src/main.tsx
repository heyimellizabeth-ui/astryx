// Copyright (c) Meta Platforms, Inc. and affiliates.

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import '@astryxdesign/core/reset.css';
import '@astryxdesign/theme-neutral/theme.css';
import './index.css';
import './variantWit.css';
import App from './App';
import {SITE_VARIANT, type SiteVariant} from './siteVariant';

// The variant is a data attribute, so variantWit.css does nothing unless it is 'wit'.
const override = new URLSearchParams(location.search).get('variant');
const variant: SiteVariant =
  override === 'wit' || override === 'huidig' ? override : SITE_VARIANT;
document.documentElement.dataset.variant = variant;

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- root element must exist in index.html
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
