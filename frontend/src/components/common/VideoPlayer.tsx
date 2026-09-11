import React from 'react';
import { Film, ExternalLink } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
};

export const getYouTubeThumbnail = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg` : null;
};

export const getVimeoEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  const regExp = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/;
  const match = url.match(regExp);
  return match ? `https://player.vimeo.com/video/${match[1]}` : null;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  title = 'Video Player',
  className = 'w-full h-full',
  autoPlay = false,
  muted = false,
  controls = true,
}) => {
  if (!url) return null;

  const ytEmbed = getYouTubeEmbedUrl(url);
  if (ytEmbed) {
    const embedSrc = `${ytEmbed}${autoPlay ? '?autoplay=1' : ''}`;
    return (
      <iframe
        src={embedSrc}
        title={title}
        className={`${className} border-0`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  const vimeoEmbed = getVimeoEmbedUrl(url);
  if (vimeoEmbed) {
    return (
      <iframe
        src={`${vimeoEmbed}${autoPlay ? '?autoplay=1' : ''}`}
        title={title}
        className={`${className} border-0`}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  const isDirectVideo =
    url.includes('.mp4') ||
    url.includes('.webm') ||
    url.includes('.mov') ||
    url.includes('.m4v') ||
    url.includes('.3gp') ||
    url.includes('/video/upload/');

  if (isDirectVideo || url.startsWith('blob:') || url.startsWith('data:video')) {
    return (
      <video
        src={url}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        className={`${className} object-cover`}
        playsInline
      />
    );
  }

  if (url.includes('/embed/') || url.includes('/player/')) {
    return (
      <iframe
        src={url}
        title={title}
        className={`${className} border-0`}
        allowFullScreen
      />
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center bg-card p-4 text-center ${className}`}>
      <Film className="w-10 h-10 text-primary mb-2 animate-bounce" />
      <span className="text-xs font-bold text-text line-clamp-1 max-w-xs">{title}</span>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-2 text-xs font-bold text-primary inline-flex items-center gap-1 hover:underline"
      >
        Watch Video <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};
