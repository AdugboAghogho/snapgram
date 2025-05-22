import { useEffect, useState } from "react";

function PostMedia({ url }: { url: string }) {
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);

  useEffect(() => {
    const detectMediaType = async () => {
      try {
        const response = await fetch(url, { method: "HEAD" });
        const contentType = response.headers.get("Content-Type");

        if (contentType?.startsWith("video/")) {
          setMediaType("video");
        } else if (contentType?.startsWith("image/")) {
          setMediaType("image");
        } else {
          setMediaType(null);
        }
      } catch (error) {
        console.error("Failed to detect media type:", error);
        setMediaType(null);
      }
    };

    if (url) detectMediaType();
  }, [url]);

  if (!url || mediaType === null) {
    return (
      <img
        src="/assets/icons/profile-placeholder.svg"
        alt="placeholder"
        className="post-card_img object-cover"
      />
    );
  }

  return mediaType === "video" ? (
    <video controls autoPlay className="post-card_img object-cover">
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  ) : (
    <img src={url} alt="post media" className="post-card_img object-cover" />
  );
}

export default PostMedia;
