(function () {
  "use strict";
  var D = document;
  var root = D.documentElement;
  var projects = window.PROJECTS || [];
  var CATS = { digital: "Digital product", visual: "Visual & content", engineering: "Engineering study" };
  var SECTIONS = [
    { key: "digital", label: "Digital products" },
    { key: "visual", label: "Visual & content" },
    { key: "engineering", label: "Engineering studies" }
  ];
  // Sticky-note palette for projects: bright enough to lead, soft enough for the dark file.
  var PALETTE = ["yellow", "pink", "mint", "lavender", "peach", "sky"];

  var projectView = D.getElementById("project-view");
  var pcVp = D.getElementById("pc-viewport");
  var pcWorld = D.getElementById("pc-world");
  var pcCrumb = D.getElementById("pv-crumb");
  var pvBackLabel = D.getElementById("pv-back-label");
  var backBtn = D.getElementById("pv-back");
  var pcCsBtn = D.getElementById("pc-cs-btn");
  var pcZoom = D.getElementById("pc-zoom");
  var sheet = D.getElementById("cs-sheet");
  var sheetBar = D.getElementById("cs-sheet-bar");
  var lb = D.getElementById("lightbox");
  var lbBody = D.getElementById("lb-body");
  var lbTitle = D.getElementById("lb-title");
  var lbCount = D.getElementById("lb-count");
  var canvasEl = D.getElementById("canvas");
  var vp = D.getElementById("cv-viewport");
  var world = D.getElementById("cv-world");
  var boardsEl = D.getElementById("cv-boards");
  var hud = D.getElementById("hud");
  var hint = D.getElementById("cv-hint");
  var listView = D.getElementById("list-view");
  var topbar = D.getElementById("topbar");
  var reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

  var current = null;      // open project slug
  var frames = [];         // media of the open project (lightbox order)
  var frame = 0;
  var broken = {};

  var ICON = {
    prev: '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M13 8H3M7.5 3.5 3 8l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
    next: '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
    expand: '<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
    star: '<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M8 1.5l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.3l-3.8 2 .7-4.3-3.1-3 4.3-.6z" fill="currentColor"/></svg>'
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pad(n) { return String(n).padStart(2, "0"); }
  function bySlug(slug) {
    for (var i = 0; i < projects.length; i++) if (projects[i].slug === slug) return projects[i];
    return null;
  }
  function mediaOf(p) {
    return (p.media || []).filter(function (m) { return m && m.src && !broken[m.src]; });
  }
  function isPhone(m) { return m.width && Number(m.width) <= 500; }
  function behavior() { return reduceMQ.matches ? "auto" : "smooth"; }
  function reduced() { return reduceMQ.matches; }
  function hash(str) { var h = 0; for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0; return Math.abs(h); }

  // Project order = category order; colour cycles through the palette in that order.
  var ORDER = [];
  SECTIONS.forEach(function (s) {
    projects.forEach(function (p) { if (p.category === s.key) ORDER.push(p.slug); });
  });
  ORDER.forEach(function (slug, i) {
    var p = bySlug(slug);
    p.no = pad(i + 1);
    p.color = PALETTE[i % PALETTE.length];
    p.tilt = ((hash(slug) % 50) / 10 - 2.5).toFixed(2);       // stable -2.5° … +2.5°
  });
  function tagOf(p) { return p.context || CATS[p.category]; }

  /* ================= Lightbox (artboards of the open project) ================= */
  function frameHTML(m) {
    var dims = (m.width ? ' width="' + esc(m.width) + '"' : "") + (m.height ? ' height="' + esc(m.height) + '"' : "");
    var img = '<img src="' + esc(m.src) + '" alt="' + esc(m.alt) + '"' + dims + ' decoding="async" draggable="false">';
    return isPhone(m) ? '<div class="phone"><div class="phone-screen">' + img + "</div></div>" : img;
  }
  var lbFrom = null;       // element to refocus when the lightbox closes
  function renderLightbox() {
    if (lbCase) return;
    var m = frames[frame]; if (!m) return;
    var p = bySlug(current);
    lbTitle.innerHTML = esc(p.title) + (m.caption ? ' <span>' + esc(m.caption) + "</span>" : "");
    lbCount.textContent = pad(frame + 1) + " / " + pad(frames.length);
    lb.classList.toggle("is-single", frames.length < 2);
    lbBody.innerHTML = '<figure class="lb-frame' + (isPhone(m) ? " is-phone" : "") + '">' + frameHTML(m) + "</figure>";
    lbBody.scrollTop = 0;
  }
  function openLightbox(i, from) {
    if (!frames.length || !lb.showModal) return;
    lbCase = null; lbFrom = from || null;
    frame = Math.max(0, Math.min(frames.length - 1, i));
    lb.classList.remove("is-single");
    renderLightbox();
    root.classList.add("lb-open");
    lb.showModal();
    D.getElementById("lb-close").focus();
  }
  function step(d) { if (frames.length > 1 && !lbCase) { frame = (frame + d + frames.length) % frames.length; renderLightbox(); } }
  lb.addEventListener("close", function () {
    root.classList.remove("lb-open");
    var b = lbCase ? lbCase.btn : lbFrom;
    lbCase = null; lbFrom = null;
    if (b && b.isConnected) b.focus({ preventScroll: true });
  });
  lb.addEventListener("click", function (e) {
    var s = e.target.closest("[data-step]");
    if (s) { step(Number(s.dataset.step)); return; }
    if (e.target.closest("#lb-close")) { lb.close(); return; }
    if (e.target === lbBody || e.target === lb || e.target.classList.contains("lb-frame")) lb.close();
  });
  lb.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); step(e.key === "ArrowLeft" ? -1 : 1); }
  });

  /* ================= Case study (only for projects with `caseStudy`) ================= */
  var caseEl = D.getElementById("case-study");
  var csZoom = [];         // images in the case study that open in the lightbox
  var lbCase = null;       // { btn } while the lightbox shows a case-study image
  var HEX = /^#[0-9a-f]{6}$/i;
  var CS_TICK = '<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
  var CS_CROSS = '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';

  function csImg(m, caption, cls, narrow) {
    var i = csZoom.push({ src: m.src, alt: m.alt, caption: caption, width: m.width, height: m.height, narrow: !!narrow }) - 1;
    return '<button type="button" class="cs-zoom' + (cls ? " " + cls : "") + '" data-z="' + i + '" aria-label="Expand image: ' + esc(caption) + '">' +
      '<img src="' + esc(m.src) + '" alt="' + esc(m.alt) + '" width="' + esc(m.width) + '" height="' + esc(m.height) + '" loading="lazy" decoding="async" draggable="false">' +
      '<span class="cs-zoom-ico" aria-hidden="true">' + ICON.expand + "</span></button>";
  }
  function csHead(no, title, id) {
    return '<header class="cs-sec-head"><span class="cs-no" aria-hidden="true">' + no + '</span><h3 class="cs-h" id="' + id + '-t">' + esc(title) + "</h3></header>";
  }
  function csList(arr, cls) {
    return '<ul class="' + cls + '">' + arr.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>";
  }
  function csTabs(group, dirs, label) {
    return '<div class="cs-tabs" role="tablist" aria-label="' + esc(label) + '">' + dirs.map(function (d, i) {
      return '<button type="button" role="tab" class="cs-tab" id="' + group + "-tab-" + esc(d.key) + '" aria-controls="' + group + "-panel-" + esc(d.key) + '"' +
        ' aria-selected="' + (i === 0 ? "true" : "false") + '" tabindex="' + (i === 0 ? "0" : "-1") + '">' +
        '<span class="cs-tab-key">' + esc(d.key) + '</span><span class="cs-tab-name">' + esc(d.name) + "</span>" +
        '<span class="cs-tab-score">' + esc(d.score) + "<small>/35</small></span></button>";
    }).join("") + "</div>";
  }
  function csPanel(group, d, i, inner) {
    return '<div class="cs-panel" role="tabpanel" id="' + group + "-panel-" + esc(d.key) + '" aria-labelledby="' + group + "-tab-" + esc(d.key) + '" data-dir="' + esc(d.key) + '"' + (i === 0 ? "" : " hidden") + ">" + inner + "</div>";
  }
  function dots(n) {
    var s = '<span class="cs-dots" aria-hidden="true">';
    for (var k = 1; k <= 5; k++) s += '<i class="' + (k <= n ? "on" : "") + '"></i>';
    return s + "</span>";
  }
  function bars(rows, max) {
    return '<ul class="cs-bars">' + rows.map(function (r) {
      return '<li data-dir="' + esc(r[0]) + '"><span class="cs-bar-k">' + esc(r[0]) + '</span><span class="cs-bar-track"><span class="cs-bar" style="width:' + (100 * r[1] / max).toFixed(1) + '%"></span></span>' +
        '<span class="cs-bar-v">≈ ' + esc(Number(r[1]).toLocaleString("en-US")) + " px</span></li>";
    }).join("") + "</ul>";
  }

  function renderCase(p) {
    var cs = p.caseStudy;
    csZoom = [];
    if (!cs) { caseEl.hidden = true; caseEl.innerHTML = ""; return; }
    var dec = cs.decision, dirs = cs.directions || [], pr = cs.problem, bm = cs.benchmarks, bs = cs.brainstorm, ev = cs.evaluation, so = cs.solution;
    var toc = [["cs-decision", "Decision"], ["cs-directions", "Directions"], ["cs-problem", "Problem"], ["cs-bench", "Benchmarks"], ["cs-brainstorm", "Brainstorm"], ["cs-screens", "Variations"], ["cs-eval", "Evaluation"], ["cs-solution", "Solution"]];
    var maxLen = Math.max.apply(null, ev.measures.rows.map(function (r) { return r[1]; }));

    caseEl.innerHTML =
      '<header class="cs-intro">' +
        '<p class="cs-kicker"><span>Case study</span>' + esc(p.context || "") + "</p>" +
        '<h2 class="cs-title" id="cs-title" tabindex="-1">' + esc(cs.title) + "</h2>" +
        '<p class="cs-lede">' + esc(cs.lede) + "</p>" +
        '<p class="cs-disclaimer"><span class="cs-dot" aria-hidden="true"></span>' + esc(cs.disclaimer) + "</p>" +
        '<nav class="cs-toc" aria-label="Case study sections">' + toc.map(function (t, i) {
          return '<a href="#' + t[0] + '" data-jump="' + t[0] + '"><span>' + pad(i + 1) + "</span>" + esc(t[1]) + "</a>";
        }).join("") + "</nav>" +
      "</header>" +

      /* 01 Decision */
      '<section class="cs-sec" id="cs-decision" aria-labelledby="cs-decision-t">' +
        csHead("01", "Decision", "cs-decision") +
        '<div class="cs-decision">' +
          '<div class="cs-score"><span class="cs-score-n">' + esc(dec.score) + '</span><span class="cs-score-of">/' + esc(dec.outOf) + '</span><span class="cs-score-l">Direction A · Dark industrial</span></div>' +
          '<div class="cs-decision-body">' +
            '<p class="cs-eyebrow">Recommendation</p>' +
            '<p class="cs-callout">' + esc(dec.title) + "</p>" +
            '<p class="cs-p">' + esc(dec.text) + "</p>" +
            '<p class="cs-sub">' + esc(dec.refinementsLabel) + "</p>" +
            '<ol class="cs-refine">' + dec.refinements.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ol>" +
          "</div>" +
          '<ul class="cs-others">' + dec.others.map(function (o) {
            return '<li><span class="cs-other-k">' + esc(o.key) + '</span><span class="cs-other-s">' + esc(o.score) + "<small>/35</small></span><p>" + esc(o.text) + "</p></li>";
          }).join("") + "</ul>" +
        "</div>" +
      "</section>" +

      /* 02 Directions */
      '<section class="cs-sec" id="cs-directions" aria-labelledby="cs-directions-t">' +
        csHead("02", "Three directions", "cs-directions") +
        '<figure class="cs-fig cs-fig-wide">' + csImg(cs.compare[0], cs.compare[0].caption) + "<figcaption>" + esc(cs.compare[0].caption) + "</figcaption></figure>" +
        '<div class="cs-compare-row">' +
          '<figure class="cs-fig">' + csImg(cs.compare[1], cs.compare[1].caption) + "<figcaption>" + esc(cs.compare[1].caption) + "</figcaption></figure>" +
          '<div class="cs-question"><p class="cs-eyebrow">The visual question</p><p class="cs-quote">' + esc(bs.question) + "</p>" +
          '<p class="cs-mini">One real studio photo, three treatments.</p></div>' +
        "</div>" +
        '<div class="cs-switch">' +
          csTabs("csd", dirs, "Design directions") +
          dirs.map(function (d, i) {
            return csPanel("csd", d, i,
              '<div class="cs-dir">' +
                '<figure class="cs-fig cs-dir-desk">' + csImg(d.desktop, d.key + " · " + d.name + " — desktop") + "<figcaption>Desktop · 1440 px</figcaption></figure>" +
                '<figure class="cs-fig cs-dir-mob">' + csImg(d.mobile, d.key + " · " + d.name + " — mobile", "is-mobile", true) + "<figcaption>Mobile · 390 px</figcaption></figure>" +
                '<div class="cs-dir-info">' +
                  (d.recommended ? '<p class="cs-chip">Recommended</p>' : "") +
                  '<p class="cs-dir-idea">' + esc(d.idea) + "</p>" +
                  '<p class="cs-swatches" aria-hidden="true">' + (d.swatches || []).filter(function (h) { return HEX.test(h); }).map(function (h) {
                    return '<span style="background:' + h + '" title="' + h + '"></span>';
                  }).join("") + "</p>" +
                  '<dl class="cs-facts">' + d.facts.map(function (f) { return "<div><dt>" + esc(f[0]) + "</dt><dd>" + esc(f[1]) + "</dd></div>"; }).join("") + "</dl>" +
                "</div>" +
              "</div>");
          }).join("") +
        "</div>" +
      "</section>" +

      /* 03 Problem */
      '<section class="cs-sec" id="cs-problem" aria-labelledby="cs-problem-t">' +
        csHead("03", "Problem and opportunity", "cs-problem") +
        '<div class="cs-two">' +
          '<dl class="cs-facts cs-facts-lg">' + pr.facts.map(function (f) { return "<div><dt>" + esc(f[0]) + "</dt><dd>" + esc(f[1]) + "</dd></div>"; }).join("") + "</dl>" +
          '<div class="cs-job"><p class="cs-eyebrow">The site\u2019s job is narrow</p><p class="cs-quote">' + esc(pr.job) + '</p><p class="cs-p">' + esc(pr.jobDetail) + "</p></div>" +
        "</div>" +
      "</section>" +

      /* 04 Benchmarks */
      '<section class="cs-sec" id="cs-bench" aria-labelledby="cs-bench-t">' +
        csHead("04", "Benchmarks", "cs-bench") +
        '<p class="cs-mini cs-method">' + esc(bm.method) + "</p>" +
        '<div class="cs-table-wrap"><table class="cs-table cs-bench">' +
          '<thead><tr><th scope="col">Site</th><th scope="col">What we saw</th><th scope="col">Booking</th><th scope="col">Takeaway for ASC</th></tr></thead><tbody>' +
          bm.rows.map(function (r) {
            return '<tr><th scope="row"><a href="' + esc(r.href) + '" target="_blank" rel="noopener">' + esc(r.name) + " ↗</a>" + (r.where ? "<small>" + esc(r.where) + "</small>" : "") + "</th>" +
              '<td data-l="What we saw">' + esc(r.seen) + '</td><td data-l="Booking">' + esc(r.booking) + '</td><td data-l="Takeaway" class="cs-take">' + esc(r.lesson) + "</td></tr>";
          }).join("") +
        "</tbody></table></div>" +
        '<p class="cs-mini">' + esc(bm.notReviewed) + "</p>" +
      "</section>" +

      /* 05 Brainstorm */
      '<section class="cs-sec" id="cs-brainstorm" aria-labelledby="cs-brainstorm-t">' +
        csHead("05", "Brainstorm", "cs-brainstorm") +
        '<div class="cs-grid4">' +
          '<div class="cs-card"><p class="cs-eyebrow">Who visits</p><p class="cs-p">' + esc(bs.who) + "</p></div>" +
          '<div class="cs-card"><p class="cs-eyebrow">How might we…</p>' + csList(bs.hmw, "cs-hmw") + "</div>" +
          '<div class="cs-card"><p class="cs-eyebrow">Ideas kept</p><ul class="cs-kept">' + bs.kept.map(function (k) { return "<li>" + CS_TICK + "<span>" + esc(k) + "</span></li>"; }).join("") + "</ul></div>" +
          '<div class="cs-card"><p class="cs-eyebrow">Ideas dropped</p><ul class="cs-dropped">' + bs.dropped.map(function (k) {
            return "<li>" + CS_CROSS + "<span><s>" + esc(k[0]) + "</s><small>" + esc(k[1]) + "</small></span></li>";
          }).join("") + "</ul></div>" +
        "</div>" +
      "</section>" +

      /* 06 Key-screen variations */
      '<section class="cs-sec" id="cs-screens" aria-labelledby="cs-screens-t">' +
        csHead("06", "Key-screen variations", "cs-screens") +
        '<div class="cs-switch">' +
          csTabs("css", dirs, "Directions for key screens") +
          dirs.map(function (d, i) {
            return csPanel("css", d, i, '<div class="cs-screens">' + d.screens.map(function (s) {
              var m = s.image === "desktop" ? d.desktop : s;
              return '<article class="cs-screen">' +
                '<figure class="cs-fig">' + csImg(m, d.key + " · " + s.name) + "</figure>" +
                '<div class="cs-screen-txt"><h4>' + esc(s.name) + "</h4>" +
                  '<p class="cs-kv"><span class="cs-tag is-kept">' + CS_TICK + "Kept</span>" + esc(s.kept) + "</p>" +
                  '<div class="cs-kv"><span class="cs-tag">' + CS_CROSS + "Dropped</span>" + csList(s.dropped, "cs-drop-list") + "</div>" +
                "</div></article>";
            }).join("") + "</div>");
          }).join("") +
        "</div>" +
        '<p class="cs-mini">' + esc(cs.screensNote) + "</p>" +
      "</section>" +

      /* 07 Evaluation */
      '<section class="cs-sec" id="cs-eval" aria-labelledby="cs-eval-t">' +
        csHead("07", "Evaluation", "cs-eval") +
        '<p class="cs-disclaimer cs-disclaimer-sm"><span class="cs-dot" aria-hidden="true"></span>' + esc(ev.note) + "</p>" +
        '<div class="cs-eval">' +
          '<div class="cs-table-wrap"><table class="cs-table cs-scores">' +
            '<caption class="sr">Scores from 1 to 5 per criterion for directions A, B and C, total out of 35</caption>' +
            '<thead><tr><th scope="col">Criterion</th>' + dirs.map(function (d) { return '<th scope="col" class="dir-' + esc(d.key) + '">' + esc(d.key) + "<small>" + esc(d.name) + "</small></th>"; }).join("") + "</tr></thead><tbody>" +
            ev.criteria.map(function (c) {
              return '<tr><th scope="row">' + esc(c[0]) + "</th>" + [1, 2, 3].map(function (k) {
                return '<td class="dir-' + dirs[k - 1].key + '">' + dots(c[k]) + '<span class="cs-num">' + esc(c[k]) + "</span></td>";
              }).join("") + "</tr>";
            }).join("") +
            '</tbody><tfoot><tr><th scope="row">Total /35</th>' + ev.totals.map(function (t, k) { return '<td class="dir-' + dirs[k].key + '">' + esc(t) + "</td>"; }).join("") + "</tr></tfoot>" +
          "</table></div>" +
          '<div class="cs-measure">' +
            '<p class="cs-eyebrow">' + esc(ev.measures.title) + "</p>" + bars(ev.measures.rows, maxLen) +
            '<p class="cs-eyebrow">' + esc(ev.measures.classTitle) + "</p>" + bars(ev.measures.classRows, maxLen) +
            '<p class="cs-mini">' + esc(ev.measures.note) + "</p>" +
          "</div>" +
        "</div>" +
      "</section>" +

      /* 08 Solution */
      '<section class="cs-sec" id="cs-solution" aria-labelledby="cs-solution-t">' +
        csHead("08", "Solution", "cs-solution") +
        '<div class="cs-grid3">' +
          '<div class="cs-card is-accent"><p class="cs-eyebrow">Why A wins</p>' + csList(so.why, "cs-ticks") + "</div>" +
          '<div class="cs-card"><p class="cs-eyebrow">What A still needs</p>' + csList(so.needs, "cs-arrows") + "</div>" +
          '<div class="cs-card"><p class="cs-eyebrow">How it solves the problem</p><p class="cs-p">' + esc(so.how) + "</p></div>" +
        "</div>" +
      "</section>" +

      '<footer class="cs-end">' +
        '<p>' + esc(cs.disclaimer) + "</p>" +
        '<a href="#project-view" data-jump="project-view" class="cs-top">Back to the project canvas ↑</a>' +
      "</footer>";
    caseEl.hidden = false;
  }

  function scrollToEl(el, instant) {
    // The case study sheet is its own scroll container (the canvases underneath never move).
    var r = el.getBoundingClientRect(), pr = sheet.getBoundingClientRect();
    var off = (sheetBar.offsetHeight || 0) + 16;
    sheet.scrollTo({ top: Math.max(0, sheet.scrollTop + r.top - pr.top - off), behavior: instant ? "auto" : behavior() });
  }
  function jumpTo(id) {
    if (id === "project-view") { closeSheet(); return; }
    var el = D.getElementById(id); if (!el || sheet.hidden) return;
    scrollToEl(el, false);
  }
  sheet.addEventListener("click", function (e) {
    var a = e.target.closest("[data-jump]"); if (!a) return;
    e.preventDefault();
    jumpTo(a.dataset.jump);
  });
  caseEl.addEventListener("click", function (e) {
    var t = e.target.closest(".cs-tab");
    if (t) { selectTab(t); return; }
    var z = e.target.closest(".cs-zoom");
    if (z) openCaseZoom(Number(z.dataset.z), z);
  });
  function selectTab(tab, focus) {
    var list = tab.parentNode;
    [].forEach.call(list.querySelectorAll(".cs-tab"), function (b) {
      var on = b === tab;
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
      var panel = D.getElementById(b.getAttribute("aria-controls"));
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
  }
  caseEl.addEventListener("keydown", function (e) {
    var t = e.target.closest && e.target.closest(".cs-tab"); if (!t) return;
    var tabs = [].slice.call(t.parentNode.querySelectorAll(".cs-tab"));
    var i = tabs.indexOf(t), j = -1;
    if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = tabs.length - 1;
    if (j < 0) return;
    e.preventDefault();
    selectTab(tabs[j], true);
  });
  function openCaseZoom(i, btn) {
    var m = csZoom[i]; if (!m || !lb.showModal) return;
    var p = bySlug(current);
    lbCase = { btn: btn };
    lbTitle.innerHTML = esc(p ? p.title : "") + (m.caption ? ' <span>' + esc(m.caption) + "</span>" : "");
    lbCount.textContent = "";
    lb.classList.add("is-single");
    lbBody.innerHTML = '<figure class="lb-frame' + (m.narrow ? " is-narrow" : "") + '"><img src="' + esc(m.src) + '" alt="' + esc(m.alt) + '" width="' + esc(m.width) + '" height="' + esc(m.height) + '" decoding="async" draggable="false"></figure>';
    lbBody.scrollTop = 0;
    D.documentElement.classList.add("lb-open");
    lb.showModal();
    D.getElementById("lb-close").focus();
  }


  /* =================================================================
     HOME CANVAS
     Everything a visitor needs is readable on first load: the hero,
     Projects (colourful sticky notes), About me, Experience, Education,
     Recognition and Contact. World units are CSS px at 100% zoom.
     ================================================================= */
  var cam = null, pcam = null;
  var notes = [];            // project sticky notes { el, slug, x, y, w, h }
  var zones = {};            // key -> world rect, for the section nav
  var layoutMode = null;     // "wide" | "narrow"

  function isNarrow() { return window.innerWidth < 720; }

  function noteHTML(p) {
    return '<span class="pn-tape" aria-hidden="true"></span>' +
      '<span class="pn-tag">' + esc(tagOf(p)) + "</span>" +
      '<h3 class="pn-title">' + esc(p.title) + "</h3>" +
      '<span class="pn-foot">' +
        (p.award ? '<span class="pn-award" title="Award">' + ICON.star + '<span class="sr">Award</span></span>' : "") +
        (p.year ? '<span class="pn-year">' + esc(p.year) + "</span>" : "") +
        '<span class="pn-go" aria-hidden="true">' + ICON.next + "</span>" +
      "</span>";
  }

  var INFO = [["note-about", "About me"], ["note-experience", "Experience"], ["note-education", "Education"], ["note-recognition", "Recognition"], ["note-contact", "Contact"]];
  function buildHome() {
    INFO.forEach(function (pair) {
      var l = D.createElement("p");
      l.className = "zone-h zone-h--info"; l.id = "zl-" + pair[0]; l.setAttribute("aria-hidden", "true");
      l.textContent = pair[1];
      boardsEl.appendChild(l);
      D.getElementById(pair[0]).classList.add("has-zl");
    });
    // Projects zone heading + category sub-labels
    var h = D.createElement("h2");
    h.className = "zone-h"; h.id = "zone-projects";
    h.innerHTML = 'Projects <span class="zone-n">' + pad(projects.length) + "</span>";
    boardsEl.appendChild(h);
    SECTIONS.forEach(function (s) {
      var l = D.createElement("p");
      l.className = "cv-sec"; l.id = "sec-" + s.key; l.setAttribute("aria-hidden", "true");
      l.innerHTML = esc(s.label);
      boardsEl.appendChild(l);
    });
    ORDER.forEach(function (slug) {
      var p = bySlug(slug);
      var a = D.createElement("a");
      a.className = "pn pn--" + p.color + (p.title.length > 30 ? " pn--long" : "");
      a.href = "?project=" + encodeURIComponent(p.slug);
      a.dataset.slug = p.slug;
      a.dataset.cat = p.category;
      a.draggable = false;
      a.style.setProperty("--r", p.tilt + "deg");
      a.setAttribute("aria-label", p.title + ", " + tagOf(p) + (p.year ? ", " + p.year : "") + (p.award ? ", award winner" : "") + ". Open project");
      a.innerHTML = noteHTML(p);
      boardsEl.appendChild(a);
      notes.push({ el: a, slug: p.slug });
    });
  }

  function place(el, x, y, w) {
    el.style.left = x + "px"; el.style.top = y + "px";
    if (w != null) el.style.width = w + "px";
  }
  function elRect(el) {
    return { x: parseFloat(el.style.left) || 0, y: parseFloat(el.style.top) || 0, w: el.offsetWidth, h: el.offsetHeight };
  }
  function union(rs) {
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    rs.forEach(function (r) { x0 = Math.min(x0, r.x); y0 = Math.min(y0, r.y); x1 = Math.max(x1, r.x + r.w); y1 = Math.max(y1, r.y + r.h); });
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }
  function pad4(r, t, rt, b, l) { return { x: r.x - l, y: r.y - t, w: r.w + l + rt, h: r.h + t + b }; }

  function layoutHome() {
    var narrow = isNarrow();
    layoutMode = narrow ? "narrow" : "wide";
    world.classList.toggle("is-narrow", narrow);
    var intro = D.getElementById("cv-intro");
    var $ = function (id) { return D.getElementById(id); };
    var byCat = {};
    notes.forEach(function (n) { var c = n.el.dataset.cat; (byCat[c] = byCat[c] || []).push(n); });
    var LABEL = 64;          // room above a note for its zone title

    if (!narrow) {
      // Left: hero, About me, Contact.  Right: Projects grid, then Experience / Education / Recognition.
      place(intro, 0, 0, 540);
      place($("note-about"), 0, intro.offsetHeight + 34 + LABEL, 470);
      var ab = elRect($("note-about"));
      place($("note-contact"), 0, ab.y + ab.h + 40 + LABEL, 470);

      var CW = 172, CH = 142, G = 18, GG = 40, X0 = 640, Y0 = 64;
      place($("zone-projects"), X0, Y0);
      var gx = X0;
      [["digital", 4], ["visual", 1], ["engineering", 2]].forEach(function (g) {
        var list = byCat[g[0]] || [], cols = g[1];
        place($("sec-" + g[0]), gx, Y0);
        list.forEach(function (n, i) {
          var x = gx + (i % cols) * (CW + G), y = Y0 + Math.floor(i / cols) * (CH + G);
          place(n.el, x, y); n.el.style.width = CW + "px"; n.el.style.height = CH + "px";
          n.x = x; n.y = y; n.w = CW; n.h = CH;
        });
        gx += cols * (CW + G) - G + GG;
      });
      var pr = union(notes);
      var iy = pr.y + pr.h + 52 + LABEL;
      place($("note-experience"), X0, iy, 400);
      place($("note-education"), X0 + 440, iy, 330);
      place($("note-recognition"), X0 + 810, iy, 380);
    } else {
      // Phones: a compact overview with bigger type, framed whole on first load.
      var W = 960; LABEL = 96;
      place(intro, 0, 0, W);
      var CWn = 180, CHn = 140, Gn = 15, Y = intro.offsetHeight + 40 + LABEL;
      place($("zone-projects"), 0, Y);
      SECTIONS.forEach(function (s) { $("sec-" + s.key).style.display = "none"; });
      notes.forEach(function (n, i) {
        var x = (i % 5) * (CWn + Gn), y = Y + Math.floor(i / 5) * (CHn + Gn);
        place(n.el, x, y); n.el.style.width = CWn + "px"; n.el.style.height = CHn + "px";
        n.x = x; n.y = y; n.w = CWn; n.h = CHn;
      });
      var pr2 = union(notes), y2 = pr2.y + pr2.h + 44 + LABEL, third = (W - 48) / 3, half = (W - 24) / 2;
      place($("note-about"), 0, y2, third);
      place($("note-experience"), third + 24, y2, third);
      place($("note-education"), 2 * (third + 24), y2, third);
      var r1 = Math.max(elRect($("note-about")).h, elRect($("note-experience")).h, elRect($("note-education")).h);
      var y3 = y2 + r1 + 44 + LABEL;
      place($("note-recognition"), 0, y3, half);
      place($("note-contact"), half + 24, y3, half);
    }
    if (!narrow) SECTIONS.forEach(function (s) { $("sec-" + s.key).style.display = ""; });
    [].forEach.call(world.querySelectorAll(".note"), function (el) { el.style.setProperty("--r", (Number(el.dataset.r) || 0) + "deg"); });

    INFO.forEach(function (pair) { var r = elRect($(pair[0])); place($("zl-" + pair[0]), r.x, r.y); });

    // zones for the section nav (title space included)
    var R = function (id) { return elRect($(id)); };
    zones.projects = pad4(union(notes), LABEL + 16, 24, 24, 24);
    zones.about = pad4(union([R("note-about")]), LABEL + 16, 40, 40, 40);
    zones.experience = pad4(R("note-experience"), LABEL + 16, 40, 40, 40);
    zones.education = pad4(union([R("note-education"), R("note-recognition")]), LABEL + 16, 40, 40, 40);
    zones.contact = pad4(R("note-contact"), LABEL + 16, 40, 40, 40);
  }

  function contentRect() {
    var rs = notes.slice();
    [].forEach.call(world.querySelectorAll(".note, .cv-intro"), function (el) { rs.push(elRect(el)); });
    return pad4(union(rs), 80, 10, 10, 10);
  }
  function chromePad() {
    // clear of the top bar (+ section chips) and the HUD
    return isNarrow() ? { t: 118, r: 12, b: 118, l: 12 } : { t: 92, r: 40, b: 84, l: 40 };
  }
  function landingView() { return cam.fit(contentRect(), chromePad(), 1); }
  function updateZoomLimits() {
    var f = landingView();
    cam.setZoomLimits(Math.min(.25, f.z * .8), isNarrow() ? 3 : 2.5);
    cam.setBounds(contentRect());
  }

  /* ---------- camera + HUD ---------- */
  var hudZoom = D.getElementById("hud-zoom");
  var hinted = false, moved = false;
  function dismissHint() {
    if (hinted) return; hinted = true;
    setTimeout(function () { hint.classList.add("is-gone"); }, 500);
  }
  function initCamera() {
    cam = new window.Camera(vp, world, {
      reduceMotion: reduced,
      onInteract: function () { dismissHint(); },
      isFrame: function (t) { return t && t.closest && t.closest(".pn, .note"); }
    });
    cam.onChange(function (x, y, z) { hudZoom.textContent = Math.round(z * 100) + "%"; markChip(); });
    updateZoomLimits();
  }
  window.addEventListener("resize", function () {
    if (cam && !root.classList.contains("view-list")) {
      var wasNarrow = layoutMode === "narrow";
      if (wasNarrow !== isNarrow()) layoutHome();
      cam.resize(); updateZoomLimits();
      if (isOpen() && openNote) cam.set(cam.fit(openNote, chromePad(), 3));
      else if (!moved) cam.set(landingView());
    }
    if (pcam && isOpen()) { pcam.resize(); pcLimits(); }
  });

  hud.addEventListener("click", function (e) {
    var zb = e.target.closest("[data-zoom]");
    if (zb) { moved = true; cam.zoomAt(cam.get().z * (zb.dataset.zoom === "1" ? 1.5 : 1 / 1.5), null, null, true); return; }
    if (e.target.closest("#hud-zoom")) { moved = true; cam.zoomAt(1, null, null, true); return; }
    if (e.target.closest("#hud-fit")) { moved = false; cam.animateTo(landingView(), { duration: 560 }); }
  });

  /* ---------- section nav (always visible) ---------- */
  var chips = [].slice.call(D.querySelectorAll(".chip"));
  function flyToZone(key) {
    if (view() === "list") {
      var t = D.getElementById("lv-" + key);
      if (t) window.scrollTo({ top: Math.max(0, t.getBoundingClientRect().top + window.scrollY - 130), behavior: behavior() });
      return;
    }
    var r = zones[key]; if (!r) return;
    moved = true; dismissHint();
    var zMax = key === "projects" ? 1.1 : 1.3;
    cam.animateTo(cam.fit(r, chromePad(), zMax), { duration: 600 });
  }
  chips.forEach(function (c) { c.addEventListener("click", function () { flyToZone(c.dataset.zone); }); });
  function markChip() {
    if (!cam) return;
    var v = cam.get(), best = null, bestD = Infinity;
    var l = landingView();
    var overview = Math.abs(Math.log(v.z / l.z)) < .12 && Math.hypot(v.x - l.x, v.y - l.y) * v.z < 80;
    if (!overview) Object.keys(zones).forEach(function (k) {
      var r = zones[k], d = Math.hypot(r.x + r.w / 2 - v.x, r.y + r.h / 2 - v.y);
      if (d < bestD) { bestD = d; best = k; }
    });
    chips.forEach(function (c) { if (c.dataset.zone === best) c.setAttribute("aria-current", "true"); else c.removeAttribute("aria-current"); });
  }

  /* ---------- keyboard focus brings notes into view ---------- */
  world.addEventListener("focusin", function (e) {
    var t = e.target, el = t.closest && t.closest(".pn, .note");
    if (!el || isOpen() || opening) return;
    var kb = false; try { kb = t.matches(":focus-visible"); } catch (err) { kb = true; }
    if (!kb) return;
    var r = elRect(el), s = cam.size(), pd = chromePad();
    var a = cam.toScreen(r.x, r.y), b = cam.toScreen(r.x + r.w, r.y + r.h);
    if (a.x >= pd.l && a.y >= pd.t && b.x <= s.w - pd.r && b.y <= s.h - pd.b) return;
    cam.animateTo(cam.fit(pad4(r, 120, 120, 120, 120), pd, Math.max(cam.get().z, .8)), { duration: 420 });
    moved = true;
  });

  /* ---------- open a project note: dive in, then its own canvas ---------- */
  var saved = null, opening = false, openNote = null, openTimer = 0;
  function noteFor(el) { for (var i = 0; i < notes.length; i++) if (notes[i].el === el) return notes[i]; return null; }
  function noteBySlug(slug) { for (var i = 0; i < notes.length; i++) if (notes[i].slug === slug) return notes[i]; return null; }

  boardsEl.addEventListener("click", function (e) {
    var a = e.target.closest(".pn"); if (!a) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
    e.preventDefault();
    openFromHome(a);
  });
  function openFromHome(a) {
    if (opening || isOpen()) return;
    var n = noteFor(a); if (!n) return;
    dismissHint();
    saved = cam.get(); openNote = n; opening = true;
    world.classList.add("is-focusing"); a.classList.add("is-target");
    if (reduced()) { opening = false; openProject(n.slug); return; }
    var dur = 560;
    clearTimeout(openTimer);
    openTimer = setTimeout(function () { if (!opening) return; opening = false; openProject(n.slug); }, dur * .7);
    cam.animateTo(cam.fit(n, chromePad(), 3), {
      duration: dur,
      onCancel: function () {
        if (opening) { opening = false; clearTimeout(openTimer); world.classList.remove("is-focusing"); a.classList.remove("is-target"); openNote = null; }
      }
    });
  }

  /* =================================================================
     PROJECT CANVAS — a second pannable space per project:
     a title note, a "Web" row of desktop frames, a "Mobile" row of
     phone frames, and the case study (when there is one).
     ================================================================= */
  var pcItems = [];          // artboards on the project canvas { el, x, y, w, h, i }
  var pcStart = null;        // rect the project canvas opens on
  var pcAll = null;          // all content

  function pcSecHTML(label, n) { return esc(label) + (n ? ' <span class="cv-sec-n">' + pad(n) + "</span>" : ""); }

  function buildProjectCanvas(p) {
    pcWorld.innerHTML = "";
    pcItems = [];
    frames = mediaOf(p);
    var desk = frames.filter(function (m) { return !isPhone(m); });
    var phone = frames.filter(isPhone);
    var rs = [], cs = null;

    // title note: only facts from projects.js
    var facts = [["Role", p.role], ["Year", p.year]].filter(function (f) { return f[1]; });
    var note = D.createElement("div");
    note.className = "pc-note pn--" + p.color;
    note.innerHTML =
      '<span class="pn-tape" aria-hidden="true"></span>' +
      '<p class="pc-note-k">' + esc(CATS[p.category]) + "</p>" +
      '<h2 class="pc-note-t" id="pc-title">' + esc(p.title) + "</h2>" +
      (p.summary ? '<p class="pc-note-s">' + esc(p.summary) + "</p>" : "") +
      (facts.length ? '<dl class="pc-note-f">' + facts.map(function (f) { return "<div><dt>" + f[0] + "</dt><dd>" + esc(f[1]) + "</dd></div>"; }).join("") + "</dl>" : "") +
      (p.scope && p.scope.length ? '<ul class="pc-note-tags">' + p.scope.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul>" : "") +
      (p.award ? '<p class="pc-note-award">' + ICON.star + esc(p.award) + "</p>" : "") +
      (p.note ? '<p class="pc-note-n">' + esc(p.note) + "</p>" : "");
    var narrow = isNarrow();
    pcWorld.appendChild(note);
    place(note, 0, 0, narrow ? 400 : 360);
    var noteR = elRect(note);
    rs.push(noteR);

    if (p.caseStudy) {
      cs = D.createElement("div");
      cs.className = "pc-case";
      cs.innerHTML =
        '<p class="pc-case-k">Case study</p>' +
        '<p class="pc-case-t">' + esc(p.caseStudy.title) + "</p>" +
        '<p class="pc-case-l">' + esc(p.caseStudy.lede) + "</p>" +
        '<p class="pc-case-d">' + esc(p.caseStudy.disclaimer) + "</p>" +
        '<button type="button" class="pc-case-btn" data-open-case>Read the case study ' + ICON.next + "</button>";
      pcWorld.appendChild(cs);
      if (!narrow) { place(cs, 0, noteR.y + noteR.h + 56, 360); rs.push(elRect(cs)); }
    }

    var X = narrow ? 0 : 480, y = narrow ? noteR.h + 120 : 0;
    function addRow(label, list, w, isPh) {
      var sec = D.createElement("p");
      sec.className = "cv-sec pc-sec"; sec.setAttribute("aria-hidden", "true");
      sec.innerHTML = pcSecHTML(label, list.length);
      pcWorld.appendChild(sec);
      place(sec, X, y);
      var x = X, maxH = 0;
      list.forEach(function (m) {
        var i = frames.indexOf(m);
        var h = Math.round(w * m.height / m.width);
        var a = D.createElement("button");
        a.type = "button";
        a.className = "ab ab--img pc-ab" + (isPh ? " is-phone-ab" : "");
        a.setAttribute("aria-label", (m.caption || label) + ": " + (m.alt || "") + ". Zoom to frame");
        a.innerHTML =
          '<span class="ab-label" aria-hidden="true">' + esc(m.caption || label) + "</span>" +
          '<span class="ab-frame ab-img' + (isPh ? " is-phone" : "") + '"><img src="' + esc(m.src) + '" alt="" width="' + esc(m.width) + '" height="' + esc(m.height) + '" loading="lazy" decoding="async" draggable="false"></span>' +
          '<span class="ab-sel" aria-hidden="true"><i class="tl"></i><i class="tr"></i><i class="bl"></i><i class="br"></i><span class="ab-dim">' + esc(m.width) + " × " + esc(m.height) + "</span></span>";
        a.style.cssText = "left:" + x + "px;top:" + y + "px;width:" + w + "px;height:" + h + "px;";
        a.dataset.i = i;
        pcWorld.appendChild(a);
        var it = { el: a, x: x, y: y, w: w, h: h, i: i };
        pcItems.push(it); rs.push(it);
        x += w + (narrow ? 40 : (isPh ? 56 : 72)); maxH = Math.max(maxH, h);
      });
      y += maxH + (narrow ? 120 : 150);
    }
    if (desk.length) addRow("Web", desk, narrow ? 400 : 640, false);
    if (phone.length) addRow("Mobile", phone, narrow ? 200 : 300, true);
    if (cs && narrow) { place(cs, 0, y - 40, 400); rs.push(elRect(cs)); }
    if (!desk.length && !phone.length) {
      var ph = D.createElement("div");
      ph.className = "pc-empty";
      ph.innerHTML = '<p class="cv-sec pc-sec" aria-hidden="true">Designs</p>' +
        '<div class="pc-empty-in"><span class="pc-empty-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><rect x="3.5" y="5" width="17" height="11" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M9 19.5h6M12 16v3.5" stroke="currentColor" stroke-width="1.3"/></svg></span>' +
        '<p class="pc-empty-t">Designs coming soon</p></div>';
      pcWorld.appendChild(ph);
      var pw = narrow ? 400 : 720, phh = narrow ? 300 : 460;
      place(ph, X, y, pw);
      ph.style.height = phh + "px";
      rs.push({ x: X, y: y, w: pw, h: phh });
    }
    pcAll = pad4(union(rs), 70, 20, 20, 20);
    // open on the title note + the first frames of each row
    // open on the title note + the first frames of the first row
    var rowFirst = pcItems.filter(function (it) { return it.el.classList.contains("is-phone-ab") === (desk.length === 0); }).slice(0, narrow ? 1 : 2);
    var first = [noteR].concat(rowFirst.map(function (it) { return { x: it.x, y: it.y, w: it.w, h: Math.min(it.h, narrow ? 420 : 900) }; }));
    pcStart = pcItems.length ? pad4(union(first), 70, 20, 20, 20) : pcAll;
    pcCsBtn.hidden = !p.caseStudy;
  }

  function pcPad() { return isNarrow() ? { t: 76, r: 12, b: 84, l: 12 } : { t: 84, r: 40, b: 88, l: 40 }; }
  function pcLimits() {
    var f = pcam.fit(pcAll, pcPad());
    pcam.setZoomLimits(Math.min(.15, f.z * .8), 2.5);
    pcam.setBounds(pcAll);
  }
  function initPcam() {
    pcam = new window.Camera(pcVp, pcWorld, {
      reduceMotion: reduced,
      isFrame: function (t) { return t && t.closest && t.closest(".pc-ab, .pc-note, .pc-case"); }
    });
    pcam.onChange(function (x, y, z) { pcZoom.textContent = Math.round(z * 100) + "%"; });
  }
  D.getElementById("pc-hud").addEventListener("click", function (e) {
    var zb = e.target.closest("[data-pzoom]");
    if (zb) { pcam.zoomAt(pcam.get().z * (zb.dataset.pzoom === "1" ? 1.5 : 1 / 1.5), null, null, true); return; }
    if (e.target.closest("#pc-zoom")) { pcam.zoomAt(1, null, null, true); return; }
    if (e.target.closest("#pc-fit")) pcam.animateTo(pcam.fit(pcAll, pcPad()), { duration: 560 });
  });
  pcWorld.addEventListener("click", function (e) {
    if (e.target.closest("[data-open-case]")) { openSheet(); return; }
    var a = e.target.closest(".pc-ab"); if (!a) return;
    var it = null; pcItems.forEach(function (x) { if (x.el === a) it = x; });
    if (!it) return;
    var tall = it.h > it.w * 1.6;
    var target = tall
      ? pcam.fit({ x: it.x - 40, y: it.y - 60, w: it.w + 80, h: Math.min(it.h, it.w * 2.1) + 60 }, pcPad(), 1.6)
      : pcam.fit(pad4(it, 50, 40, 40, 40), pcPad(), 1.6);
    var v = pcam.get();
    var already = Math.abs(Math.log(v.z / target.z)) < .08 && Math.hypot(v.x - target.x, v.y - target.y) * v.z < 30;
    if (already) openLightbox(it.i, a);
    else pcam.animateTo(target, { duration: 480 });
  });
  pcWorld.addEventListener("focusin", function (e) {
    var a = e.target.closest && e.target.closest(".pc-ab"); if (!a || !pcam) return;
    var kb = false; try { kb = e.target.matches(":focus-visible"); } catch (err) { kb = true; }
    if (!kb) return;
    var it = null; pcItems.forEach(function (x) { if (x.el === a) it = x; });
    if (it) pcam.animateTo(pcam.fit(pad4({ x: it.x, y: it.y, w: it.w, h: Math.min(it.h, it.w * 2) }, 60, 60, 60, 60), pcPad(), Math.max(pcam.get().z, .6)), { duration: 420 });
  });
  pcCsBtn.addEventListener("click", function () { openSheet(); });

  /* ---------- case study sheet ---------- */
  function setHash(h) {
    try { var u = new URL(window.location.href); u.hash = h; history.replaceState(history.state, "", u.pathname + u.search + u.hash); } catch (e) {}
  }
  function openSheet(opts) {
    opts = opts || {};
    var p = bySlug(current); if (!p || !p.caseStudy) return;
    if (caseEl.hidden || caseEl.dataset.slug !== p.slug) { renderCase(p); caseEl.dataset.slug = p.slug; }
    D.getElementById("cs-crumb").innerHTML = "<span>" + esc(p.title) + '</span><span aria-hidden="true">/</span><b>Case study</b>';
    sheet.hidden = false; sheet.classList.remove("is-leaving");
    projectView.inert = true;
    sheet.scrollTop = 0;
    if (!opts.noHash) setHash("case-study");
    var h = D.getElementById("cs-title"); if (h && !opts.noFocus) h.focus({ preventScroll: true });
  }
  function closeSheet() {
    if (sheet.hidden) return;
    if (lb.open) lb.close();
    projectView.inert = false;
    setHash("");
    var done = function () { sheet.hidden = true; sheet.classList.remove("is-leaving"); };
    if (reduced()) done(); else { sheet.classList.add("is-leaving"); setTimeout(done, 220); }
    pcCsBtn.focus({ preventScroll: true });
  }
  D.getElementById("cs-back").addEventListener("click", closeSheet);

  /* ================= Routing: open / close a project ================= */
  function isOpen() { return !projectView.hidden; }
  function view() { return root.classList.contains("view-list") ? "list" : "canvas"; }
  function setURL(slug, mode) {
    if (!mode) return false;
    try {
      var url = new URL(window.location.href);
      if (slug) url.searchParams.set("project", slug); else url.searchParams.delete("project");
      url.hash = slug ? "" : (view() === "list" ? "list" : "");
      var href = url.pathname + url.search + url.hash;
      if (mode === "push") history.pushState({ project: slug || null }, "", href);
      else history.replaceState({ project: slug || null }, "", href);
      return true;
    } catch (e) { return false; }
  }
  var pushed = false, baseTitle = D.title, leaveTimer = 0;

  function openProject(slug, opts) {
    opts = opts || {};
    var p = bySlug(slug); if (!p) return;
    var wasOpen = isOpen();
    current = slug;
    clearTimeout(leaveTimer);
    projectView.classList.remove("is-leaving");
    projectView.hidden = false;
    buildProjectCanvas(p);
    projectView.setAttribute("aria-label", p.title + " — project canvas");
    root.classList.add("pv-open");
    canvasEl.inert = true; listView.inert = true; topbar.inert = true;
    pcCrumb.innerHTML = '<b>' + esc(p.title) + '</b><span class="pv-crumb-k">' + esc(tagOf(p)) + "</span>";
    pvBackLabel.textContent = view() === "list" ? "All work" : "Home";

    if (!pcam) initPcam();
    pcam.resize(); pcLimits();
    var start = pcam.fit(pcStart, pcPad(), 1);
    if (reduced() || opts.instant) pcam.set(start);
    else { pcam.set({ x: start.x, y: start.y, z: start.z * 1.12 }); pcam.animateTo(start, { duration: 620, force: true, ease: function (t) { return 1 - Math.pow(1 - t, 4); } }); }

    if (view() === "canvas" && cam) {
      var n = noteBySlug(slug);
      if (n) {
        if (!saved) saved = landingView();
        openNote = n;
        world.classList.add("is-focusing");
        [].forEach.call(boardsEl.querySelectorAll(".pn.is-target"), function (x) { x.classList.remove("is-target"); });
        n.el.classList.add("is-target");
        if (opts.instant) cam.set(cam.fit(n, chromePad(), 3));
      }
    }
    var mode = opts.history === null ? null : (wasOpen ? "replace" : "push");
    if (setURL(slug, mode) && mode === "push") pushed = true;
    D.title = p.title + " — Hediyeh Khodashenas";
    if (opts.target === "case-study" && p.caseStudy) openSheet({ noHash: true, noFocus: opts.noFocus });
    else if (!opts.noFocus) backBtn.focus({ preventScroll: true });
  }

  function closeProject(opts) {
    opts = opts || {};
    if (!isOpen()) return;
    if (pushed && opts.history !== null) {
      pushed = false; pendingFocus = !opts.noFocus;
      history.back();
      return;
    }
    pushed = false;
    if (lb.open) lb.close();
    if (!sheet.hidden) { sheet.hidden = true; projectView.inert = false; }
    var last = current;
    canvasEl.inert = false; listView.inert = false; topbar.inert = false;
    root.classList.remove("pv-open");
    D.title = baseTitle;
    if (opts.history !== null) setURL(null, "replace");
    var finish = function () { projectView.hidden = true; projectView.classList.remove("is-leaving"); };
    if (reduced()) finish(); else { projectView.classList.add("is-leaving"); leaveTimer = setTimeout(finish, 240); }

    if (view() === "canvas" && cam) {
      var back = saved || landingView();
      saved = null;
      var tgt = openNote && openNote.el;
      openNote = null;
      world.classList.remove("is-focusing");
      cam.animateTo(cam.clampView(back), { duration: 540 });
      if (tgt) setTimeout(function () { tgt.classList.remove("is-target"); }, reduced() ? 0 : 560);
      var n = noteBySlug(last);
      if (n && !opts.noFocus) n.el.focus({ preventScroll: true });
    } else {
      var row = last && listView.querySelector('.lv-item[data-slug="' + last + '"]');
      if (row) {
        var r = row.getBoundingClientRect();
        if (r.top < 60 || r.bottom > window.innerHeight) window.scrollTo({ top: Math.max(0, window.scrollY + r.top - window.innerHeight * .35), behavior: "auto" });
        if (!opts.noFocus) row.focus({ preventScroll: true });
      }
    }
  }
  backBtn.addEventListener("click", function (e) { e.preventDefault(); closeProject(); });
  function hashTarget() { return window.location.hash === "#case-study" ? "case-study" : null; }
  var pendingFocus = false;
  window.addEventListener("popstate", function () {
    var slug = null;
    try { slug = new URL(window.location.href).searchParams.get("project"); } catch (e) {}
    var focus = pendingFocus; pendingFocus = false;
    if (bySlug(slug)) openProject(slug, { history: null, noFocus: true, target: hashTarget(), instant: true });
    else closeProject({ history: null, noFocus: !focus });
  });

  /* ================= Keyboard ================= */
  D.addEventListener("keydown", function (e) {
    if (e.defaultPrevented) return;
    var t = e.target;
    if (e.key === "Escape") {
      if (lb.open) return;                                  // the dialog closes itself first
      if (!sheet.hidden) { e.preventDefault(); closeSheet(); return; }
      if (isOpen()) { e.preventDefault(); closeProject(); return; }
      return;
    }
    if (lb.open || !sheet.hidden) return;
    var c = isOpen() ? pcam : (view() === "canvas" ? cam : null);
    if (!c) return;
    if (e.altKey || e.metaKey || e.ctrlKey) return;
    if (t && t.closest && t.closest("input, textarea, select, [contenteditable]")) return;
    var k = e.key, st = e.shiftKey ? 320 : 120, done = true;
    if (k === "ArrowLeft" || k === "a" || k === "A") c.panBy(-st, 0, true);
    else if (k === "ArrowRight" || k === "d" || k === "D") c.panBy(st, 0, true);
    else if (k === "ArrowUp" || k === "w" || k === "W") c.panBy(0, -st, true);
    else if (k === "ArrowDown" || k === "s" || k === "S") c.panBy(0, st, true);
    else if (k === "+" || k === "=") c.zoomAt(c.get().z * 1.5, null, null, true);
    else if (k === "-" || k === "_") c.zoomAt(c.get().z / 1.5, null, null, true);
    else if (k === "0") c.animateTo(isOpen() ? pcam.fit(pcAll, pcPad()) : landingView(), { duration: 560 });
    else if (k === "1") c.zoomAt(1, null, null, true);
    else done = false;
    if (done) { e.preventDefault(); if (!isOpen()) { moved = true; dismissHint(); } }
  });

  /* ================= List view ================= */
  function buildList() {
    var groups = D.getElementById("lv-groups");
    groups.id = "lv-groups";
    groups.innerHTML = '<span id="lv-projects" class="lv-anchor"></span>' + SECTIONS.map(function (s) {
      var list = ORDER.map(bySlug).filter(function (p) { return p.category === s.key; });
      return '<section class="lv-group" aria-labelledby="lv-' + s.key + '">' +
        '<h3 class="lv-sec" id="lv-' + s.key + '">' + esc(s.label) + ' <span>' + pad(list.length) + "</span></h3>" +
        '<ol class="lv-list">' + list.map(function (p) {
          var sub = [tagOf(p), p.year].filter(Boolean).join(" · ");
          return '<li><a class="lv-item" href="?project=' + encodeURIComponent(p.slug) + '" data-slug="' + esc(p.slug) + '">' +
            '<span class="lv-thumb lv-sticky pn--' + p.color + '" aria-hidden="true" style="--r:' + p.tilt + 'deg"><span>' + esc(p.title) + "</span></span>" +
            '<span class="lv-text"><span class="lv-name">' + esc(p.title) + (p.award ? '<span class="lv-award" title="Award">' + ICON.star + '<span class="sr">Award</span></span>' : "") + "</span>" +
            '<span class="lv-sub">' + esc(sub) + "</span></span>" +
            '<span class="lv-go" aria-hidden="true">' + ICON.next + "</span></a></li>";
        }).join("") + "</ol></section>";
    }).join("");
    var about = D.getElementById("lv-about");
    about.innerHTML = '<div class="lv-notes">' +
      [["note-about", "about"], ["note-experience", "experience"], ["note-education", "education"], ["note-recognition", "recognition"], ["note-contact", "contact"]].map(function (pair) {
        var n = D.getElementById(pair[0]);
        var html = n.innerHTML.replace(/\sid="[^"]*"/g, "").replace(/<h2 class="note-h"/g, '<h3 class="note-h"').replace(/<\/h2>/g, "</h3>");
        return '<div class="lv-note" id="lv-' + pair[1] + '">' + html + "</div>";
      }).join("") + "</div>";
    groups.addEventListener("click", function (e) {
      var a = e.target.closest(".lv-item"); if (!a) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
      e.preventDefault();
      openProject(a.dataset.slug);
    });
  }

  /* ================= View switch ================= */
  var segBtns = [].slice.call(D.querySelectorAll(".seg-btn"));
  function setView(v, opts) {
    opts = opts || {};
    root.classList.toggle("view-list", v === "list");
    segBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.view === v ? "true" : "false"); });
    if (!opts.silent && !isOpen()) setURL(null, "replace");
    if (v === "canvas" && cam) { cam.resize(); updateZoomLimits(); if (!moved) cam.set(landingView()); }
    if (v === "list") window.scrollTo(0, 0);
  }
  segBtns.forEach(function (b) { b.addEventListener("click", function () { setView(b.dataset.view); }); });
  D.getElementById("skip-link").addEventListener("click", function (e) { e.preventDefault(); setView("list"); listView.focus(); });
  D.getElementById("tb-home").addEventListener("click", function (e) {
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    if (view() === "canvas") { moved = false; cam.animateTo(landingView(), { duration: 600 }); }
    else window.scrollTo({ top: 0, behavior: behavior() });
  });

  /* ================= Init ================= */
  buildHome();
  buildList();
  layoutHome();
  initCamera();
  [].forEach.call(D.querySelectorAll(".js-year"), function (y) { y.textContent = new Date().getFullYear(); });

  var initial = null;
  try { initial = new URL(window.location.href).searchParams.get("project"); } catch (e) {}
  var startList = window.location.hash === "#list";
  setView(startList ? "list" : "canvas", { silent: true });

  if (bySlug(initial)) {
    try { history.replaceState({ project: initial }, "", window.location.href); } catch (e) {}
    saved = landingView();
    openProject(initial, { history: null, noFocus: true, target: hashTarget(), instant: true });
  } else if (!startList) {
    var land = landingView();
    if (reduced()) cam.set(land);
    else {
      cam.set({ x: land.x, y: land.y + 30 / land.z, z: land.z * .94 });
      root.classList.add("is-intro");
      setTimeout(function () { root.classList.remove("is-intro"); }, 1400);
      requestAnimationFrame(function () { cam.animateTo(land, { duration: 850, force: true, ease: function (t) { return 1 - Math.pow(1 - t, 4); } }); });
    }
    setTimeout(dismissHint, 12000);
  }
  if (D.fonts && D.fonts.ready) D.fonts.ready.then(function () {
    layoutHome(); updateZoomLimits();
    if (!moved && !isOpen() && view() === "canvas" && !cam.isAnimating()) cam.set(landingView());
    if (isOpen() && pcam && current) { buildProjectCanvas(bySlug(current)); pcLimits(); }
  });
})();
