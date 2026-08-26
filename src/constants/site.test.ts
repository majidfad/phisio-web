import { describe, expect, it } from 'vitest';

import { appUrl, getSiteMode, isAppPath, isMarketingPath, landingUrl } from '@/constants/site';

describe('site host helpers', () => {
  it('treats loopback hosts as combined (local Docker / Vite)', () => {
    expect(getSiteMode('localhost')).toBe('combined');
    expect(getSiteMode('127.0.0.1')).toBe('combined');
  });

  it('detects landing and app production hosts', () => {
    expect(getSiteMode('zivan.me')).toBe('landing');
    expect(getSiteMode('www.zivan.me')).toBe('landing');
    expect(getSiteMode('app.zivan.me')).toBe('app');
  });

  it('classifies marketing vs app paths', () => {
    expect(isMarketingPath('/')).toBe(true);
    expect(isMarketingPath('/about')).toBe(true);
    expect(isAppPath('/login')).toBe(true);
    expect(isAppPath('/patient/exercises')).toBe(true);
    expect(isAppPath('/about')).toBe(false);
  });

  it('keeps relative URLs in combined mode', () => {
    expect(getSiteMode('127.0.0.1')).toBe('combined');
    expect(appUrl('/login')).toBe('/login');
    expect(landingUrl('/about')).toBe('/about');
  });
});
