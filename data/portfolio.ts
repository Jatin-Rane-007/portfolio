// ============================================================
// PORTFOLIO DATA — JATIN RANE
// Single source of truth. Update this file to change content.
// ============================================================

export const personal = {
  name: "Jatin Rane",
  firstName: "Jatin",
  lastName: "Rane",
  title: "Frontend Engineer",
  titleLine2: "React · React Native",
  heroHeadline: ["MOBILE-FIRST.", "PRODUCTION-GRADE."],
  heroSubtitle:
    "Building production React Native and React applications that ship — real-time systems, compliance-critical flows, cross-platform experiences.",
  email: "007jatinr@gmail.com",
  phone: "+91 91046 93114",
  phoneHref: "tel:+919104693114",
  location: "Nadiad, Gujarat, India",
  github: "https://github.com/Jatin-Rane-007",
  githubHandle: "Jatin-Rane-007",
  linkedin: "https://linkedin.com/in/rane-jatin-852b331a9",
  resumeUrl: "/Jatin_Rane_Resume.docx",
  availableForWork: true,
};

export const experience = [
  {
    company: "Groovy Web",
    role: "Frontend Developer",
    period: "Dec 2023 – Present",
    location: "Nadiad, Gujarat, India",
    type: "IT services & software development",
    clients: [
      {
        name: "Saayam",
        stack: "React Native",
        domain: "Fundraising & Social Impact",
        highlights: [
          "Built a short-video social feature end-to-end — creation, infinite-scroll feed, full-screen viewer, admin approval workflow",
          "Built a full in-app messaging system — audio recording/playback, swipe-to-reply, message search, type-specific components",
          "Built a multi-beneficiary donation-splitting feature (even, percentage, fixed) with real-time validation + payout CRUD with approval-state tracking",
          "Delivered disaster-relief and elderly-care request flows across 4 account types with multi-step dynamic forms and country-specific bank/FCRA handling",
        ],
      },
      {
        name: "Menthra",
        stack: "React · TypeScript",
        domain: "AI-Powered Mental Wellness",
        highlights: [
          "Owned end-to-end delivery of a companion-sharing feature — creation, invitations, real-time notifications, admin approval",
          "Built a real-time therapist dashboard with live session monitoring, crisis-alert notifications, infinite-scroll analytics",
          "Primary contributor on a mobile/WebView compatibility initiative — 25+ screens adapted for iOS and Android app shells",
          "Built a compliance system covering BAA/DPA legal agreements with version control, OTP verification, and identity/selfie verification",
        ],
      },
    ],
  },
];

export const education = [
  {
    institution: "Birla Vishvakarma Mahavidyalaya",
    degree: "B.Tech, Production Engineering",
    period: "2019 – 2023",
    cpi: "7.36",
  },
];

export const projects = [
  {
    id: "saayam",
    index: "01",
    name: "Saayam",
    subtitle: "Fundraising & Social Impact Platform",
    client: "Client Project @ Groovy Web",
    stack: ["React Native", "iOS", "Android", "REST API", "WebSocket"],
    description:
      "A social-impact platform connecting donors, fundraisers, disaster-relief recipients, and NGOs — built from UI through API integration and cross-platform hardening.",
    challenge:
      "Unifying 4 distinct account types (general, corporate, NGO, guest) into a coherent UX, while handling country-specific financial regulations and iOS/Android camera/gesture edge cases.",
    keyDeliveries: [
      "Short-video feature — creation, infinite-scroll, full-screen viewer",
      "In-app messaging — audio, swipe-reply, search, type-specific components",
      "Multi-beneficiary donation splitting — 3 calculation modes",
      "Payout system with full CRUD and approval-state tracking",
      "Disaster-relief & elderly-care request flows for 4 account types",
    ],
    year: "2024",
    color: "#6366f1",
    accentColor: "#818cf8",
  },
  {
    id: "menthra",
    index: "02",
    name: "Menthra",
    subtitle: "AI-Powered Mental Wellness Platform",
    client: "Client Project @ Groovy Web",
    stack: ["React", "TypeScript", "WebSocket", "WebView", "iOS", "Android"],
    description:
      "An AI-powered mental wellness platform bridging therapist and patient experiences across web and native mobile — built under strict healthcare compliance requirements.",
    challenge:
      "Adapting a React web application to run inside native iOS/Android shells across 25+ screens, while maintaining real-time session monitoring and strict BAA/DPA regulatory compliance.",
    keyDeliveries: [
      "Companion-sharing feature — end-to-end with real-time notifications",
      "Real-time therapist dashboard — live session monitoring, crisis alerts",
      "Mobile/WebView compatibility across 25+ screens",
      "Compliance system — BAA/DPA acceptance, OTP, identity/selfie verification",
    ],
    year: "2024",
    color: "#8b5cf6",
    accentColor: "#a78bfa",
  },
];

