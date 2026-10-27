export type NavigationItem = { id: string; label: string };
export type ProjectScreenshot = {
  path: string;
  alt: string;
};

export type Project = {
  id: string;
  name: string;
  summary: string;
  category: string;
  screenshots: ProjectScreenshot[];
  verified: boolean;
};

export const navigation: NavigationItem[] = [
  { id: "work", label: "WORK" },
  { id: "profile", label: "PROFILE" },
  { id: "contact", label: "CONTACT" },
];

export const profile = {
  name: "Venu Gopal",
  email: "mailto:imvenugopal08@gmail.com",
  role: "B.Tech CSE (AI & ML) student building agentic AI systems and software",
  intro: "I build agentic AI workflows, backend systems, and software that connects ideas to working implementations.",
  note: "Currently studying Computer Science and Engineering (AI & ML) at GLA University, Mathura. Interested in agentic workflows, machine learning, full-stack systems, and embedded projects.",
  education: "B.Tech, Computer Science and Engineering (AI & ML) · GLA University · Expected 2028",
  github: "https://github.com/VenuGopal811",
  linkedin: "https://www.linkedin.com/in/venu-gopal-a8b2ba311/",
  skills: [
    ["LANGUAGES", "Python · JavaScript · TypeScript · SQL · C++"],
    ["FRAMEWORKS", "FastAPI · Django · React · LangChain · LangGraph · Pydantic"],
    ["AI / ML", "Agentic workflows · RAG · NLP · Logistic Regression · Hugging Face"],
    ["DATA", "PostgreSQL · MySQL · MongoDB · Redis · FAISS"],
    ["ENGINEERING", "REST APIs · Pytest · Git · GitHub Actions · Docker · Linux"]
  ]
};

export const projects: Project[] = [
  {
    id: "spendos",
    name: "SpendOS",
    summary: "AI-driven smart procurement platform with a multi-agent backend workflow.",
    category: "AGENTIC AI / BACKEND",
    screenshots: [],
    verified: true,
  },
  {
    id: "ripple",
    name: "RIPPLE",
    summary: "Open-source prototype exploring vehicle-to-vehicle sharing of road-hazard observations.",
    category: "EMBEDDED / COOPERATIVE PERCEPTION",
    screenshots: [],
    verified: true,
  },
  {
    id: "labflow",
    name: "LabFlow",
    summary: "Django-based laboratory management system for pathology and X-ray diagnostic workflows.",
    category: "FULL-STACK / HEALTHCARE WORKFLOW",
    screenshots: [],
    verified: true,
  },
  {
    id: "clinical-ml",
    name: "Clinical ML Models",
    summary: "Two adverse drug reaction classifiers and a drug–drug interaction detection model built with Logistic Regression.",
    category: "MACHINE LEARNING",
    screenshots: [],
    verified: true,
  },
];
