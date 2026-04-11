import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

import "../styles/Photos.css";

const thumbnailModules = import.meta.glob("../photos/**/*_thumbnail.webp", {
  eager: true,
}) as Record<string, { default: string }>;

const fullModules = import.meta.glob(
  "../photos/**/!(* )*.webp",
  { eager: true }
) as Record<string, { default: string }>;

const photos = Object.entries(thumbnailModules).map(([path, mod]) => {
  const fullPath = path.replace("_thumbnail.webp", ".webp");
  return {
    thumbnail: mod.default,
    full: (fullModules[fullPath] as { default: string } | undefined)?.default ?? mod.default,
    alt: path.split("/").pop()?.replace("_thumbnail.webp", "") ?? "",
  };
});

export default function Photos() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i! + 1) % photos.length);
      if (e.key === "ArrowLeft") setLightbox((i) => (i! - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <div id="photos-page">
      <Header />

      <div className="title-text">
        <h1>Photos</h1>
        <p>
          A collection of photos I've taken over the years. Follow me at{" "}
          <a
            className="instagram-plug"
            href="https://instagram.com/kyleph0tos"
            target="_blank"
            referrerPolicy="no-referrer"
          >
            @kyleph0tos
          </a>{" "}
          on Instagram.
        </p>
      </div>

      <div className="photos-grid">
        {photos.map((photo, i) => (
          <div className="photo-item" key={i} onClick={() => setLightbox(i)}>
            <img src={photo.thumbnail} alt={photo.alt} loading="lazy" />
          </div>
        ))}
      </div>

      {lightbox !== null && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>
            <i className="bi bi-x-lg" />
          </button>
          <button
            className="lightbox-prev"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + photos.length) % photos.length); }}
          >
            <i className="bi bi-chevron-left" />
          </button>
          <img
            src={photos[lightbox].full}
            alt={photos[lightbox].alt}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="lightbox-next"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % photos.length); }}
          >
            <i className="bi bi-chevron-right" />
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}
