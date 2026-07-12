export type VideoPreviewKind = 'iframe' | 'video';

export interface VideoPreviewSource {
  kind: VideoPreviewKind;
  src: string;
}

const DIRECT_VIDEO_PATTERN = /\.(mp4|webm|ogg)(\?.*)?$/i;

function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '');
      return id || null;
    }

    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.split('/')[2] ?? null;
      }

      const watchId = parsed.searchParams.get('v');
      if (watchId) {
        return watchId;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function getVideoPreviewSource(url: string | null | undefined): VideoPreviewSource | null {
  if (!url?.trim()) {
    return null;
  }

  const trimmed = url.trim();
  const youTubeId = extractYouTubeId(trimmed);

  if (youTubeId) {
    return {
      kind: 'iframe',
      src: `https://www.youtube.com/embed/${youTubeId}`,
    };
  }

  if (DIRECT_VIDEO_PATTERN.test(trimmed)) {
    return {
      kind: 'video',
      src: trimmed,
    };
  }

  return {
    kind: 'iframe',
    src: trimmed,
  };
}
