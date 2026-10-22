"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CircleDot, ChevronRight } from "lucide-react";
import {
  navigation,
  profile,
  projects,
  type Project,
} from "../data/portfolio";

const startupLines = ["CHECKING INTERFACE", "LOADING WORKSPACE", "READY"];

function Standby({ onEnter }: { onEnter: () => void }) {
  const [booting, setBooting] = useState(false);
  const [line, setLine] = useState(0);
  const bootingRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const finishRef = useRef<number | null>(null);

  const enter = useCallback(() => {
    if (bootingRef.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      onEnter();
      return;
    }

    bootingRef.current = true;
    setBooting(true);
    timerRef.current = window.setInterval(
      () => setLine((current) => Math.min(current + 1, startupLines.length - 1)),
      330,
    );
    finishRef.current = window.setTimeout(() => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      onEnter();
    }, 1120);
  }, [onEnter]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        enter();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (finishRef.current) window.clearTimeout(finishRef.current);
    };
  }, [enter]);

  return (
    <main className={`standby ${booting ? "is-booting" : ""}`}>
      <div className="standby-grid" aria-hidden="true" />
      <div className="standby-content">
        <div className="eyebrow">
          <CircleDot size={12} /> PERSONAL WORKSPACE / 2026
        </div>
        <h1>{profile.name}</h1>
        <p className="standby-role">{profile.role}</p>
        <button className="power-button" onClick={enter} type="button" aria-label="Enter workspace">
          <span className="power-ring" aria-hidden="true"><span className="power-mark" /></span>
          <span>{booting ? startupLines[line] : "ENTER WORKSPACE"}</span>
        </button>
        <button className="skip-button" onClick={onEnter} type="button">SKIP INTRO</button>
        <p className="standby-hint">PRESS <kbd>ENTER</kbd> OR <kbd>SPACE</kbd> TO BEGIN</p>
        <p className="sr-only" aria-live="polite">{booting ? startupLines[line] : "System standby. Awaiting input."}</p>
      </div>
      <div className="standby-footer">
        <span>SYS.01</span>
        <span className="status"><i /> STANDBY — AWAITING INPUT</span>
        <span>V.1.0.0</span>
      </div>
    </main>
  );
}

function Header({ scrollTo }: { scrollTo: (id: string) => void }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => scrollTo("top")} type="button" aria-label="Back to top">
        <span className="brand-mark">+</span><span>DW<span className="muted">/</span>01</span>
      </button>
      <nav aria-label="Primary navigation">
        {navigation.map((item) => (
          <button key={item.id} onClick={() => scrollTo(item.id)} type="button">{item.label}</button>
        ))}
      </nav>
      <div className="header-links">
        <span className="header-status"><i /> ONLINE</span><span className="divider" /><span className="mono">PORTFOLIO / ACTIVE</span>
      </div>
    </header>
  );
}

