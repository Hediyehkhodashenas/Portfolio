/*
  PROJECT DATA
  ------------------------------------------------------------------
  Each entry becomes a row in the Work index and a showcase view.

  category: "digital" | "visual" | "engineering"
  summary:  one short line. Let the visuals do the talking.
  scope:    a few words each. Shown as tags (or as the typographic
            plate when a project has no images yet).

  ADDING IMAGES (e.g. exported from Figma):
  1. Put files in  assets/work/<slug>/
  2. List them in the entry's `media` array:
       { src: "assets/work/<slug>/cover.webp", alt: "…", caption: "Home",
         width: 1600, height: 1000 }
     Frames with width <= 500 are presented inside a phone.
  Paths are relative, so they work on GitHub Pages and from file://.
  A file that fails to load is dropped automatically.

  Optional `links: [{ label: "Behance", href: "https://..." }]`
*/
window.PROJECTS = [
  {
    slug: "action-sports-club",
    title: "Action Sports Club",
    category: "digital",
    context: "Website design",
    year: "2026",
    role: "UI/UX & visual design",
    summary: "A one-page site for a boutique pilates and functional training studio in Nişantaşı, Istanbul.",
    scope: ["Website design", "UI/UX", "Visual design", "Responsive"],
    media: [
      { src: "assets/work/action-sports-club/hero.webp", alt: "Action Sports Club homepage hero with large typography and a studio photograph", caption: "Homepage", width: 1600, height: 1103 },
      { src: "assets/work/action-sports-club/classes.webp", alt: "Classes section presenting Reformer Pilates, Functional Training, HIIT, Bootcamp, Cycling and Yoga", caption: "Classes", width: 1440, height: 1341 },
      { src: "assets/work/action-sports-club/club.webp", alt: "The club section with studio photography, hours and amenities", caption: "The club", width: 1440, height: 1034 },
      { src: "assets/work/action-sports-club/reviews.webp", alt: "Social proof section showing a 5.0 Google rating from 283 reviews", caption: "Reviews", width: 1440, height: 604 },
      { src: "assets/work/action-sports-club/location.webp", alt: "Location, hours and reservation calls to action", caption: "Location & booking", width: 1440, height: 1478 },
      { src: "assets/work/action-sports-club/mobile-home.webp", alt: "Mobile homepage of the Action Sports Club website", caption: "Mobile — home", width: 390, height: 844 },
      { src: "assets/work/action-sports-club/mobile-classes.webp", alt: "Mobile classes section of the Action Sports Club website", caption: "Mobile — classes", width: 390, height: 2410 }
    ]
  },
  {
    slug: "stocksnotifier",
    title: "StocksNotifier",
    category: "digital",
    context: "Collabry",
    year: "2024",
    role: "Product Manager",
    summary: "A Collabry app I worked on as Product Manager.",
    scope: ["UI/UX", "Product & market analysis", "App logo", "Social content"],
    media: []
  },
  {
    slug: "movie-catcher",
    title: "Movie Catcher",
    category: "digital",
    context: "Collabry",
    year: "2024",
    role: "Product Manager",
    summary: "A Collabry app I worked on as Product Manager.",
    scope: ["UI/UX", "Product & market analysis", "App logo", "Social content"],
    media: []
  },
  {
    slug: "reaxio",
    title: "Reaxio",
    category: "digital",
    context: "Collabry",
    year: "2024",
    role: "Product Manager",
    summary: "A Collabry app I worked on as Product Manager.",
    scope: ["UI/UX", "Product & market analysis", "App logo", "Social content"],
    media: []
  },
  {
    slug: "speaksynq",
    title: "Speaksynq",
    category: "digital",
    context: "Collabry",
    year: "2024",
    role: "Product Manager",
    summary: "A Collabry app I worked on as Product Manager.",
    scope: ["UI/UX", "Product & market analysis", "App logo", "Social content"],
    media: []
  },
  {
    slug: "online-coffee-market",
    title: "Online Coffee Market",
    category: "digital",
    context: "Project",
    year: "",
    role: "Analysis, website & MVP",
    summary: "An aromatic coffee brand, from analysis to a first version.",
    scope: ["Market analysis", "SWOT", "Website", "MVP"],
    media: []
  },
  {
    slug: "digital-product-branding",
    title: "Digital Product Branding & Market Analysis",
    category: "digital",
    context: "Project",
    year: "",
    role: "Branding & analysis",
    summary: "Identity and positioning, developed together.",
    scope: ["Branding", "Market analysis"],
    media: []
  },
  {
    slug: "ai-teaching-assistant",
    title: "AI Teaching Assistant Agent",
    category: "digital",
    context: "Project",
    year: "",
    role: "",
    summary: "Exam papers and worksheets from a single prompt.",
    scope: ["AI agent", "Education", "Prompt to document"],
    media: []
  },
  {
    slug: "rumi-human-aura",
    title: "Rumi & Human Aura",
    category: "visual",
    context: "Freelance",
    year: "2023",
    role: "Cover designer",
    summary: "Book cover for Akram Jahangir Tuyserkani.",
    scope: ["Book cover", "Visual design"],
    media: []
  },
  {
    slug: "plano",
    title: "PLANO Online Reservation Platform",
    category: "visual",
    context: "Website content",
    year: "2021",
    role: "Content writer & creator",
    summary: "Blog posts and advertisement content.",
    scope: ["Blog writing", "Advertisement content"],
    note: "Content only — blogs and advertising.",
    media: []
  },
  {
    slug: "healthy-community-food-delivery",
    title: "GYM / Healthy Community Food Delivery Service",
    category: "engineering",
    context: "Beykoz Üniversitesi",
    year: "2022",
    role: "Engineering project",
    summary: "Food delivery for a gym and healthy-living community.",
    scope: ["User-friendly website", "Personalised nutrition", "Sustainable delivery"],
    award: "1st Place — Engineering Project of the Year 2022, Beykoz Üniversitesi",
    media: []
  },
  {
    slug: "quality-management-nike",
    title: "Quality Management — Nike",
    category: "engineering",
    context: "Academic study",
    year: "",
    role: "Quality management study",
    summary: "Sportswear QC, with Nike as the subject.",
    scope: ["Quality control", "Checklist design", "Portal concept"],
    note: "Academic project — not a Nike commission or employment.",
    media: []
  },
  {
    slug: "florist-production-planning",
    title: "Florist Production Planning",
    category: "engineering",
    context: "Academic study",
    year: "",
    role: "Production planning",
    summary: "Planning a florist’s production across three horizons.",
    scope: ["Daily plan", "Weekly plan", "Monthly plan"],
    media: []
  },
  {
    slug: "pedestal-fan-cost-analysis",
    title: "Pedestal Fan Cost Analysis",
    category: "engineering",
    context: "Academic study",
    year: "",
    role: "Cost analysis",
    summary: "An industrial engineering cost analysis.",
    scope: ["Cost analysis"],
    media: []
  }
];