// ------------------------------------------------------------
// Open source — public repos on github.com/Jatin-Rane-007
// Language/updated are enriched at runtime from the GitHub API;
// these values are the shipped fallback so the section is never empty.
// ------------------------------------------------------------
export const openSource = [
  {
    repo: "lenvy",
    name: "Lenvy",
    url: "https://github.com/Jatin-Rane-007/lenvy",
    tagline: "Personal wealth tracker with AI receipt and voice capture",
    summary:
      "A calm, cross-platform finance app: multi-account balance sheet, budgets, transaction search and CSV export — with AI capture that never saves without a confirmation.",
    stack: [
      "Expo",
      "React Native",
      "TypeScript",
      "Supabase",
      "Clerk",
      "Gemini",
      "Zustand",
    ],
    language: "TypeScript",
    highlights: [
      "Receipt-scan and voice entry through Gemini with a schema-constrained response — drafts open in an editable form, nothing persists until the user confirms",
      "Typed data layer: Clerk JWT exchanged for a per-user-scoped Supabase client, Zod-validated forms on every write",
      "Deno Edge Functions on pg_cron push daily budget alerts and weekly AI tips by email via Resend",
      "38 currencies, light/dark design tokens, transaction filters and monthly budgets",
    ],
    updated: "2026",
  },
  {
    repo: "lintel",
    name: "Lintel",
    url: "https://github.com/Jatin-Rane-007/lintel",
    tagline: "Property discovery app",
    summary:
      "Home folio, gallery and map, shortlist, and agent-only publishing — role-gated from the tab bar down to row-level security.",
    stack: [
      "Expo Router",
      "React Native",
      "TypeScript",
      "Supabase",
      "Clerk",
      "Reanimated",
    ],
    language: "TypeScript",
    highlights: [
      "Server-side filtering by city, reference number, price band, type and bedrooms",
      "Optimistic save/unsave that rolls back when the write fails",
      "Public anon client plus a Clerk-JWT client under Postgres row-level security",
      "Design-token theming; typecheck, lint and expo-doctor clean, Android release build verified",
    ],
    updated: "2026",
  },
] as const;

export const skills = [
  {
    category: "Languages & Frameworks",
    items: [
      {
        name: "JavaScript",
        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      },
      {
        name: "TypeScript",
        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      },
      {
        name: "React.js",
        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      },
      {
        name: "React Native",
        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      },
      {
        name: "Redux",
        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
      },
      {
        name: "HTML5",
        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      },
      {
        name: "CSS3",
        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
      },
    ],
  },
  {
    category: "Mobile & Cross-Platform",
    items: [
      {
        name: "iOS",
        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg",
      },
      {
        name: "Android",
        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg",
      },
      {
        name: "Xcode",
        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xcode/xcode-original.svg",
      },
      {
        name: "Git",
        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
      },
      {
        name: "GitHub",
        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
      },
      {
        name: "VS Code",
        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
      },
    ],
  },
  {
    category: "Integration & APIs",
    items: [
      {
        name: "REST API",
        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
      },
      {
        name: "WebSocket",
        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      },
      {
        name: "Node.js",
        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      },
      {
        name: "Firebase",
        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
      },
      {
        name: "Figma",
        url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
      },
    ],
  },
];

export const stats = [
  {
    value: 2,
    suffix: "",
    label: "Production Clients",
    description:
      "Delivered end-to-end features for two production-scale client platforms.",
  },
  {
    value: 4,
    suffix: "+",
    label: "Account Types Unified",
    description:
      "Built unified UX flows spanning general, corporate, NGO, and guest user types.",
  },
  {
    value: 25,
    suffix: "+",
    label: "Screens Adapted",
    description:
      "Adapted a React web app to run inside iOS and Android native shells across 25+ screens.",
  },
  {
    value: 2,
    suffix: "",
    label: "Platforms Shipped",
    description:
      "Shipped production React Native features on both iOS and Android simultaneously.",
  },
];

export const philosophy = {
  quote:
    "The function of good software is to make the complex appear to be simple.",
  author: "Grady Booch",
};

export const socials = [
  { label: "GitHub", href: personal.github },
  { label: "LinkedIn", href: personal.linkedin },
  { label: "Email", href: `mailto:${personal.email}` },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Open Source", href: "#source" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];