function ProjectDirectory() {
  const storageKey = "developer-workspace:selected-project";
  const [selectedId, setSelectedId] = useState(projects[0].id);
  const [previewId, setPreviewId] = useState<string | null>(projects[0].id);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const selectedProject = projects.find((project) => project.id === selectedId) ?? projects[0];
  const previewProject = projects.find((project) => project.id === previewId) ?? selectedProject;
  const previewPath = previewProject.screenshots[0]?.path ?? "";

  useEffect(() => {
    const savedId = window.localStorage.getItem(storageKey);
    if (savedId && projects.some((project) => project.id === savedId)) {
      setSelectedId(savedId);
      setPreviewId(savedId);
    }
  }, []);

  const selectProject = (project: Project) => {
    setSelectedId(project.id);
    setPreviewId(project.id);
    window.localStorage.setItem(storageKey, project.id);
  };

  const previewProjectOnIntent = (project: Project) => setPreviewId(project.id);

  return (
    <section id="work" className="section work-section" aria-labelledby="work-title">
      <div className="ambient" aria-hidden="true">
        {projects.flatMap((project) => project.screenshots).map((screenshot) => (
          <img
            key={screenshot.path}
            className={`ambient-image ${previewPath === screenshot.path && !failedImages[screenshot.path] ? "is-visible" : ""}`}
            src={screenshot.path}
            alt=""
            loading={previewPath === screenshot.path ? "eager" : "lazy"}
            decoding="async"
            sizes="100vw"
            onError={() => setFailedImages((current) => ({ ...current, [screenshot.path]: true }))}
          />
        ))}
        <div className="ambient-wash" />
      </div>
      <div className="section-head">
        <div><span className="section-number">01 /</span><h2 id="work-title">Selected work</h2></div>
        <span className="section-meta">PROJECT DIRECTORY</span>
      </div>
      <p className="section-intro">A working index of interfaces, systems, and experiments. Select a project to pin its preview in the inspector.</p>
      <div className="project-list" role="list" aria-label="Project directory">
        {projects.map((project, index) => (
          <button
            key={project.id}
            className={`project-row ${selectedId === project.id ? "is-selected" : ""}`}
            type="button"
            aria-pressed={selectedId === project.id}
            onClick={() => selectProject(project)}
            onMouseEnter={() => previewProjectOnIntent(project)}
            onFocus={() => previewProjectOnIntent(project)}
            onTouchStart={() => previewProjectOnIntent(project)}
          >
            <span className="project-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="project-name">{project.name}</span>
            <span className="project-summary">{project.summary}</span>
            <span className="project-category">{project.category}</span>
            <span className="project-arrow" aria-hidden="true"><ChevronRight size={15} /></span>
          </button>
        ))}
      </div>
      <aside className="project-inspector" aria-live="polite" aria-label="Selected project inspector">
        <div className="inspector-heading">
          <span className="inspector-label">SELECTED PREVIEW</span>
          <strong>{selectedProject.name}</strong>
        </div>
        <p>{selectedProject.summary}</p>
        <span className="inspector-meta">{selectedProject.category} · {selectedProject.screenshots.length} SUPPLIED ASSET · {selectedProject.verified ? "VERIFIED" : "UNVERIFIED SOURCE"}</span>
        <span>{previewProject.id === selectedProject.id ? "PINNED IN INSPECTOR" : `PREVIEWING ${previewProject.name.toUpperCase()}`}</span>
        <span className="inspector-status"><i /> {selectedProject.screenshots.length === 0 || failedImages[previewPath] ? "NO SCREENSHOT / FALLBACK ACTIVE" : "AMBIENT LAYER READY"}</span>
      </aside>
      <p className="asset-note"><span className="asset-dot" /> HOVER, FOCUS, OR TAP A ROW TO PREVIEW · SELECTED PROJECT PERSISTS ON THIS DEVICE · SCREENSHOTS NOT SUPPLIED</p>
    </section>
  );
}

function ProfileSection() {
  return (
    <section id="profile" className="section profile-section" aria-labelledby="profile-title">
      <div className="section-head">
        <div><span className="section-number">02 /</span><h2 id="profile-title">Profile</h2></div>
        <span className="section-meta">ABOUT THE BUILDER</span>
      </div>
      <div className="profile-layout">
        <div>
          <p className="large-copy">{profile.role}</p>
          <p className="body-copy">{profile.note}</p>
          <p className="education"><span>EDUCATION</span>{profile.education}</p>
        </div>
        <div className="skills">
          {profile.skills.map(([label, value]) => (
            <div className="skill-row" key={label}><span>{label}</span><strong>{value}</strong></div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="section contact-section" aria-labelledby="contact-title">
      <div>
        <div className="section-head">
          <div><span className="section-number">03 /</span><h2 id="contact-title">Contact</h2></div>
          <span className="section-meta">OPEN CHANNELS</span>
        </div>
        <p className="section-intro">Connect through the public profiles below.</p>
      </div>
      <div className="contact-actions">
        <a href={profile.github} target="_blank" rel="noreferrer">GITHUB <ChevronRight size={15} /></a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">LINKEDIN <ChevronRight size={15} /></a>
      </div>
    </section>
  );
}

export default function Home() {
  const [entered, setEntered] = useState(false);
  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (!entered) return <Standby onEnter={() => setEntered(true)} />;

  return (
    <main id="top" className="workspace">
      <Header scrollTo={scrollTo} />
      <section className="workspace-hero" aria-labelledby="hero-title">
        <div>
          <span className="eyebrow"><CircleDot size={12} /> WORKSPACE / ACTIVE</span>
          <h1 id="hero-title">Build with<br /><em>intention.</em></h1>
        </div>
        <div className="hero-aside">
          <span className="mono">A01 — FIELD NOTES</span>
          <p>{profile.intro}</p>
          <button onClick={() => scrollTo("work")} type="button">ENTER THE DIRECTORY <ChevronRight size={15} /></button>
        </div>
      </section>
      <ProjectDirectory />
      <ProfileSection />
      <ContactSection />
      <footer><span>DW / 01</span><span>PORTFOLIO BUILD · ACTIVE</span><span>© 2026</span></footer>
    </main>
  );
}
