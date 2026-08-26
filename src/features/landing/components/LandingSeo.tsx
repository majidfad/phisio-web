import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { LANDING_SITE } from '@/features/landing/landing-content';

type LandingSeoProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    if (hreflang) el.hreflang = hreflang;
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertJsonLd(id: string, data: Record<string, unknown> | Record<string, unknown>[]) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/** Sets document title, social meta, canonical, and JSON-LD for marketing pages. */
export function LandingSeo({
  title,
  description,
  path = '/',
  image = LANDING_SITE.defaultOgImage,
  type = 'website',
  jsonLd,
}: LandingSeoProps) {
  const { i18n } = useTranslation();
  const isFa = i18n.language.startsWith('fa');
  const url = `${LANDING_SITE.origin}${path === '/' ? '' : path}`;

  useEffect(() => {
    document.title = title;
    document.documentElement.lang = isFa ? 'fa' : 'en';
    document.documentElement.dir = isFa ? 'rtl' : 'ltr';

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', 'index,follow,max-image-preview:large');
    upsertMeta('name', 'author', LANDING_SITE.name);
    upsertMeta('name', 'theme-color', '#0b1220');

    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:site_name', LANDING_SITE.name);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:locale', isFa ? LANDING_SITE.localeFa : LANDING_SITE.localeEn);
    upsertMeta(
      'property',
      'og:locale:alternate',
      isFa ? LANDING_SITE.localeEn : LANDING_SITE.localeFa,
    );

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);

    upsertLink('canonical', url);
    upsertLink('alternate', `${LANDING_SITE.origin}${path === '/' ? '' : path}`, 'fa');
    upsertLink('alternate', `${LANDING_SITE.origin}${path === '/' ? '' : path}`, 'en');
    upsertLink('alternate', url, 'x-default');

    if (jsonLd) {
      upsertJsonLd('landing-jsonld', jsonLd);
    }

    return () => {
      document.getElementById('landing-jsonld')?.remove();
    };
  }, [title, description, path, image, type, jsonLd, isFa, url]);

  return null;
}
