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
  Optional `caseStudy: { ... }` renders a case-study section below the
  showcase (see Action Sports Club). Projects without it show none.
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
    ],
    /* Case study: rendered below the showcase in the project view (#case-study).
       Facts only from the original case study. Club contact details never go in the footer. */
    caseStudy: {
      title: "Match the room, the neighbourhood, or the workout?",
      lede: "Three complete website directions for a boutique studio in Teşvikiye, built, compared and narrowed to one recommendation.",
      disclaimer: "This is Hediyeh Khodashenas's design proposal for a prospective client, not the studio's official site.",
      decision: {
        title: "Build Direction A, with two refinements.",
        score: "32",
        outOf: "35",
        text: "A won on honesty and differentiation. Its dark, teal-accented system is the studio's own interior, so the one real photo fits without retouching, and visitors see the same room when they walk in.",
        refinementsLabel: "Before Figma refinement, A borrows two things from the alternatives",
        refinements: [
          "A short photo band above the headline on mobile (from B and C).",
          "A more compact class list on mobile (from B)."
        ],
        others: [
          { key: "C", score: "30", text: "A close second: the strongest energy and mobile first screen, but too close to big-box and HIIT-chain styling for a premium Teşvikiye client." },
          { key: "B", score: "26", text: "The most “Nişantaşı” look, but it has to warm a dark industrial photo into something the room is not, and it blends in with nearby pilates studios." }
        ]
      },
      compare: [
        { src: "assets/work/action-sports-club/case-study/compare-desktop-hero-A-B-C.webp", width: 2400, height: 486, caption: "Desktop first screen · A, B, C", alt: "The three desktop hero screens side by side: A on near-black with a wide heavy headline, teal accents and a framed studio photo; B on cream with a serif headline and the photo in an arch; C on black with a giant condensed headline over a teal duotone photo and a round 5.0 rating sticker." },
        { src: "assets/work/action-sports-club/case-study/compare-mobile-hero-A-B-C.webp", width: 1250, height: 844, caption: "Mobile first screen · A, B, C", alt: "The three mobile hero screens side by side: A dark with a teal WhatsApp button and the 5.0 rating card, B cream with an arch photo above a serif headline, C black with a teal duotone photo, rating sticker and stacked condensed headline. Each has a sticky WhatsApp booking bar." }
      ],
      directions: [
        {
          key: "A", name: "Dark industrial", score: "32", recommended: true,
          idea: "Show the real room: a premium, moody training studio in Teşvikiye.",
          swatches: ["#0A0B0C", "#22D3E2"],
          facts: [
            ["Palette", "Near-black #0A0B0C, charcoal, concrete gray, electric teal #22D3E2 from the ropes and kettlebells, off-white type."],
            ["Type", "Archivo (wide, heavy display) + Hanken Grotesk body + JetBrains Mono labels."],
            ["Photo", "The one real studio photo, untouched, in a framed card with today's hours."],
            ["Voice", "Formal “siz”, short and confident."],
            ["Borrows from", "Third Space (sell the space with dark interior photography), Psycle (booking always one tap away)."]
          ],
          desktop: { src: "assets/work/action-sports-club/case-study/A-dark-industrial--desktop-hero.webp", width: 1440, height: 900, alt: "Direction A desktop hero: near-black page, wide white headline “Nişantaşı'nda pilates ve fonksiyonel antrenman” with “pilates” in teal, WhatsApp and phone buttons, a 5.0 Google rating, and the studio photo in a framed card with today's hours." },
          mobile: { src: "assets/work/action-sports-club/case-study/A-dark-industrial--mobile-hero.webp", width: 585, height: 1266, alt: "Direction A mobile hero: dark screen with the wide headline, a full-width teal WhatsApp button, a phone button, the 5.0 rating card, and a sticky WhatsApp bar at the bottom." },
          screens: [
            { name: "Hero", image: "desktop", kept: "Copy on the left, framed photo card with a live “Bugün” hours chip on the right.", dropped: ["Full-bleed photo with overlaid text: the 600×800 source goes soft at 1440 px and the wall texture fights the text.", "Type-only hero with the photo lower: loses the proof that this is a real room."] },
            { name: "Dersler", src: "assets/work/action-sports-club/case-study/A-dark-industrial--desktop-dersler.webp", width: 1200, height: 1118, alt: "Direction A classes section: “Altı disiplin. Tek stüdyo.” above six dark cards with line glyphs and focus chips for Reformer Pilates, Functional Training, HIIT Cardio, Bootcamp, Cycling and Yoga.", kept: "Six cards with line glyphs and a focus chip.", dropped: ["Tabs per class: hides five of the six.", "Horizontal scroller: hides four of six on desktop."] },
            { name: "İletişim", src: "assets/work/action-sports-club/case-study/A-dark-industrial--desktop-iletisim.webp", width: 1200, height: 1232, alt: "Direction A location section: a dark contact card with address, opening hours and contact rows beside a drawn street map with a teal pin, then a closing booking call to action.", kept: "Contact card plus a drawn map that loads Google Maps only on tap.", dropped: ["Always-on Google embed: heavy third-party load before anyone asks for it.", "No map: location is a selling point."] }
          ]
        },
        {
          key: "B", name: "Light editorial", score: "26",
          idea: "Read like a Nişantaşı lifestyle magazine: calm, warm, pilates-first.",
          swatches: ["#F4EFE7", "#E9E0D2", "#1F1B17", "#2C5A5C"],
          facts: [
            ["Palette", "Cream #F4EFE7, sand #E9E0D2, ink #1F1B17, petrol #2C5A5C accent, clay stars."],
            ["Type", "Instrument Serif (with italic accents) + Instrument Sans body."],
            ["Photo", "Same photo, warmed toward sepia and set in an arch frame."],
            ["Voice", "Formal “siz”, softer: “size uyan saatte”."],
            ["Borrows from", "Urban Health Pilates (warm, Turkish-first premium), Freya Nişantaşı (serif plus a soft palette for credibility)."]
          ],
          desktop: { src: "assets/work/action-sports-club/case-study/B-light-editorial--desktop-hero.webp", width: 1440, height: 900, alt: "Direction B desktop hero: cream page with a serif headline, “pilates” in petrol italic, dark WhatsApp and outlined phone buttons, a two-cell rating and hours ticket, and the studio photo in a tall arch frame." },
          mobile: { src: "assets/work/action-sports-club/case-study/B-light-editorial--mobile-hero.webp", width: 585, height: 1266, alt: "Direction B mobile hero: cream screen with the arch-framed photo above a serif headline, a dark WhatsApp button, an outlined phone button and a sticky booking bar." },
          screens: [
            { name: "Hero", image: "desktop", kept: "Serif headline on the left, tall arch photo on the right, Google and today's hours in a two-cell “ticket”.", dropped: ["Centered headline with the photo full width below: pushes the CTA down.", "Magazine cover with the photo full bleed: the dark photo fights the cream palette."] },
            { name: "Dersler", src: "assets/work/action-sports-club/case-study/B-light-editorial--desktop-dersler.webp", width: 1200, height: 1163, alt: "Direction B classes section: a numbered serif list from 01 Reformer Pilates to 06 Yoga, each with a one-line description and a small focus tag, on cream.", kept: "Numbered menu list: number, name, one line, focus tag.", dropped: ["2×3 cards with a photo per class: we have no class photos and will not use stock.", "Accordion: hides the descriptions."] },
            { name: "İletişim", src: "assets/work/action-sports-club/case-study/B-light-editorial--desktop-iletisim.webp", width: 1200, height: 1312, alt: "Direction B location section in a letter layout: the address in large serif, an hours table and contact lines on the left, a sand-coloured drawn map on the right.", kept: "“Letter” layout: address in large serif, hours table, contact lines, sand map.", dropped: ["Centered card: weak hierarchy.", "Contact merged into the footer: hours get buried."] }
          ]
        },
        {
          key: "C", name: "Athletic poster", score: "30",
          idea: "A training poster: big condensed type, colour blocks, maximum energy.",
          swatches: ["#0A0A0A", "#F7F7F4", "#19D3E0"],
          facts: [
            ["Palette", "Black #0A0A0A, bone white #F7F7F4, solid teal #19D3E0 fields."],
            ["Type", "Big Shoulders Display (condensed, 900) + Space Grotesk body."],
            ["Photo", "Same photo as a black-and-teal duotone, which hides its low resolution."],
            ["Voice", "Informal “sen”: “Gel. Çalış. Hazır çık.”"],
            ["Borrows from", "Psycle (marquee strip, one hot accent), Barry's (repeated first-class CTA, big uppercase headline)."]
          ],
          desktop: { src: "assets/work/action-sports-club/case-study/C-athletic-poster--desktop-hero.webp", width: 1440, height: 900, alt: "Direction C desktop hero: black page with a giant stacked condensed headline, “pilates” in teal, the photo as a teal duotone on the right half, a rotated round 5.0 rating sticker and square teal and white buttons." },
          mobile: { src: "assets/work/action-sports-club/case-study/C-athletic-poster--mobile-hero.webp", width: 585, height: 1266, alt: "Direction C mobile hero: the teal duotone photo and 5.0 sticker on top, a teal location label, the stacked condensed headline and a full-width teal WhatsApp bar." },
          screens: [
            { name: "Hero", image: "desktop", kept: "Giant stacked headline on black, duotone photo on the right half, rotated 5.0 rating sticker.", dropped: ["Full-bleed duotone with overlaid headline: unreadable on mobile.", "Headline-only poster with marquee: no proof of the space."] },
            { name: "Dersler", src: "assets/work/action-sports-club/case-study/C-athletic-poster--desktop-dersler.webp", width: 1200, height: 1069, alt: "Direction C classes section: a colour-block grid of teal, black and white tiles with huge condensed class names, from Reformer Pilates to Yoga.", kept: "Colour-block tile grid (teal / black / white) with huge class names.", dropped: ["Giant marquee of class names: no descriptions.", "Weekly schedule board: needs a timetable, and we will not invent one."] },
            { name: "İletişim", src: "assets/work/action-sports-club/case-study/C-athletic-poster--desktop-iletisim.webp", width: 1200, height: 960, alt: "Direction C location section: opening hours as a large scoreboard with the weekday row in teal, a dark drawn map, and a four-cell contact row underneath.", kept: "Hours as a scoreboard (today highlighted), dark map, four-cell contact row.", dropped: ["Single address poster: no hours.", "Split map and hours: same content, less punch."] }
          ]
        }
      ],
      screensNote: "Each direction's kept variations were built in full. The dropped ones were sketched and rejected for the reasons given.",
      problem: {
        facts: [
          ["Business", "Boutique reformer pilates and functional training studio, Hüsrev Gerede Cd. No:84/1, Teşvikiye."],
          ["Proof it already has", "Google 5.0 from 283 reviews (12 Nov 2026), plus an active Instagram, @action.sportsclub."],
          ["What is missing", "No website. Classes, hours and how to book are spread across Instagram, the Google listing and directory pages."],
          ["How people book today", "Phone or WhatsApp, with reservation required in advance."],
          ["Competition seen", "A search for “Nişantaşı reformer pilates stüdyo” on 13 Nov 2026 returned five nearby studios with their own sites (Urban Health, V'Seras, Freya, 6 Pilates, Stylelife). Action Sports Club did not appear."]
        ],
        job: "Turn a Google or Instagram visitor into a WhatsApp message in one tap.",
        jobDetail: "To do that the site has to explain the six disciplines, show the room, prove quality with the rating, and make hours and location obvious. It must never invent prices, timetables, trainers or testimonials."
      },
      benchmarks: {
        method: "Loaded in headless Chrome at 1440 and 390 px on 13 Nov 2026.",
        rows: [
          { name: "Urban Health Pilates", where: "Teşvikiye", href: "https://urbanhealthpilates.com/", seen: "Sand background, all-monospace type, full-screen intro video before the site", booking: "“Rezervasyon yap” plus a floating WhatsApp button", lesson: "Locals respond to warm, Turkish-first premium. Never gate the offer behind an intro." },
          { name: "Freya Nişantaşı", where: "Nişantaşı", href: "https://freyanisantasi.com/", seen: "Lora serif with Manrope, green on white, real studio photo under a dark overlay", booking: "“Randevu al” button and a phone number", lesson: "A serif reads as care. A template layout and heavy overlay flatten the photo." },
          { name: "Beezone Studio", where: "Nişantaşı", href: "https://www.beezonestudio.com/", seen: "English-only, Helvetica caps, black-and-white stock photos", booking: "Contact form only; no tel or WhatsApp link found", lesson: "Monochrome looks premium cheaply. English-only and form-only lose local bookings." },
          { name: "MACFit", where: "", href: "https://www.macfit.com/", seen: "Barlow caps, red CTA, campaign hero “Burada kaybetmek yok!”", booking: "“Bize katıl” leading to membership sales", lesson: "The big-box look ASC must not resemble." },
          { name: "Psycle London", where: "", href: "https://www.psyclelondon.com/", seen: "Dark charcoal, lime accent, marquee strip, action photography", booking: "BUY and BOOK always in the header, full width on mobile", lesson: "Booking one tap away; class names as big tiles." },
          { name: "Third Space London", where: "", href: "https://www.thirdspace.london/", seen: "GT Sectra serif, dark interiors with light installations", booking: "“Join us” plus an enquiry form", lesson: "Sell the space, not models: exactly ASC's situation with one room photo." },
          { name: "Barry's", where: "", href: "https://www.barrys.com/", seen: "Antenna caps over a red-lit studio, “what to expect” section", booking: "“Book your first class” repeated in header, mid-page and footer", lesson: "One repeated first-step CTA, and reassurance for newcomers." },
          { name: "Equinox", where: "", href: "https://www.equinox.com/", seen: "Black, restrained, a two-CTA header; the hero was a Black Friday campaign that day", booking: "“Visit a club” or “Join today”", lesson: "Restraint and two clear actions." }
        ],
        notReviewed: "Not reviewed: 6 Pilates (HTTP 500 on both pages tried), V'Seras Studio (connection closed), Heartcore London (blocked by Cloudflare), and 1Rebel (only a location chooser loaded)."
      },
      brainstorm: {
        who: "Teşvikiye and Nişantaşı residents and office workers who train before work (06:00) or after it (until 22:00), split between pilates seekers and strength or HIIT seekers.",
        hmw: [
          "show it is premium without a single invented claim?",
          "make booking one tap on a phone?",
          "speak to pilates and functional-training clients on one page?",
          "make one 600×800 photo carry a whole site?"
        ],
        kept: [
          "WhatsApp as the primary CTA everywhere",
          "Live “today's hours / open now” from the published hours",
          "5.0 / 283 as the only proof, linked to Google",
          "A click-to-load map",
          "A sticky mobile booking bar",
          "One schema.org ExerciseGym block for local search"
        ],
        dropped: [
          ["Class timetable, pricing or packages, and trainer bios", "no verified data"],
          ["Review quotes", "not allowed to fabricate, and copying them needs consent"],
          ["Stock photos of people", "would misrepresent the studio"],
          ["A booking form", "the studio books by phone"]
        ],
        question: "Should the site match the room (dark), the neighbourhood (light, editorial) or the workout (loud)?"
      },
      evaluation: {
        note: "Scores are the designer's judgement after building all three directions, not user-test results.",
        criteria: [
          ["Clarity of offer", 5, 5, 4],
          ["Reservation CTA", 5, 4, 5],
          ["Local premium feel", 4, 5, 2],
          ["Mobile first screen", 4, 4, 5],
          ["Trust and proof", 5, 4, 5],
          ["Distinct from local rivals", 4, 2, 5],
          ["Works with one real photo", 5, 2, 4]
        ],
        totals: [32, 26, 30],
        measures: {
          title: "Measured on the builds: mobile page length",
          rows: [["A", 8090], ["B", 7000], ["C", 6960]],
          classTitle: "Class section alone, on mobile",
          classRows: [["A", 2410], ["B", 1700]],
          note: "That gap is why A borrows B's compact list."
        }
      },
      solution: {
        why: [
          "The photo is used as it is, so the site promises exactly the room people walk into.",
          "Teal comes from the studio's own ropes and kettlebells, so the brand colour is real.",
          "Dark and teal stands apart from the cream and green pilates sites around Teşvikiye.",
          "WhatsApp, phone, the 5.0 rating and today's hours are all on the first screen.",
          "It already exists in HTML and Figma, so refinement is fast."
        ],
        needs: [
          "On mobile the photo sits below the fold; add a short photo band above the headline.",
          "Six cards make a long mobile scroll; use B's numbered list layout below 720 px.",
          "It leans gym more than pilates; keep Reformer Pilates first and in the headline."
        ],
        how: "A visitor from Google or Instagram sees what the studio is (pilates and functional training in Nişantaşı), proof (5.0 from 283 reviews), when it is open (live hours) and how to book (one WhatsApp tap), all before scrolling. Every fact on the page comes from the public listings in the brief."
      }
    }
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
    media: [
      {"src": "assets/work/speaksynq/web/a-01.webp", "alt": "Speaksynq web screen: Landing · Welcome", "caption": "Landing · Welcome", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-02.webp", "alt": "Speaksynq web screen: How it works · 1 Listen", "caption": "How it works · 1 Listen", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-03.webp", "alt": "Speaksynq web screen: How it works · 2 Your turn", "caption": "How it works · 2 Your turn", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-04.webp", "alt": "Speaksynq web screen: How it works · 3 Your score", "caption": "How it works · 3 Your score", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-05.webp", "alt": "Speaksynq web screen: Microphone · Primer", "caption": "Microphone · Primer", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-06.webp", "alt": "Speaksynq web screen: Microphone · Chrome prompt", "caption": "Microphone · Chrome prompt", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-07.webp", "alt": "Speaksynq web screen: Microphone · Denied (re-enable)", "caption": "Microphone · Denied (re-enable)", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-08.webp", "alt": "Speaksynq web screen: First sentence · Listen", "caption": "First sentence · Listen", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-09.webp", "alt": "Speaksynq web screen: First sentence · Your turn", "caption": "First sentence · Your turn", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-10.webp", "alt": "Speaksynq web screen: First sentence · You’re speaking", "caption": "First sentence · You’re speaking", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-11.webp", "alt": "Speaksynq web screen: First sentence · Pass → practice", "caption": "First sentence · Pass → practice", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-12.webp", "alt": "Speaksynq web screen: Listen · Playing (word 2)", "caption": "Listen · Playing (word 2)", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-13.webp", "alt": "Speaksynq web screen: Listen · Playing (word 5)", "caption": "Listen · Playing (word 5)", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-14.webp", "alt": "Speaksynq web screen: Listen · Paused", "caption": "Listen · Paused", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-15.webp", "alt": "Speaksynq web screen: Your turn · Listening for you", "caption": "Your turn · Listening for you", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-16.webp", "alt": "Speaksynq web screen: Recording · You’re speaking (live level)", "caption": "Recording · You’re speaking (live level)", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-17.webp", "alt": "Speaksynq web screen: Recording · Auto-stop on silence", "caption": "Recording · Auto-stop on silence", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-18.webp", "alt": "Speaksynq web screen: Analysing", "caption": "Analysing", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-19.webp", "alt": "Speaksynq web screen: Score · Reveal (counting)", "caption": "Score · Reveal (counting)", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-20.webp", "alt": "Speaksynq web screen: Score · Reveal (final)", "caption": "Score · Reveal (final)", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-21.webp", "alt": "Speaksynq web screen: Feedback · Almost (72)", "caption": "Feedback · Almost (72)", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-22.webp", "alt": "Speaksynq web screen: Try again · Your turn (once more)", "caption": "Try again · Your turn (once more)", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-23.webp", "alt": "Speaksynq web screen: Feedback · Great", "caption": "Feedback · Great", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-24.webp", "alt": "Speaksynq web screen: Listen again · Replay", "caption": "Listen again · Replay", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-25.webp", "alt": "Speaksynq web screen: Shortcuts sheet (?)", "caption": "Shortcuts sheet (?)", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-26.webp", "alt": "Speaksynq web screen: Queue rail expanded (Q)", "caption": "Queue rail expanded (Q)", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/a-27.webp", "alt": "Speaksynq web screen: Session summary", "caption": "Session summary", "width": 1440, "height": 900, "group": "Web", "row": "A · Full journey · onboarding → mic → first sentence → practice loop"},
      {"src": "assets/work/speaksynq/web/b-01.webp", "alt": "Speaksynq web screen: Logged out · D → Sign in", "caption": "Logged out · D → Sign in", "width": 1440, "height": 900, "group": "Web", "row": "B · Report · logged out → sign in → plan check → paywall → report"},
      {"src": "assets/work/speaksynq/web/b-02.webp", "alt": "Speaksynq web screen: Signed in", "caption": "Signed in", "width": 1440, "height": 900, "group": "Web", "row": "B · Report · logged out → sign in → plan check → paywall → report"},
      {"src": "assets/work/speaksynq/web/b-03.webp", "alt": "Speaksynq web screen: Checking your plan", "caption": "Checking your plan", "width": 1440, "height": 900, "group": "Web", "row": "B · Report · logged out → sign in → plan check → paywall → report"},
      {"src": "assets/work/speaksynq/web/b-04.webp", "alt": "Speaksynq web screen: Free → Paywall", "caption": "Free → Paywall", "width": 1440, "height": 900, "group": "Web", "row": "B · Report · logged out → sign in → plan check → paywall → report"},
      {"src": "assets/work/speaksynq/web/b-05.webp", "alt": "Speaksynq web screen: Paywall · Monthly", "caption": "Paywall · Monthly", "width": 1440, "height": 900, "group": "Web", "row": "B · Report · logged out → sign in → plan check → paywall → report"},
      {"src": "assets/work/speaksynq/web/b-06.webp", "alt": "Speaksynq web screen: Payment · Processing", "caption": "Payment · Processing", "width": 1440, "height": 900, "group": "Web", "row": "B · Report · logged out → sign in → plan check → paywall → report"},
      {"src": "assets/work/speaksynq/web/b-07.webp", "alt": "Speaksynq web screen: Payment · Success", "caption": "Payment · Success", "width": 1440, "height": 900, "group": "Web", "row": "B · Report · logged out → sign in → plan check → paywall → report"},
      {"src": "assets/work/speaksynq/web/b-08.webp", "alt": "Speaksynq web screen: Report drawer · Words (Premium)", "caption": "Report drawer · Words (Premium)", "width": 1440, "height": 900, "group": "Web", "row": "B · Report · logged out → sign in → plan check → paywall → report"},
      {"src": "assets/work/speaksynq/web/b-09.webp", "alt": "Speaksynq web screen: Report drawer · Sounds", "caption": "Report drawer · Sounds", "width": 1440, "height": 900, "group": "Web", "row": "B · Report · logged out → sign in → plan check → paywall → report"},
      {"src": "assets/work/speaksynq/web/b-10.webp", "alt": "Speaksynq web screen: Word detail · “thought”", "caption": "Word detail · “thought”", "width": 1440, "height": 900, "group": "Web", "row": "B · Report · logged out → sign in → plan check → paywall → report"},
      {"src": "assets/work/speaksynq/web/b-11.webp", "alt": "Speaksynq web screen: Practice this sound · /θ/", "caption": "Practice this sound · /θ/", "width": 1440, "height": 900, "group": "Web", "row": "B · Report · logged out → sign in → plan check → paywall → report"},
      {"src": "assets/work/speaksynq/web/b-12.webp", "alt": "Speaksynq web screen: Report · Full page", "caption": "Report · Full page", "width": 1440, "height": 900, "group": "Web", "row": "B · Report · logged out → sign in → plan check → paywall → report"},
      {"src": "assets/work/speaksynq/web/c-01.webp", "alt": "Speaksynq web screen: Feedback · Almost (72)", "caption": "Feedback · Almost (72)", "width": 1440, "height": 900, "group": "Web", "row": "C · Report · logged in (Free) → plan check → paywall → checkout states"},
      {"src": "assets/work/speaksynq/web/c-02.webp", "alt": "Speaksynq web screen: Checking your plan", "caption": "Checking your plan", "width": 1440, "height": 900, "group": "Web", "row": "C · Report · logged in (Free) → plan check → paywall → checkout states"},
      {"src": "assets/work/speaksynq/web/c-03.webp", "alt": "Speaksynq web screen: Free → Paywall", "caption": "Free → Paywall", "width": 1440, "height": 900, "group": "Web", "row": "C · Report · logged in (Free) → plan check → paywall → checkout states"},
      {"src": "assets/work/speaksynq/web/c-04.webp", "alt": "Speaksynq web screen: Payment · Processing", "caption": "Payment · Processing", "width": 1440, "height": 900, "group": "Web", "row": "C · Report · logged in (Free) → plan check → paywall → checkout states"},
      {"src": "assets/work/speaksynq/web/c-05.webp", "alt": "Speaksynq web screen: Payment · Failed", "caption": "Payment · Failed", "width": 1440, "height": 900, "group": "Web", "row": "C · Report · logged in (Free) → plan check → paywall → checkout states"},
      {"src": "assets/work/speaksynq/web/c-06.webp", "alt": "Speaksynq web screen: Payment · Cancelled", "caption": "Payment · Cancelled", "width": 1440, "height": 900, "group": "Web", "row": "C · Report · logged in (Free) → plan check → paywall → checkout states"},
      {"src": "assets/work/speaksynq/web/d-01.webp", "alt": "Speaksynq web screen: Listen · Playing (word 2)", "caption": "Listen · Playing (word 2)", "width": 1440, "height": 900, "group": "Web", "row": "D · Avatar menu & settings"},
      {"src": "assets/work/speaksynq/web/d-02.webp", "alt": "Speaksynq web screen: Settings · Subscription (Free)", "caption": "Settings · Subscription (Free)", "width": 1440, "height": 900, "group": "Web", "row": "D · Avatar menu & settings"},
      {"src": "assets/work/speaksynq/web/d-03.webp", "alt": "Speaksynq web screen: Settings · Notifications", "caption": "Settings · Notifications", "width": 1440, "height": 900, "group": "Web", "row": "D · Avatar menu & settings"},
      {"src": "assets/work/speaksynq/web/d-04.webp", "alt": "Speaksynq web screen: Settings · Appearance", "caption": "Settings · Appearance", "width": 1440, "height": 900, "group": "Web", "row": "D · Avatar menu & settings"},
      {"src": "assets/work/speaksynq/web/d-05.webp", "alt": "Speaksynq web screen: Settings · Privacy", "caption": "Settings · Privacy", "width": 1440, "height": 900, "group": "Web", "row": "D · Avatar menu & settings"},
      {"src": "assets/work/speaksynq/web/d-06.webp", "alt": "Speaksynq web screen: Settings · Delete account", "caption": "Settings · Delete account", "width": 1440, "height": 900, "group": "Web", "row": "D · Avatar menu & settings"},
      {"src": "assets/work/speaksynq/web/d-07.webp", "alt": "Speaksynq web screen: Premium gate (Free)", "caption": "Premium gate (Free)", "width": 1440, "height": 900, "group": "Web", "row": "D · Avatar menu & settings"},
      {"src": "assets/work/speaksynq/web/e-01.webp", "alt": "Speaksynq web screen: Progress · Dashboard", "caption": "Progress · Dashboard", "width": 1440, "height": 1440, "group": "Web", "row": "E · Progress & My Content"},
      {"src": "assets/work/speaksynq/web/e-02.webp", "alt": "Speaksynq web screen: History · Sorted by score", "caption": "History · Sorted by score", "width": 1440, "height": 900, "group": "Web", "row": "E · Progress & My Content"},
      {"src": "assets/work/speaksynq/web/e-03.webp", "alt": "Speaksynq web screen: Session detail", "caption": "Session detail", "width": 1440, "height": 900, "group": "Web", "row": "E · Progress & My Content"},
      {"src": "assets/work/speaksynq/web/e-04.webp", "alt": "Speaksynq web screen: Library · Grid", "caption": "Library · Grid", "width": 1440, "height": 900, "group": "Web", "row": "E · Progress & My Content"},
      {"src": "assets/work/speaksynq/web/e-05.webp", "alt": "Speaksynq web screen: Paste a link", "caption": "Paste a link", "width": 1440, "height": 900, "group": "Web", "row": "E · Progress & My Content"},
      {"src": "assets/work/speaksynq/web/e-06.webp", "alt": "Speaksynq web screen: Link · Preview", "caption": "Link · Preview", "width": 1440, "height": 900, "group": "Web", "row": "E · Progress & My Content"},
      {"src": "assets/work/speaksynq/web/e-07.webp", "alt": "Speaksynq web screen: Processing", "caption": "Processing", "width": 1440, "height": 900, "group": "Web", "row": "E · Progress & My Content"},
      {"src": "assets/work/speaksynq/web/e-08.webp", "alt": "Speaksynq web screen: Segment editor", "caption": "Segment editor", "width": 1440, "height": 900, "group": "Web", "row": "E · Progress & My Content"},
      {"src": "assets/work/speaksynq/web/e-09.webp", "alt": "Speaksynq web screen: Practise My Content", "caption": "Practise My Content", "width": 1440, "height": 900, "group": "Web", "row": "E · Progress & My Content"},
      {"src": "assets/work/speaksynq/mobile/m0-01.webp", "alt": "Speaksynq mobile screen: Welcome", "caption": "Welcome", "width": 393, "height": 852, "group": "Mobile", "row": "Onboarding (simplified)"},
      {"src": "assets/work/speaksynq/mobile/m0-02.webp", "alt": "Speaksynq mobile screen: How it works · 1 Listen", "caption": "How it works · 1 Listen", "width": 393, "height": 852, "group": "Mobile", "row": "Onboarding (simplified)"},
      {"src": "assets/work/speaksynq/mobile/m0-03.webp", "alt": "Speaksynq mobile screen: How it works · 2 Your turn", "caption": "How it works · 2 Your turn", "width": 393, "height": 852, "group": "Mobile", "row": "Onboarding (simplified)"},
      {"src": "assets/work/speaksynq/mobile/m0-04.webp", "alt": "Speaksynq mobile screen: How it works · 3 Your score", "caption": "How it works · 3 Your score", "width": 393, "height": 852, "group": "Mobile", "row": "Onboarding (simplified)"},
      {"src": "assets/work/speaksynq/mobile/m0-05.webp", "alt": "Speaksynq mobile screen: Microphone · Primer", "caption": "Microphone · Primer", "width": 393, "height": 852, "group": "Mobile", "row": "Onboarding (simplified)"},
      {"src": "assets/work/speaksynq/mobile/m0-06.webp", "alt": "Speaksynq mobile screen: Microphone · System dialog", "caption": "Microphone · System dialog", "width": 393, "height": 852, "group": "Mobile", "row": "Onboarding (simplified)"},
      {"src": "assets/work/speaksynq/mobile/m0-07.webp", "alt": "Speaksynq mobile screen: Microphone · Denied", "caption": "Microphone · Denied", "width": 393, "height": 852, "group": "Mobile", "row": "Onboarding (simplified)"},
      {"src": "assets/work/speaksynq/mobile/m0-08.webp", "alt": "Speaksynq mobile screen: First sentence · Listen", "caption": "First sentence · Listen", "width": 393, "height": 852, "group": "Mobile", "row": "Onboarding (simplified)"},
      {"src": "assets/work/speaksynq/mobile/m0-09.webp", "alt": "Speaksynq mobile screen: First sentence · Your turn", "caption": "First sentence · Your turn", "width": 393, "height": 852, "group": "Mobile", "row": "Onboarding (simplified)"},
      {"src": "assets/work/speaksynq/mobile/m0-10.webp", "alt": "Speaksynq mobile screen: First sentence · You’re speaking", "caption": "First sentence · You’re speaking", "width": 393, "height": 852, "group": "Mobile", "row": "Onboarding (simplified)"},
      {"src": "assets/work/speaksynq/mobile/m0-11.webp", "alt": "Speaksynq mobile screen: First sentence · Pass → practice", "caption": "First sentence · Pass → practice", "width": 393, "height": 852, "group": "Mobile", "row": "Onboarding (simplified)"},
      {"src": "assets/work/speaksynq/mobile/m1-01.webp", "alt": "Speaksynq mobile screen: Onboarding · Mic check (pass → first sentence starts)", "caption": "Onboarding · Mic check (pass → first sentence starts)", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 1 · Mic check → practice → score → feedback"},
      {"src": "assets/work/speaksynq/mobile/m1-02.webp", "alt": "Speaksynq mobile screen: Listen · Audio loading", "caption": "Listen · Audio loading", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 1 · Mic check → practice → score → feedback"},
      {"src": "assets/work/speaksynq/mobile/m1-03.webp", "alt": "Speaksynq mobile screen: Listen · Playing (word 2)", "caption": "Listen · Playing (word 2)", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 1 · Mic check → practice → score → feedback"},
      {"src": "assets/work/speaksynq/mobile/m1-04.webp", "alt": "Speaksynq mobile screen: Listen · Playing (word 5)", "caption": "Listen · Playing (word 5)", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 1 · Mic check → practice → score → feedback"},
      {"src": "assets/work/speaksynq/mobile/m1-05.webp", "alt": "Speaksynq mobile screen: Your turn · Mic appears", "caption": "Your turn · Mic appears", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 1 · Mic check → practice → score → feedback"},
      {"src": "assets/work/speaksynq/mobile/m1-06.webp", "alt": "Speaksynq mobile screen: Your turn · Listening for you", "caption": "Your turn · Listening for you", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 1 · Mic check → practice → score → feedback"},
      {"src": "assets/work/speaksynq/mobile/m1-07.webp", "alt": "Speaksynq mobile screen: Recording · You’re speaking", "caption": "Recording · You’re speaking", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 1 · Mic check → practice → score → feedback"},
      {"src": "assets/work/speaksynq/mobile/m1-08.webp", "alt": "Speaksynq mobile screen: Recording · Letter missed (thrown)", "caption": "Recording · Letter missed (thrown)", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 1 · Mic check → practice → score → feedback"},
      {"src": "assets/work/speaksynq/mobile/m1-09.webp", "alt": "Speaksynq mobile screen: Silence · Auto-stop", "caption": "Silence · Auto-stop", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 1 · Mic check → practice → score → feedback"},
      {"src": "assets/work/speaksynq/mobile/m1-10.webp", "alt": "Speaksynq mobile screen: Analysing", "caption": "Analysing", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 1 · Mic check → practice → score → feedback"},
      {"src": "assets/work/speaksynq/mobile/m1-11.webp", "alt": "Speaksynq mobile screen: Reveal · Start (0)", "caption": "Reveal · Start (0)", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 1 · Mic check → practice → score → feedback"},
      {"src": "assets/work/speaksynq/mobile/m1-12.webp", "alt": "Speaksynq mobile screen: Reveal · Counting (54)", "caption": "Reveal · Counting (54)", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 1 · Mic check → practice → score → feedback"},
      {"src": "assets/work/speaksynq/mobile/m1-13.webp", "alt": "Speaksynq mobile screen: Reveal · Final (91)", "caption": "Reveal · Final (91)", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 1 · Mic check → practice → score → feedback"},
      {"src": "assets/work/speaksynq/mobile/m1-14.webp", "alt": "Speaksynq mobile screen: Feedback · Great (91)", "caption": "Feedback · Great (91)", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 1 · Mic check → practice → score → feedback"},
      {"src": "assets/work/speaksynq/mobile/m1-15.webp", "alt": "Speaksynq mobile screen: Try again · Your turn (once more)", "caption": "Try again · Your turn (once more)", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 1 · Mic check → practice → score → feedback"},
      {"src": "assets/work/speaksynq/mobile/m1-16.webp", "alt": "Speaksynq mobile screen: Listen again · Replay", "caption": "Listen again · Replay", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 1 · Mic check → practice → score → feedback"},
      {"src": "assets/work/speaksynq/mobile/m2-01.webp", "alt": "Speaksynq mobile screen: Sign-in sheet · Default", "caption": "Sign-in sheet · Default", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 2 · Detailed Report · logged out → sign in → paywall → report"},
      {"src": "assets/work/speaksynq/mobile/m2-02.webp", "alt": "Speaksynq mobile screen: Apple · Signing in", "caption": "Apple · Signing in", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 2 · Detailed Report · logged out → sign in → paywall → report"},
      {"src": "assets/work/speaksynq/mobile/m2-03.webp", "alt": "Speaksynq mobile screen: Paywall · Yearly (trial)", "caption": "Paywall · Yearly (trial)", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 2 · Detailed Report · logged out → sign in → paywall → report"},
      {"src": "assets/work/speaksynq/mobile/m2-04.webp", "alt": "Speaksynq mobile screen: Purchase · Processing", "caption": "Purchase · Processing", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 2 · Detailed Report · logged out → sign in → paywall → report"},
      {"src": "assets/work/speaksynq/mobile/m2-05.webp", "alt": "Speaksynq mobile screen: Purchase · Success", "caption": "Purchase · Success", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 2 · Detailed Report · logged out → sign in → paywall → report"},
      {"src": "assets/work/speaksynq/mobile/m2-06.webp", "alt": "Speaksynq mobile screen: Report · Words", "caption": "Report · Words", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 2 · Detailed Report · logged out → sign in → paywall → report"},
      {"src": "assets/work/speaksynq/mobile/m2-07.webp", "alt": "Speaksynq mobile screen: Purchase · Cancelled", "caption": "Purchase · Cancelled", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 2 · Detailed Report · logged out → sign in → paywall → report"},
      {"src": "assets/work/speaksynq/mobile/m3-01.webp", "alt": "Speaksynq mobile screen: Feedback · Fair (72) · letters", "caption": "Feedback · Fair (72) · letters", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 3 · Detailed Report · logged in, Free"},
      {"src": "assets/work/speaksynq/mobile/m3-02.webp", "alt": "Speaksynq mobile screen: Checking premium", "caption": "Checking premium", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 3 · Detailed Report · logged in, Free"},
      {"src": "assets/work/speaksynq/mobile/m3-03.webp", "alt": "Speaksynq mobile screen: Paywall · Monthly", "caption": "Paywall · Monthly", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 3 · Detailed Report · logged in, Free"},
      {"src": "assets/work/speaksynq/mobile/m4-01.webp", "alt": "Speaksynq mobile screen: Avatar states (on practice)", "caption": "Avatar states (on practice)", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 4 · Avatar → account, progress, My Content"},
      {"src": "assets/work/speaksynq/mobile/m4-02.webp", "alt": "Speaksynq mobile screen: Progress · Overview", "caption": "Progress · Overview", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 4 · Avatar → account, progress, My Content"},
      {"src": "assets/work/speaksynq/mobile/m4-03.webp", "alt": "Speaksynq mobile screen: Activity · Bars & heatmap", "caption": "Activity · Bars & heatmap", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 4 · Avatar → account, progress, My Content"},
      {"src": "assets/work/speaksynq/mobile/m4-04.webp", "alt": "Speaksynq mobile screen: History", "caption": "History", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 4 · Avatar → account, progress, My Content"},
      {"src": "assets/work/speaksynq/mobile/m4-05.webp", "alt": "Speaksynq mobile screen: Session detail", "caption": "Session detail", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 4 · Avatar → account, progress, My Content"},
      {"src": "assets/work/speaksynq/mobile/m4-06.webp", "alt": "Speaksynq mobile screen: Weakest sounds", "caption": "Weakest sounds", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 4 · Avatar → account, progress, My Content"},
      {"src": "assets/work/speaksynq/mobile/m4-07.webp", "alt": "Speaksynq mobile screen: Premium gate (Free user)", "caption": "Premium gate (Free user)", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 4 · Avatar → account, progress, My Content"},
      {"src": "assets/work/speaksynq/mobile/m4-08.webp", "alt": "Speaksynq mobile screen: Paywall · Feature gate (My Content)", "caption": "Paywall · Feature gate (My Content)", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 4 · Avatar → account, progress, My Content"},
      {"src": "assets/work/speaksynq/mobile/m4-09.webp", "alt": "Speaksynq mobile screen: Subscription · Free", "caption": "Subscription · Free", "width": 393, "height": 852, "group": "Mobile", "row": "Flow 4 · Avatar → account, progress, My Content"},
      {"src": "assets/work/speaksynq/system/foundations.webp", "alt": "Speaksynq design system foundations: colour tokens, type scale, spacing, radius and motion tokens", "caption": "Foundations", "width": 2200, "height": 1830, "group": "Design system", "row": "Foundations & colour", "kind": "board"},
      {"src": "assets/work/speaksynq/system/color-dark-light.webp", "alt": "Semantic colour tokens in dark and light mode, with contrast ratios", "caption": "Colour · Dark vs Light", "width": 1660, "height": 1440, "group": "Design system", "row": "Foundations & colour", "kind": "board"},
      {"src": "assets/work/speaksynq/system/button.webp", "alt": "Speaksynq component: Button", "caption": "Button", "width": 746, "height": 120, "group": "Design system", "row": "Components", "kind": "component"},
      {"src": "assets/work/speaksynq/system/orb.webp", "alt": "Speaksynq component: Orb", "caption": "Orb", "width": 616, "height": 184, "group": "Design system", "row": "Components", "kind": "component"},
      {"src": "assets/work/speaksynq/system/word-token.webp", "alt": "Speaksynq component: Word Token", "caption": "Word Token", "width": 644, "height": 184, "group": "Design system", "row": "Components", "kind": "component"},
      {"src": "assets/work/speaksynq/system/score.webp", "alt": "Speaksynq component: Score", "caption": "Score", "width": 712, "height": 408, "group": "Design system", "row": "Components", "kind": "component"},
      {"src": "assets/work/speaksynq/system/tip.webp", "alt": "Speaksynq component: Tip", "caption": "Tip", "width": 489, "height": 412, "group": "Design system", "row": "Components", "kind": "component"},
      {"src": "assets/work/speaksynq/system/list-row.webp", "alt": "Speaksynq component: List Row", "caption": "List Row", "width": 329, "height": 56, "group": "Design system", "row": "Components", "kind": "component"},
      {"src": "assets/work/speaksynq/system/sound-chip.webp", "alt": "Speaksynq component: Sound Chip", "caption": "Sound Chip", "width": 226, "height": 100, "group": "Design system", "row": "Components", "kind": "component"},
      {"src": "assets/work/speaksynq/system/audio-pill.webp", "alt": "Speaksynq component: Audio Pill", "caption": "Audio Pill", "width": 274, "height": 100, "group": "Design system", "row": "Components", "kind": "component"},
      {"src": "assets/work/speaksynq/system/level-bars.webp", "alt": "Speaksynq component: Level Bars", "caption": "Level Bars", "width": 405, "height": 231, "group": "Design system", "row": "Components", "kind": "component"},
      {"src": "assets/work/speaksynq/system/set-ring.webp", "alt": "Speaksynq component: Set Ring", "caption": "Set Ring", "width": 464, "height": 252, "group": "Design system", "row": "Components", "kind": "component"},
      {"src": "assets/work/speaksynq/system/wave-strip.webp", "alt": "Speaksynq component: Wave Strip", "caption": "Wave Strip", "width": 409, "height": 560, "group": "Design system", "row": "Components", "kind": "component"},
      {"src": "assets/work/speaksynq/system/information-architecture.webp", "alt": "Information architecture map of the Speaksynq app", "caption": "Information architecture & navigation", "width": 1600, "height": 1038, "group": "System design", "row": "Architecture & flows", "kind": "board"},
      {"src": "assets/work/speaksynq/system/user-journey.webp", "alt": "User journey diagram with the main flows and decision points", "caption": "User journey · main flows", "width": 1600, "height": 1464, "group": "System design", "row": "Architecture & flows", "kind": "board"}
    ]
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
