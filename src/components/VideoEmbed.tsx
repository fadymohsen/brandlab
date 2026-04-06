"use client";

export function YouTubeEmbed({ videoId, className = "" }: { videoId: string; className?: string }) {
  return (
    <div className={`rounded-2xl overflow-hidden ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        className="w-full aspect-[9/16]"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube Short"
      />
    </div>
  );
}

export default function VideoEmbed({
  url,
  className = "",
}: {
  url?: string;
  className?: string;
}) {
  if (!url) return null;

  const ytPatterns = [
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
  ];
  for (const p of ytPatterns) {
    const m = url.match(p);
    if (m) return <YouTubeEmbed videoId={m[1]} className={className} />;
  }

  return null;
}
