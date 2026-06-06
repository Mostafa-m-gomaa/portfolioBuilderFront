interface YouTubeEmbedProps {
  src: string;
  title: string;
  className?: string;
}

const YouTubeEmbed = ({ src, title, className }: YouTubeEmbedProps) => (
  <div
    className={`relative aspect-video overflow-hidden rounded-2xl border border-border bg-muted shadow-lg ${className ?? ""}`}
  >
    <iframe
      src={src}
      title={title}
      className="absolute inset-0 h-full w-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  </div>
);

export default YouTubeEmbed;
