"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Project } from "../data/portfolio";

export default function ProjectGallery({ project }: { project: Project }) {
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const images = project.screenshots.filter((shot) => !failed[shot.path]);
  const count = images.length;
  const activeIndex = Math.min(active, Math.max(count - 1, 0));

  const step = useCallback(
    (direction: number) =>
      setOpen((current) => (current === null || count === 0 ? null : (current + direction + count) % count)),
    [count],
  );

  const close = useCallback(() => {
    setOpen(null);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (open === null) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close, step]);

  if (count === 0) return null;

  const current = open !== null ? images[Math.min(open, count - 1)] : null;

  return (
    <div className="project-gallery">
      <ul className="gallery-strip" aria-label={`${project.name} images`}>
        {images.map((shot, index) => (
          <li key={shot.path} className={`gallery-item ${index === activeIndex ? "is-active" : ""}`}>
            <button
              className="gallery-thumb"
              type="button"
              aria-label={`Enlarge image ${index + 1} of ${count}: ${shot.alt}`}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setActive(index);
                setOpen(index);
              }}
            >
              <img
                src={shot.path}
                alt={shot.alt}
                loading="lazy"
                decoding="async"
                onError={() => setFailed((state) => ({ ...state, [shot.path]: true }))}
              />
              <span className="gallery-caption">{shot.alt}</span>
            </button>
          </li>
        ))}
      </ul>

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${project.name} image viewer`} onClick={close}>
          <button className="lightbox-close" type="button" aria-label="Close viewer" onClick={close} autoFocus>
            <X size={20} />
          </button>
          {count > 1 && (
            <button
              className="lightbox-nav is-prev"
              type="button"
              aria-label="Previous image"
              onClick={(event) => { event.stopPropagation(); step(-1); }}
            >
              <ChevronLeft size={22} />
            </button>
          )}
          <figure onClick={(event) => event.stopPropagation()}>
            <img src={current.path} alt={current.alt} />
            <figcaption>
              {String((open ?? 0) + 1).padStart(2, "0")} / {String(count).padStart(2, "0")} · {current.alt}
            </figcaption>
          </figure>
          {count > 1 && (
            <button
              className="lightbox-nav is-next"
              type="button"
              aria-label="Next image"
              onClick={(event) => { event.stopPropagation(); step(1); }}
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}