import { useEffect, useRef } from 'react';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { getVideoPreviewSource } from '@/features/admin/exercises/utils/get-video-preview-source';
import type { ExerciseMediaType } from '@/features/exercises/types';

const { Text } = Typography;

interface ExerciseMediaPlayerProps {
  title: string;
  videoUrl?: string | null;
  mediaType?: ExerciseMediaType | null;
  autoPlay?: boolean;
  /** Guided session: loop without controls, continuous playback. */
  continuous?: boolean;
  maxHeight?: string;
  className?: string;
}

function unloadVideo(video: HTMLVideoElement | null) {
  if (!video) {
    return;
  }

  video.pause();
  video.removeAttribute('src');
  video.load();
}

async function tryPlay(video: HTMLVideoElement, preferMuted: boolean) {
  if (preferMuted) {
    video.muted = true;
  }

  try {
    await video.play();
  } catch {
    video.muted = true;
    try {
      await video.play();
    } catch {
      // Browser blocked autoplay entirely.
    }
  }
}

export function ExerciseMediaPlayer({
  title,
  videoUrl,
  mediaType,
  autoPlay = false,
  continuous = false,
  maxHeight = '40vh',
  className,
}: ExerciseMediaPlayerProps) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const preview = getVideoPreviewSource(videoUrl, mediaType);
  const previewKind = preview?.kind;
  const previewSrc = preview?.src;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || previewKind !== 'video' || !previewSrc) {
      return;
    }

    // Keep muted for continuous coach mode — browsers block unmuted autoplay,
    // and continuous mode has no play button to recover.
    if (autoPlay || continuous) {
      void tryPlay(video, continuous);
    }

    return () => {
      video.pause();
    };
  }, [previewKind, previewSrc, autoPlay, continuous]);

  useEffect(() => {
    return () => unloadVideo(videoRef.current);
  }, []);

  if (!preview) {
    return <Text type="secondary">{t('admin.exercises.video.unavailable')}</Text>;
  }

  if (preview.kind === 'video') {
    return (
      <video
        key={preview.src}
        ref={videoRef}
        className={className}
        style={{
          width: '100%',
          height: continuous ? '100%' : undefined,
          maxHeight: continuous ? undefined : maxHeight,
          objectFit: continuous ? 'contain' : 'cover',
          display: 'block',
          borderRadius: continuous ? 0 : 12,
          background: '#0b1220',
        }}
        controls={!continuous}
        controlsList={continuous ? undefined : 'nodownload'}
        playsInline
        muted={continuous}
        loop={continuous}
        autoPlay={autoPlay || continuous}
        preload="auto"
        src={preview.src}
        aria-label={title}
      >
        <track kind="captions" />
      </video>
    );
  }

  if (preview.kind === 'image') {
    return (
      <img
        src={preview.src}
        alt={title}
        className={className}
        style={{
          width: '100%',
          height: continuous ? '100%' : undefined,
          maxHeight: continuous ? undefined : maxHeight,
          objectFit: continuous ? 'contain' : 'contain',
          display: 'block',
          borderRadius: continuous ? 0 : 12,
          background: '#0b1220',
        }}
      />
    );
  }

  return (
    <iframe
      key={preview.src}
      className={className}
      style={{
        width: '100%',
        aspectRatio: '16 / 9',
        border: 'none',
        display: 'block',
        borderRadius: continuous ? 0 : 12,
        maxHeight: continuous ? '100%' : undefined,
      }}
      src={preview.src}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen={!continuous}
    />
  );
}
