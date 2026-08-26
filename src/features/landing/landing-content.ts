import { env } from '@/constants/env';

const landingOrigin = env.landingOrigin.replace(/\/$/, '');

export const LANDING_SITE = {
  origin: landingOrigin,
  name: 'Zivan',
  nameFa: 'زیوان',
  defaultOgImage: `${landingOrigin}/brand/landing/hero-lg.jpg`,
  localeFa: 'fa_IR',
  localeEn: 'en_US',
} as const;

export const LANDING_CONTACT = {
  email: 'info@zivan.me',
  phoneDisplayFa: '۰۲۱ ۲۸۴۲ ۴۷۷۱',
  phoneDisplayEn: '021 2842 4771',
  phoneTel: '+982128424771',
} as const;

export const LANDING_STORES = {
  cafeBazaarLogo: '/brand/stores/cafe-bazaar-light.png',
  sibAppLogo: '/brand/stores/sib-app-light.png',
} as const;

export const LANDING_FOUNDERS = [
  {
    id: 'majid',
    imageSrc: '/brand/founders/majid-fadavi.jpg',
    linkedInUrl: 'https://www.linkedin.com/in/majid-fadavi-ardestani/',
    nameKey: 'landing.founders.majid.name',
    roleKey: 'landing.founders.majid.role',
    shortBioKey: 'landing.founders.majid.shortBio',
    bioKey: 'landing.founders.majid.bio',
  },
  {
    id: 'mahboube',
    imageSrc: '/brand/founders/mahboube-rahmani.jpg',
    linkedInUrl: 'https://www.linkedin.com/in/mahbouberahmanii/',
    nameKey: 'landing.founders.mahboube.name',
    roleKey: 'landing.founders.mahboube.role',
    shortBioKey: 'landing.founders.mahboube.shortBio',
    bioKey: 'landing.founders.mahboube.bio',
  },
] as const;
