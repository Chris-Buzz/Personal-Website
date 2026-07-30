import { CSSProperties } from 'react';

/**
 * The treated `.ph` photo frame (warm grade + grain), with a graceful fallback.
 * TODO(assets): swap `src`/`fallback` for local imports once real images land.
 */
export default function Photo({
  src,
  fallback,
  alt,
  className = '',
  style,
}: {
  src: string;
  fallback?: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span className={`ph ${className}`.trim()} style={style}>
      <img
        src={src}
        alt={alt}
        onError={(e) => {
          const img = e.currentTarget;
          if (fallback && img.src !== fallback) {
            img.src = fallback;
          } else {
            img.style.display = 'none';
          }
        }}
      />
      <span className="ph-grain" />
    </span>
  );
}
