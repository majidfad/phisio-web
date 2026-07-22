import { Modal, Typography } from 'antd';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { getVideoPreviewSource } from '@/features/admin/exercises/utils/get-video-preview-source';
import type { ExerciseMediaType } from '@/features/exercises/types';

const { Text } = Typography;

interface ExerciseVideoModalProps {
  title: string | null;
  videoUrl?: string | null;
  mediaType?: ExerciseMediaType | null;
  onClose: () => void;
}

function unloadVideo(video: HTMLVideoElement | null) {
  if (!video) {
    return;
  }

  video.pause();
  video.removeAttribute('src');
  video.load();
}

export function ExerciseVideoModal({
  title,
  videoUrl,
  mediaType,
  onClose,
}: ExerciseVideoModalProps) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    return () => unloadVideo(video);
  }, []);

  const handleClose = () => {
    unloadVideo(videoRef.current);
    onClose();
  };

  const preview = getVideoPreviewSource(videoUrl, mediaType);

  return (
    <Modal
      title={title}
      open={!!title}
      onCancel={handleClose}
      footer={null}
      width={800}
      destroyOnHidden
      centered
      styles={{ body: { padding: 0 } }}
    >
      <div style={{ padding: '0 24px 24px' }}>
        {preview ? (
          preview.kind === 'video' ? (
            <video
              key={preview.src}
              ref={videoRef}
              style={{ width: '100%', maxHeight: '70vh', display: 'block' }}
              controls
              playsInline
              autoPlay
              preload="auto"
              src={preview.src}
            >
              <track kind="captions" />
            </video>
          ) : preview.kind === 'image' ? (
            <img
              src={preview.src}
              alt={title ?? ''}
              style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <iframe
              key={preview.src}
              style={{ width: '100%', aspectRatio: '16 / 9', border: 'none', display: 'block' }}
              src={preview.src}
              title={title ?? undefined}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )
        ) : (
          <Text type="secondary">{t('admin.exercises.video.unavailable')}</Text>
        )}
      </div>
    </Modal>
  );
}
