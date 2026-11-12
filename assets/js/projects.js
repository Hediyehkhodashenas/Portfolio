/*
  PROJECT DATA
  ------------------------------------------------------------------
  Each entry becomes a row in the Work index and a detail view.

  category: "digital" | "visual" | "engineering"

  ADDING IMAGES LATER (e.g. exported from Figma):
  1. Put files in  assets/work/<slug>/   (e.g. assets/work/stocksnotifier/cover.jpg)
  2. Add them to the entry's `media` array:
       media: [
         { src: "assets/work/stocksnotifier/cover.jpg",
           alt: "StocksNotifier home screen", caption: "Home screen",
           width: 1600, height: 1000 }
       ]
  Paths are relative, so they work on GitHub Pages project sites too.
  Images only render when `media` has entries; a file that fails to load
  is removed automatically, so no empty or broken frames appear.

  Optional `links: [{ label: "View on Behance", href: "https://..." }]`
*/
window.PROJECTS = [
  {
    slug: "action-sports-club",
    title: "Action Sports Club",
    category: "digital",
    context: "Website design",
    year: "2026",
    role: "UI/UX & visual design",
    summary: "I designed a one-page website for Action Sports Club, a boutique pilates and functional training studio in Nişantaşı, Istanbul. The site is in Turkish and brings together classes, the club, and reservations in a dark, industrial visual language drawn from the studio itself.",
    scope: ["Website design", "UI/UX", "Visual design", "Responsive layout"],
    media: [
      { src: "assets/work/action-sports-club/hero.webp", alt: "Action Sports Club homepage hero with large typography and a studio photograph", caption: "Homepage hero", width: 1600, height: 1103 },
      { src: "assets/work/action-sports-club/classes.webp", alt: "Classes section presenting Reformer Pilates, Functional Training, HIIT, Bootcamp, Cycling and Yoga", caption: "Classes", width: 1440, height: 1341 },
      { src: "assets/work/action-sports-club/club.webp", alt: "The club section with studio photography, hours and amenities", caption: "The club", width: 1440, height: 1034 },
      { src: "assets/work/action-sports-club/reviews.webp", alt: "Social proof section showing a 5.0 Google rating from 283 reviews", caption: "Reviews", width: 1440, height: 604 },
      { src: "assets/work/action-sports-club/location.webp", alt: "Location, hours and reservation calls to action", caption: "Location and reservations", width: 1440, height: 1478 },
      { src: "assets/work/action-sports-club/mobile-home.webp", alt: "Mobile homepage of the Action Sports Club website", caption: "Mobile homepage", width: 390, height: 844 }
    ]
  },
  {
    slug: "stocksnotifier",
    title: "StocksNotifier",
    category: "digital",
    context: "Collabry",
    year: "2024 — Present",
    role: "Product Manager",
    summary: "StocksNotifier is one of the Collabry apps I work on as Product Manager. My contribution spans the interface and user experience, product and market analysis, the app’s logo, and the social content that introduces it to its audience.",
    scope: ["UI/UX design", "Product analysis", "Market analysis", "App logo", "Social content"],
    note: "A Collabry app. I work on it as Product Manager.",
    media: []
  },
  {
    slug: "movie-catcher",
    title: "Movie Catcher",
    category: "digital",
    context: "Collabry",
    year: "2024 — Present",
    role: "Product Manager",
    summary: "At Collabry I work on Movie Catcher from both sides of the product: shaping its UI/UX and reading the market around it, then carrying that thinking into its logo and social media content.",
    scope: ["UI/UX design", "Product analysis", "Market analysis", "App logo", "Social content"],
    note: "A Collabry app. I work on it as Product Manager.",
    media: []
  },
  {
    slug: "reaxio",
    title: "Reaxio",
    category: "digital",
    context: "Collabry",
    year: "2024 — Present",
    role: "Product Manager",
    summary: "For Reaxio, my role as Product Manager at Collabry combines product and market analysis with hands-on design — the interface and experience, the app logo, and the content used to market it.",
    scope: ["UI/UX design", "Product analysis", "Market analysis", "App logo", "Social content"],
    note: "A Collabry app. I work on it as Product Manager.",
    media: []
  },
  {
    slug: "speaksynq",
    title: "Speaksynq",
    category: "digital",
    context: "Collabry",
    year: "2024 — Present",
    role: "Product Manager",
    summary: "Speaksynq is another Collabry app I work on. I contribute UI/UX design and product and market analysis, and design its logo and social media content.",
    scope: ["UI/UX design", "Product analysis", "Market analysis", "App logo", "Social content"],
    note: "A Collabry app. I work on it as Product Manager.",
    media: []
  },
  {
    slug: "online-coffee-market",
    title: "Online Coffee Market",
    category: "digital",
    context: "Project",
    year: "",
    role: "Analysis, website & MVP",
    summary: "A digital business for an aromatic coffee brand, taken from analysis to a first version: a market and SWOT analysis to frame the opportunity, a website, and an MVP.",
    scope: ["Website", "Market analysis", "SWOT analysis", "MVP"],
    media: []
  },
  {
    slug: "digital-product-branding",
    title: "Digital Product Branding & Market Analysis",
    category: "digital",
    context: "Project",
    year: "",
    role: "Branding & analysis",
    summary: "A project pairing branding for a digital product with an analysis of the market it would enter — so the identity and the positioning are developed together.",
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
    summary: "An AI agent that generates exam papers and worksheets from a single prompt.",
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
    summary: "A freelance commission: the cover design for Rumi & Human Aura, a book by Akram Jahangir Tuyserkani.",
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
    summary: "Website content for PLANO, an online reservation platform. I wrote blog posts and created advertisement content for the platform.",
    scope: ["Blog writing", "Advertisement content"],
    note: "Content contribution only — blogs and advertising.",
    media: []
  },
  {
    slug: "healthy-community-food-delivery",
    title: "GYM / Healthy Community Food Delivery Service",
    category: "engineering",
    context: "Beykoz Üniversitesi",
    year: "2022",
    role: "Engineering project",
    summary: "A food delivery service for a gym and healthy-living community, built around three ideas: a user-friendly website, personalised nutritious choices, and sustainable delivery.",
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
    summary: "An academic quality management study using Nike sportswear as its subject: a quality control checklist and a concept for an internal portal to support sportswear QC.",
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
    summary: "Production planning for a florist across three horizons: daily, weekly and monthly plans.",
    scope: ["Production planning", "Daily · weekly · monthly plans"],
    media: []
  },
  {
    slug: "pedestal-fan-cost-analysis",
    title: "Pedestal Fan Cost Analysis",
    category: "engineering",
    context: "Academic study",
    year: "",
    role: "Cost analysis",
    summary: "An industrial engineering cost analysis of a pedestal fan.",
    scope: ["Cost analysis"],
    media: []
  }
];
