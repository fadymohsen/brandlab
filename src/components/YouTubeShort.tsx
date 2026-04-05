"use client";

export default function YouTubeShort({
  videoId,
  className = "",
}: {
  videoId: string;
  className?: string;
}) {
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
