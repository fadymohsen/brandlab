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

export function InstagramEmbed({ reelId, className = "" }: { reelId: string; className?: string }) {
  return (
    <div className={`rounded-2xl overflow-hidden ${className}`}>
      <iframe
        src={`https://www.instagram.com/reel/${reelId}/embed`}
        className="w-full aspect-[9/16]"
        allowFullScreen
        title="Instagram Reel"
      />
    </div>
  );
}

export default function VideoEmbed({
  url,
  videoSource,
  className = "",
}: {
  url?: string;
  videoSource?: { type: "youtube" | "instagram"; id: string };
  className?: string;
}) {
  if (!videoSource && url) {
    // Parse from URL
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
    const igPatterns = [
      /instagram\.com\/reel\/([a-zA-Z0-9_-]+)/,
      /instagram\.com\/reels\/([a-zA-Z0-9_-]+)/,
      /instagram\.com\/p\/([a-zA-Z0-9_-]+)/,
    ];
    for (const p of igPatterns) {
      const m = url.match(p);
      if (m) return <InstagramEmbed reelId={m[1]} className={className} />;
    }
    return null;
  }

  if (!videoSource) return null;

  if (videoSource.type === "youtube") {
    return <YouTubeEmbed videoId={videoSource.id} className={className} />;
  }
  return <InstagramEmbed reelId={videoSource.id} className={className} />;
}
