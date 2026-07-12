import { describe, expect, it } from 'vitest';

import { getVideoPreviewSource } from '@/features/admin/exercises/utils/get-video-preview-source';

describe('getVideoPreviewSource', () => {
  it('returns null for empty urls', () => {
    expect(getVideoPreviewSource(null)).toBeNull();
    expect(getVideoPreviewSource('')).toBeNull();
  });

  it('embeds youtube watch urls', () => {
    expect(getVideoPreviewSource('https://www.youtube.com/watch?v=abc123XYZ')).toEqual({
      kind: 'iframe',
      src: 'https://www.youtube.com/embed/abc123XYZ',
    });
  });

  it('embeds youtu.be urls', () => {
    expect(getVideoPreviewSource('https://youtu.be/abc123XYZ')).toEqual({
      kind: 'iframe',
      src: 'https://www.youtube.com/embed/abc123XYZ',
    });
  });

  it('uses video tag for direct media files', () => {
    expect(getVideoPreviewSource('https://example.com/stretch.mp4')).toEqual({
      kind: 'video',
      src: 'https://example.com/stretch.mp4',
    });
  });
});
