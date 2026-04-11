import { useState, useEffect, Fragment } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

import "../styles/Photos.css";

const thumbnailModules = import.meta.glob("../photography/**/thumbnails/*.webp", {
  eager: true,
}) as Record<string, { default: string }>;

const fullModules = import.meta.glob("../photography/**/*.webp", {
  eager: true,
}) as Record<string, { default: string }>;

interface DisplayInfo {
  title: string;
  description: string;
  start_date?: string;
  display_date?: string;
}

const infoModules = import.meta.glob("../photography/**/displayinfo.json", {
  eager: true,
}) as Record<string, DisplayInfo>;

const parseDate = (d: string) => {
  const [m, day, y] = d.split("/").map(Number);
  return new Date(y, m - 1, day).getTime();
};

// Build a flat list of all photos with their section
const allPhotos = Object.entries(thumbnailModules).map(([path, mod]) => {
  const fullPath = path.replace("/thumbnails/", "/");
  const section = path.split("/").slice(-3)[0];
  return {
    thumbnail: mod.default,
    full: (fullModules[fullPath] as { default: string } | undefined)?.default ?? mod.default,
    alt: path.split("/").pop()?.replace("_thumbnail.webp", "") ?? "",
    section,
  };
});

// Build sections from displayinfo.json files, sorted descending by start_date
const sections = Object.entries(infoModules)
  .map(([path, info]) => {
    const section = path.split("/").slice(-2)[0];
    return {
      key: section,
      title: info.title,
      description: info.description,
      display_date: info.display_date ?? null,
      start_date: info.start_date ? parseDate(info.start_date) : null,
      photos: allPhotos.filter((p) => p.section === section),
    };
  })
  .sort((a, b) => {
    if (a.start_date === null && b.start_date === null) return 0;
    if (a.start_date === null) return 1;
    if (b.start_date === null) return -1;
    return b.start_date - a.start_date;
  });

// Parses [text](url) links in a string into React elements
function renderDescription(text: string) {
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  const result: React.ReactNode[] = [];
  let last = 0, match: RegExpExecArray | null, i = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) result.push(<Fragment key={i++}>{text.slice(last, match.index)}</Fragment>);
    result.push(
      <a key={i++} href={match[2]} target="_blank" referrerPolicy="no-referrer" className="description-link">
        {match[1]}
      </a>
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) result.push(<Fragment key={i}>{text.slice(last)}</Fragment>);
  return result;
}

export default function Photos() {
  const [lightbox, setLightbox] = useState<{ sectionIdx: number; photoIdx: number } | null>(null);

  const flatPhotos = sections.flatMap((s) => s.photos);
  const flatIndex = lightbox
    ? sections.slice(0, lightbox.sectionIdx).reduce((acc, s) => acc + s.photos.length, 0) + lightbox.photoIdx
    : 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === "Escape") {
        setLightbox(null);
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const next = (flatIndex + (e.key === "ArrowRight" ? 1 : -1) + flatPhotos.length) % flatPhotos.length;
        let count = 0;
        for (let si = 0; si < sections.length; si++) {
          if (next < count + sections[si].photos.length) {
            setLightbox({ sectionIdx: si, photoIdx: next - count });
            return;
          }
          count += sections[si].photos.length;
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, flatIndex, flatPhotos.length]);

  const navigateLightbox = (dir: 1 | -1) => {
    if (!lightbox) return;
    const next = (flatIndex + dir + flatPhotos.length) % flatPhotos.length;
    let count = 0;
    for (let si = 0; si < sections.length; si++) {
      if (next < count + sections[si].photos.length) {
        setLightbox({ sectionIdx: si, photoIdx: next - count });
        return;
      }
      count += sections[si].photos.length;
    }
  };

  const activeLightboxPhoto = lightbox
    ? sections[lightbox.sectionIdx].photos[lightbox.photoIdx]
    : null;

  return (
    <div id="photos-page">
      <Header />

      <div className="title-text">
        <h1>Photos</h1>
        <p>
          I first got into photography when I was 10 years old, and I still
          don't know what I'm doing. I shoot a lot of 35mm on my parents' old
          Pentax. When I can, I sometimes shoot on a Cannon 80D. This is a dump
          of a lot of my photos; for <em>better edited</em> pictures, follow me at{" "}
          <a
            className="instagram-plug"
            href="https://www.instagram.com/kyleph0tos"
            target="_blank"
            referrerPolicy="no-referrer"
          >
            @kyleph0tos
          </a>{" "}
          on Instagram (please!).
        </p>
      </div>

      {sections.map((section, si) => (
        <div className="photo-section" key={section.key}>
          <div className="section-header">
            <div className="section-title-row">
              <h2>{section.title}</h2>
              {section.display_date && <span className="section-date">{section.display_date}</span>}
            </div>
            <p>{renderDescription(section.description)}</p>
          </div>
          <div className="photos-grid">
            {section.photos.map((photo, pi) => (
              <div
                className="photo-item"
                key={pi}
                onClick={() => setLightbox({ sectionIdx: si, photoIdx: pi })}
              >
                <img src={photo.thumbnail} alt={photo.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      ))}

      {lightbox !== null && activeLightboxPhoto && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>
            <i className="bi bi-x-lg" />
          </button>
          <button
            className="lightbox-prev"
            onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
          >
            <i className="bi bi-chevron-left" />
          </button>
          <img
            src={activeLightboxPhoto.full}
            alt={activeLightboxPhoto.alt}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="lightbox-next"
            onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
          >
            <i className="bi bi-chevron-right" />
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}
