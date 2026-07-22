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
}

function unloadVideo(video: HTMLVideoElement | null) {
  if (!video) {
    return;
  }

  video.pause();
  video.removeAttribute('src');
  video.load();
}

export function ExerciseMediaPlayer({
  title,
  videoUrl,
  mediaType,
  autoPlay = false,
}: ExerciseMediaPlayerProps) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const preview = getVideoPreviewSource(videoUrl, mediaType);

  useEffect(() => {
    const video = videoRef.current;
    return () => unloadVideo(video);
  }, [preview?.src]);

  if (!preview) {
    return <Text type="secondary">{t('admin.exercises.video.unavailable')}</Text>;
  }

  if (preview.kind === 'video') {
    return (
      <video
        key={preview.src}
        ref={videoRef}
        style={{ width: '100%', maxHeight: '40vh', display: 'block', borderRadius: 12 }}
        controls
        playsInline
        autoPlay={autoPlay}
        preload="auto"
        src={preview.src}
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
        style={{
          width: '100%',
          maxHeight: '40vh',
          objectFit: 'contain',
          display: 'block',
          borderRadius: 12,
        }}
      />
    );
  }

  return (
    <iframe
      key={preview.src}
      style={{
        width: '100%',
        aspectRatio: '16 / 9',
        border: 'none',
        display: 'block',
        borderRadius: 12,
      }}
      src={preview.src}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}
