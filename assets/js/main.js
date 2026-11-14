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

  var projectView = D.getElementById("project-view");
  var pvBar = projectView.querySelector(".pv-bar");
  var pvCrumb = D.getElementById("pv-crumb");
  var pvBackLabel = D.getElementById("pv-back-label");
  var backBtn = D.getElementById("pv-back");
  var showcase = D.getElementById("showcase");
  var stage = D.getElementById("stage");
  var bar = D.getElementById("stage-bar");
  var strip = D.getElementById("strip");
  var info = D.getElementById("info");
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

  var current = null;      // slug
  var frames = [];         // media for current project
  var frame = 0;           // active frame index
  var broken = {};         // src -> true when an image failed to load
  var inView = false;      // showcase on screen (enables ← → keys)

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

  // Project order = category order (also drives the prev / next pager).
  var ORDER = [];
  SECTIONS.forEach(function (s) {
    projects.forEach(function (p) { if (p.category === s.key) ORDER.push(p.slug); });
  });
  ORDER.forEach(function (slug, i) { bySlug(slug).no = pad(i + 1); });

  /* ================= Showcase ================= */
  function frameHTML(m, i, where) {
    var dims = (m.width ? ' width="' + esc(m.width) + '"' : "") + (m.height ? ' height="' + esc(m.height) + '"' : "");
    var img = '<img src="' + esc(m.src) + '" alt="' + esc(m.alt) + '"' + dims +
      (where === "stage" && i > 0 ? ' loading="lazy"' : "") + ' decoding="async" draggable="false">';
    if (isPhone(m)) {
      return '<div class="phone"><div class="phone-screen">' + img + "</div></div>";
    }
    return where === "stage" ? '<div class="shot">' + img + "</div>" : img;
  }

  function renderShowcase(p) {
    frames = mediaOf(p);
    frame = Math.min(frame, Math.max(0, frames.length - 1));
    var vis = ORDER;
    var idx = vis.indexOf(p.slug);
    var prev = vis.length > 1 ? vis[(idx - 1 + vis.length) % vis.length] : null;
    var next = vis.length > 1 ? vis[(idx + 1) % vis.length] : null;
    var links = (p.links || []).filter(function (l) { return l && l.href; });
    var hasMedia = frames.length > 0;

    showcase.classList.toggle("has-media", hasMedia);
    showcase.dataset.cat = p.category;

    /* stage */
    if (hasMedia) {
      stage.className = "stage";
      stage.setAttribute("role", "region");
      stage.setAttribute("aria-roledescription", "carousel");
      stage.setAttribute("aria-label", p.title + " frames");
      stage.innerHTML = frames.map(function (m, i) {
        return '<figure class="frame' + (isPhone(m) ? " is-phone" : "") + '" data-i="' + i + '" aria-hidden="true">' + frameHTML(m, i, "stage") + "</figure>";
      }).join("") +
        '<button type="button" class="stage-open" aria-label="Expand frame">' + ICON.expand + "<span>Expand</span></button>" +
        '<span class="stage-hint" aria-hidden="true">Move to scroll</span>';
      bar.innerHTML =
        '<p class="bar-cap"><span class="bar-count" aria-hidden="true"></span><span class="bar-label"></span></p>' +
        (frames.length > 1 ?
          '<div class="bar-ctrl">' +
            '<button type="button" class="icon-btn" data-step="-1" aria-label="Previous frame">' + ICON.prev + "</button>" +
            '<button type="button" class="icon-btn" data-step="1" aria-label="Next frame">' + ICON.next + "</button>" +
          "</div>" : "");
      strip.innerHTML = frames.length > 1 ? frames.map(function (m, i) {
        return '<button type="button" class="thumb' + (isPhone(m) ? " is-phone" : "") + '" data-i="' + i + '" aria-label="Frame ' + (i + 1) + (m.caption ? ": " + esc(m.caption) : "") + '">' +
          '<img src="' + esc(m.src) + '" alt="" loading="lazy" decoding="async" draggable="false"><span class="thumb-no" aria-hidden="true">' + pad(i + 1) + "</span></button>";
      }).join("") : "";
      [].forEach.call(stage.querySelectorAll("img"), function (img) {
        img.addEventListener("error", function () { broken[img.getAttribute("src")] = true; renderShowcase(p); }, { once: true });
        img.addEventListener("load", fitFrames);
      });
    } else {
      stage.className = "stage is-plate";
      stage.removeAttribute("role");
      stage.removeAttribute("aria-roledescription");
      stage.removeAttribute("aria-label");
      stage.innerHTML =
        '<div class="plate">' +
          '<span class="plate-no" aria-hidden="true">' + p.no + "</span>" +
          '<p class="plate-kicker">' + esc(p.context || CATS[p.category]) + "</p>" +
          '<ul class="plate-scope">' + (p.scope || []).map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul>" +
        "</div>";
      bar.innerHTML = "";
      strip.innerHTML = "";
    }

    /* info rail */
    var facts = [["Role", p.role], ["Year", p.year]]
      .filter(function (f) { return f[1]; })
      .map(function (f) { return "<div><dt>" + f[0] + "</dt><dd>" + esc(f[1]) + "</dd></div>"; }).join("");
    info.innerHTML =
      '<p class="info-kicker"><span>' + p.no + "</span>" + esc(CATS[p.category]) + "</p>" +
      '<h3 class="info-title">' + esc(p.title) + "</h3>" +
      (p.summary ? '<p class="info-line">' + esc(p.summary) + "</p>" : "") +
      (p.award ? '<p class="info-award">' + ICON.star + esc(p.award) + "</p>" : "") +
      (facts ? '<dl class="info-facts">' + facts + "</dl>" : "") +
      (hasMedia && p.scope && p.scope.length ? '<ul class="tags">' + p.scope.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul>" : "") +
      (p.caseStudy ? '<a class="info-case" href="#case-study" data-jump="case-study"><span>Case study</span><small>Directions, benchmarks, scores</small>' + ICON.next + "</a>" : "") +
      (p.note ? '<p class="info-note">' + esc(p.note) + "</p>" : "") +
      (links.length ? '<p class="info-links">' + links.map(function (l) {
        return '<a href="' + esc(l.href) + '" target="_blank" rel="noopener">' + esc(l.label || "View") + " ↗</a>";
      }).join("") + "</p>" : "") +
      (prev && next ?
        '<div class="info-pager">' +
          '<button type="button" class="pager" data-go="' + esc(prev) + '" aria-label="Previous project">' + ICON.prev + "</button>" +
          '<span class="pager-pos">' + pad(idx + 1) + " / " + pad(vis.length) + "</span>" +
          '<button type="button" class="pager" data-go="' + esc(next) + '" aria-label="Next project">' + ICON.next + "</button>" +
        "</div>" : "");

    showcase.classList.remove("is-entering");
    void showcase.offsetWidth;
    showcase.classList.add("is-entering");

    setFrame(frame, { instant: true });
    fitFrames();
  }

  /* Decide, per desktop frame, whether it is taller than the stage
     (pannable "cover") or wider (contained). */
  function fitFrames() {
    var r = stage.clientWidth / Math.max(1, stage.clientHeight);
    [].forEach.call(stage.querySelectorAll(".shot img"), function (img) {
      var w = Number(img.getAttribute("width")) || img.naturalWidth;
      var h = Number(img.getAttribute("height")) || img.naturalHeight;
      img.classList.toggle("is-tall", !!(w && h && w / h < r - 0.02));
    });
    updateHint();
  }

  function activeFrameEl() { return stage.querySelector('.frame[data-i="' + frame + '"]'); }

  function canPan(el) {
    if (!el) return false;
    var tall = el.querySelector(".shot img.is-tall");
    if (tall) return true;
    var scr = el.querySelector(".phone-screen");
    return !!(scr && scr.scrollHeight > scr.clientHeight + 4);
  }
  function updateHint() { stage.classList.toggle("can-pan", canPan(activeFrameEl())); }

  function setFrame(i, opts) {
    opts = opts || {};
    if (!frames.length) return;
    frame = (i + frames.length) % frames.length;
    [].forEach.call(stage.querySelectorAll(".frame"), function (f) {
      var on = Number(f.dataset.i) === frame;
      f.classList.toggle("is-active", on);
      f.setAttribute("aria-hidden", on ? "false" : "true");
      if (!on) resetPan(f);
    });
    var m = frames[frame];
    var count = bar.querySelector(".bar-count");
    var label = bar.querySelector(".bar-label");
    if (count) count.textContent = pad(frame + 1) + " / " + pad(frames.length);
    if (label) label.textContent = m.caption || "";
    [].forEach.call(strip.querySelectorAll(".thumb"), function (t) {
      var on = Number(t.dataset.i) === frame;
      t.classList.toggle("is-active", on);
      if (on) t.setAttribute("aria-current", "true"); else t.removeAttribute("aria-current");
      if (on && !opts.instant) {
        var l = t.offsetLeft - (strip.clientWidth - t.offsetWidth) / 2;
        strip.scrollTo({ left: l, behavior: behavior() });
      }
    });
    updateHint();
    if (lb.open) renderLightbox();
  }
  function step(d) { if (frames.length > 1) setFrame(frame + d); }

  /* ---- hover-to-scroll inside the stage ---- */
  var panTarget = null, panY = 0, panRAF = 0;
  function resetPan(f) {
    var img = f.querySelector(".shot img");
    if (img) img.style.objectPosition = "";
    var scr = f.querySelector(".phone-screen");
    if (scr) scr.scrollTo({ top: 0, behavior: reduceMQ.matches ? "auto" : "smooth" });
  }
  function panTick() {
    panRAF = 0;
    if (!panTarget) return;
    var dest = panY * (panTarget.scrollHeight - panTarget.clientHeight);
    var cur = panTarget.scrollTop;
    var nxt = reduceMQ.matches ? dest : cur + (dest - cur) * 0.14;
    panTarget.scrollTop = nxt;
    if (Math.abs(dest - nxt) > 0.5) panRAF = requestAnimationFrame(panTick);
  }
  stage.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse" || !frames.length) return;
    var f = activeFrameEl(); if (!f) return;
    var img = f.querySelector(".shot img.is-tall");
    if (img) {
      var r = stage.getBoundingClientRect();
      var y = Math.min(1, Math.max(0, (e.clientY - r.top - r.height * 0.12) / (r.height * 0.76)));
      img.style.objectPosition = "50% " + (y * 100).toFixed(1) + "%";
      return;
    }
    var scr = f.querySelector(".phone-screen");
    if (scr && scr.scrollHeight > scr.clientHeight) {
      var rs = scr.getBoundingClientRect();
      panY = Math.min(1, Math.max(0, (e.clientY - rs.top - rs.height * 0.1) / (rs.height * 0.8)));
      panTarget = scr;
      if (!panRAF) panRAF = requestAnimationFrame(panTick);
    }
  });
  stage.addEventListener("pointerleave", function () {
    panTarget = null;
    var f = activeFrameEl(); if (f) resetPan(f);
  });

  /* ---- click / swipe ---- */
  var swipe = null;
  stage.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse") return;
    swipe = { x: e.clientX, y: e.clientY, t: Date.now(), moved: false };
  });
  stage.addEventListener("pointerup", function (e) {
    if (!swipe) return;
    var dx = e.clientX - swipe.x, dy = e.clientY - swipe.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3 && Date.now() - swipe.t < 700) {
      swipe.moved = true;
      step(dx < 0 ? 1 : -1);
    }
    var s = swipe; setTimeout(function () { if (swipe === s) swipe = null; }, 0);
  });
  stage.addEventListener("pointercancel", function () { swipe = null; });
  stage.addEventListener("click", function (e) {
    if (!frames.length) return;
    if (swipe && swipe.moved) { swipe = null; return; }
    if (e.target.closest(".stage-open") || e.target.closest(".frame.is-active")) openLightbox();
  });

  bar.addEventListener("click", function (e) {
    var b = e.target.closest("[data-step]"); if (b) step(Number(b.dataset.step));
  });
  strip.addEventListener("click", function (e) {
    var t = e.target.closest(".thumb"); if (t) setFrame(Number(t.dataset.i));
  });
  info.addEventListener("click", function (e) {
    var b = e.target.closest("[data-go]"); if (!b) return;
    openProject(b.dataset.go, { replace: true });
  });

  /* ================= Lightbox ================= */
  function renderLightbox() {
    if (lbCase) return;
    var m = frames[frame]; if (!m) return;
    var p = bySlug(current);
    lbTitle.innerHTML = esc(p.title) + (m.caption ? ' <span>' + esc(m.caption) + "</span>" : "");
    lbCount.textContent = pad(frame + 1) + " / " + pad(frames.length);
    lb.classList.toggle("is-single", frames.length < 2);
    lbBody.innerHTML = '<figure class="lb-frame' + (isPhone(m) ? " is-phone" : "") + '">' + frameHTML(m, 0, "lb") + "</figure>";
    lbBody.scrollTop = 0;
  }
  function openLightbox() {
    if (!frames.length || !lb.showModal) return;
    lbCase = null;
    renderLightbox();
    D.documentElement.classList.add("lb-open");
    lb.showModal();
    D.getElementById("lb-close").focus();
  }
  lb.addEventListener("close", function () {
    D.documentElement.classList.remove("lb-open");
    if (lbCase) {
      var b = lbCase.btn; lbCase = null;
      if (b && b.isConnected) b.focus({ preventScroll: true });
      return;
    }
    var o = stage.querySelector(".stage-open"); if (o) o.focus({ preventScroll: true });
  });
  lb.addEventListener("click", function (e) {
    var s = e.target.closest("[data-step]");
    if (s) { step(Number(s.dataset.step)); return; }
    if (e.target.closest("#lb-close")) { lb.close(); return; }
    if (e.target === lbBody || e.target === lb || e.target.classList.contains("lb-frame")) lb.close();
  });

  /* ================= Keyboard ================= */
  D.addEventListener("keydown", function (e) {
    if (e.altKey || e.metaKey || e.ctrlKey || e.defaultPrevented) return;
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    var t = e.target;
    if (lb.open) { e.preventDefault(); if (!lbCase) step(e.key === "ArrowLeft" ? -1 : 1); return; }
    if (t && t.closest && (t.closest("input, textarea, select, [contenteditable]") || t.closest(".index") || t.closest("#case-study"))) return;
    if (!inView && !(t && t.closest && t.closest("#showcase"))) return;
    if (frames.length < 2) return;
    e.preventDefault();
    step(e.key === "ArrowLeft" ? -1 : 1);
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { inView = en[0].isIntersecting; }, { threshold: 0.4 }).observe(stage);
  } else { inView = true; }

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
        '<a href="#project-view" data-jump="project-view" class="cs-top">Back to the frames ↑</a>' +
      "</footer>";
    caseEl.hidden = false;
  }

  function scrollToEl(el, instant) {
    // The project view is its own scroll container (the canvas underneath never moves).
    var r = el.getBoundingClientRect(), pr = projectView.getBoundingClientRect();
    var off = (pvBar.offsetHeight || 0) + 16;
    projectView.scrollTo({ top: Math.max(0, projectView.scrollTop + r.top - pr.top - off), behavior: instant ? "auto" : behavior() });
  }
  function jumpTo(id) {
    var el = D.getElementById(id); if (!el || !isOpen()) return;
    scrollToEl(el, false);
    if (id === "case-study") {
      try { var u = new URL(window.location.href); u.hash = "case-study"; history.replaceState(history.state, "", u.pathname + u.search + u.hash); } catch (e) {}
      var h = D.getElementById("cs-title"); if (h) h.focus({ preventScroll: true });
    }
  }
  projectView.addEventListener("click", function (e) {
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


  /* ================= Selection ================= */
  function select(slug) {
    var p = bySlug(slug);
    if (!p) return;
    if (slug !== current) frame = 0;
    current = slug;
    renderShowcase(p);
    renderCase(p);
  }

  /* =================================================================
     CANVAS
     World coordinates are CSS px at 100% zoom. Positions live here so the
     composition is easy to tune; content comes from projects.js.
     ================================================================= */
  var COL = 340, GX = 48, GY = 104, TH = 240;          // typographic artboard
  var STEP = COL + GX;
  var PLACE = {
    digital:     { x: 760,  y: -300 },                 // cover row, then a 4-column grid
    visual:      { x: -430, y: 800,  cols: 2 },        // under the title
    engineering: { x: -430, y: 1290, cols: 2 }
  };
  var NOTES = {                                        // [x, y] world; rotation is on the element
    "note-about":       [-400, 214],
    "note-contact":     [-56, 262],
    "note-experience":  [760 + 3 * STEP + 20, 912],
    "note-education":   [780, 1300],
    "note-recognition": [780 + STEP, 1314]
  };

  var boards = [];          // { el, slug, frame, x, y, w, h, primary }
  var sectionRects = {};    // key -> world rect
  var cam = null;

  function boardHTML(p, b) {
    var label = esc(p.title) + (b.suffix ? '<span class="ab-suffix"> · ' + esc(b.suffix) + "</span>" : "");
    var head = b.primary
      ? '<h3 class="ab-label">' + label + "</h3>"
      : '<span class="ab-label" aria-hidden="true">' + label + "</span>";
    var body;
    if (b.media) {
      var m = b.media;
      body = '<span class="ab-frame ab-img' + (b.phone ? " is-phone" : "") + '">' +
        '<img src="' + esc(m.src) + '" alt="' + esc(m.alt) + '" width="' + esc(m.width) + '" height="' + esc(m.height) + '" loading="lazy" decoding="async" draggable="false"></span>';
    } else {
      var scope = (p.scope || []).join(" · ");
      var award = p.award ? p.award.split(",")[0].replace(" — ", " · ") : "";
      body = '<span class="ab-frame ab-type" data-cat="' + esc(p.category) + '">' +
        '<span class="t-top"><span class="t-ctx">' + esc(p.context || CATS[p.category]) + "</span>" +
          (p.year ? '<span class="t-year">' + esc(p.year) + "</span>" : "") + "</span>" +
        (award ? '<span class="t-award">' + ICON.star + "<span>" + esc(award) + "</span></span>" : "") +
        '<span class="t-bot"><span class="t-title">' + esc(p.title) + "</span>" +
          (scope ? '<span class="t-scope">' + esc(scope) + "</span>" : "") + "</span>" +
        "</span>";
    }
    var sel = '<span class="ab-sel" aria-hidden="true"><i class="tl"></i><i class="tr"></i><i class="bl"></i><i class="br"></i>' +
      '<span class="ab-dim">' + b.w + " × " + b.h + "</span></span>";
    return head + body + sel;
  }

  function addBoard(p, b) {
    var a = D.createElement("a");
    a.className = "ab" + (b.media ? " ab--img" : " ab--type");
    a.href = "?project=" + encodeURIComponent(p.slug);
    a.dataset.slug = p.slug;
    a.dataset.frame = b.frame || 0;
    a.draggable = false;
    a.style.cssText = "left:" + b.x + "px;top:" + b.y + "px;width:" + b.w + "px;height:" + b.h + "px;";
    a.setAttribute("aria-label", p.title + ", " + (p.context || CATS[p.category]) + (p.year ? ", " + p.year : "") + (p.award ? ", award winner" : ""));
    if (!b.primary) { a.tabIndex = -1; a.setAttribute("aria-hidden", "true"); }
    a.innerHTML = boardHTML(p, b);
    var img = a.querySelector("img");
    if (img) img.addEventListener("error", function () {
      // a missing preview falls back to the typographic artboard
      a.className = "ab ab--type";
      var f = a.querySelector(".ab-frame"); var tmp = D.createElement("div");
      tmp.innerHTML = boardHTML(p, { w: b.w, h: b.h, primary: b.primary });
      f.parentNode.replaceChild(tmp.querySelector(".ab-frame"), f);
    }, { once: true });
    boardsEl.appendChild(a);
    b.el = a; b.slug = p.slug;
    boards.push(b);
  }

  function addSectionLabel(s, x, y, n) {
    var h = D.createElement("h2");
    h.className = "cv-sec";
    h.id = "sec-" + s.key;
    h.style.cssText = "left:" + x + "px;top:" + y + "px;";
    h.innerHTML = esc(s.label) + ' <span class="cv-sec-n">' + pad(n) + "</span>";
    boardsEl.appendChild(h);
  }

  function buildCanvas() {
    SECTIONS.forEach(function (s) {
      var list = projects.filter(function (p) { return p.category === s.key; });
      var P = PLACE[s.key], x0 = P.x, y0 = P.y, cols = P.cols || 4;
      addSectionLabel(s, x0, y0, list.length);
      var gx = 0, gy = y0, maxX = x0, maxY = y0;
      list.forEach(function (p) {
        var m = mediaOf(p);
        var desk = m.filter(function (f) { return !isPhone(f); })[0];
        var phone = m.filter(isPhone)[0];
        if (s.key === "digital" && desk && cols === 4 && gx === 0 && gy === y0) {
          // The lead project: desktop cover across three columns + its mobile frame.
          var hh = 752, dw = 3 * COL + 2 * GX;
          addBoard(p, { x: x0, y: y0, w: dw, h: hh, media: desk, frame: m.indexOf(desk), primary: true, suffix: phone ? "Desktop" : "" });
          if (phone) addBoard(p, { x: x0 + 3 * STEP, y: y0, w: COL, h: hh, media: phone, phone: true, frame: m.indexOf(phone), primary: false, suffix: "Mobile" });
          gy = y0 + hh + GY; maxY = gy - GY; maxX = x0 + 4 * STEP - GX;
          return;
        }
        var bx = x0 + gx * STEP;
        addBoard(p, { x: bx, y: gy, w: COL, h: TH, media: desk || null, frame: desk ? m.indexOf(desk) : 0, primary: true });
        maxX = Math.max(maxX, bx + COL); maxY = Math.max(maxY, gy + TH);
        gx++;
        if (gx >= cols) { gx = 0; gy += TH + GY; }
      });
      sectionRects[s.key] = { x: x0, y: y0 - 60, w: maxX - x0, h: maxY - y0 + 60 };
    });

    // place notes
    Object.keys(NOTES).forEach(function (id) {
      var el = D.getElementById(id); if (!el) return;
      el.style.left = NOTES[id][0] + "px";
      el.style.top = NOTES[id][1] + "px";
      el.style.setProperty("--r", (Number(el.dataset.r) || 0) + "deg");
    });
    var intro = D.getElementById("cv-intro");
    intro.style.left = intro.dataset.x + "px";
    intro.style.top = intro.dataset.y + "px";
    intro.style.width = intro.dataset.w + "px";
  }

  function elRect(el) {
    return { x: parseFloat(el.style.left) || 0, y: parseFloat(el.style.top) || 0, w: el.offsetWidth, h: el.offsetHeight };
  }
  function union(rs) {
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    rs.forEach(function (r) { x0 = Math.min(x0, r.x); y0 = Math.min(y0, r.y); x1 = Math.max(x1, r.x + r.w); y1 = Math.max(y1, r.y + r.h); });
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }
  function contentRect() {
    var rs = boards.map(function (b) { return b; });
    [].forEach.call(world.querySelectorAll(".note, .cv-intro"), function (el) { rs.push(elRect(el)); });
    var u = union(rs);
    return { x: u.x, y: u.y - 70, w: u.w, h: u.h + 70 };   // room for the section labels
  }
  function introRect() { return elRect(D.getElementById("cv-intro")); }

  function isNarrow() { return window.innerWidth < 720; }
  function chromePad() {
    // keep framed things clear of the top bar and the HUD
    return isNarrow() ? { t: 76, r: 18, b: 92, l: 18 } : { t: 88, r: 56, b: 104, l: 56 };
  }
  function landingView() {
    var s = cam.size(), r = introRect();
    if (isNarrow()) {
      // phones: the title near the top, the file continuing below it
      var zn = Math.min(.62, (s.w - 40) / r.w);
      return { x: r.x + r.w / 2, y: r.y - 10 + (s.h / 2 - 104) / zn, z: zn };
    }
    // desktop: the title, with the work peeking in from the right and below
    var z = Math.max(.45, Math.min(.82, s.w / 2100, s.h / 1300));
    return { x: r.x + r.w / 2 + 160, y: r.y + r.h / 2 + 60, z: z };
  }
  function fitAllView() { return cam.fit(contentRect(), chromePad()); }
  function updateZoomLimits() {
    var f = fitAllView();
    cam.setZoomLimits(Math.min(.25, f.z * .85), isNarrow() ? 3 : 2.5);
    var b = contentRect();
    cam.setBounds(b);
  }

  /* ---------- camera + HUD ---------- */
  var hudZoom = D.getElementById("hud-zoom");
  var hintTimer = 0, hinted = false;
  function dismissHint() {
    if (hinted) return; hinted = true;
    setTimeout(function () { hint.classList.add("is-gone"); }, 500);
  }

  function initCamera() {
    cam = new window.Camera(vp, world, {
      reduceMotion: reduced,
      onInteract: function () { dismissHint(); closeMenu(); },
      isFrame: function (t) { return t && t.closest && t.closest(".ab, .note"); }
    });
    var far = null;
    cam.onChange(function (x, y, z) {
      hudZoom.textContent = Math.round(z * 100) + "%";
      // like a design tool, frame names step aside when the frames get tiny
      var f = z < .3;
      if (f !== far) { far = f; world.classList.toggle("is-far", f); }
    });
    updateZoomLimits();
    window.addEventListener("resize", function () {
      if (root.classList.contains("view-list")) return;
      var before = cam.size();
      cam.resize();
      updateZoomLimits();
      if (isOpen() && openBoard) cam.set(cam.fit(openBoard, chromePad(), 3));
      else if (before.w !== cam.size().w && !moved) cam.set(landingView());
    });
  }
  var moved = false;     // the visitor has moved the camera themselves

  hud.addEventListener("click", function (e) {
    var zb = e.target.closest("[data-zoom]");
    if (zb) { moved = true; cam.zoomAt(cam.get().z * (zb.dataset.zoom === "1" ? 1.5 : 1 / 1.5), null, null, true); return; }
    if (e.target.closest("#hud-zoom")) { moved = true; cam.zoomAt(1, null, null, true); return; }
    if (e.target.closest("#hud-fit")) { moved = true; cam.animateTo(fitAllView(), { duration: 560 }); return; }
    if (e.target.closest("#hud-sections")) { toggleMenu(); return; }
    var j = e.target.closest("[data-jump-to]");
    if (j) { closeMenu(); flyTo(j.dataset.jumpTo); }
  });

  var menu = D.getElementById("hud-menu");
  var menuBtn = D.getElementById("hud-sections");
  var JUMPS = [
    ["intro", "Intro"],
    ["digital", "Digital products"],
    ["visual", "Visual & content"],
    ["engineering", "Engineering studies"],
    ["note-about", "About"],
    ["note-contact", "Contact"],
    ["all", "Fit all"]
  ];
  D.getElementById("hud-menu-list").innerHTML = JUMPS.map(function (j) {
    var n = sectionCount(j[0]);
    return '<li><button type="button" data-jump-to="' + j[0] + '"><span>' + esc(j[1]) + "</span>" + (n ? "<small>" + pad(n) + "</small>" : "") + "</button></li>";
  }).join("");
  function sectionCount(k) { var n = projects.filter(function (p) { return p.category === k; }).length; return n || 0; }
  function openMenu() { menu.hidden = false; menuBtn.setAttribute("aria-expanded", "true"); var f = menu.querySelector("button"); if (f) f.focus(); }
  function closeMenu(refocus) {
    if (menu.hidden) return;
    menu.hidden = true; menuBtn.setAttribute("aria-expanded", "false");
    if (refocus) menuBtn.focus();
  }
  function toggleMenu() { if (menu.hidden) openMenu(); else closeMenu(); }
  D.addEventListener("pointerdown", function (e) { if (!menu.hidden && !e.target.closest(".hud-jump")) closeMenu(); });
  menu.addEventListener("keydown", function (e) {
    var bs = [].slice.call(menu.querySelectorAll("button")), i = bs.indexOf(D.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); bs[(i + 1) % bs.length].focus(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); bs[(i - 1 + bs.length) % bs.length].focus(); }
  });

  function flyTo(key) {
    moved = true;
    var r, zMax = 1.1;
    if (key === "all") { cam.animateTo(fitAllView(), { duration: 600 }); return; }
    if (key === "intro") { cam.animateTo(landingView(), { duration: 600 }); return; }
    if (sectionRects[key]) r = sectionRects[key];
    else { var el = D.getElementById(key); if (!el) return; r = elRect(el); zMax = 1.2; r = { x: r.x - 160, y: r.y - 120, w: r.w + 320, h: r.h + 240 }; }
    cam.animateTo(cam.fit(r, chromePad(), zMax), { duration: 600 });
  }

  /* ---------- sticky notes: click one to bring it up to reading size ---------- */
  world.addEventListener("click", function (e) {
    var n = e.target.closest(".note");
    if (!n || e.target.closest("a")) return;
    var r = elRect(n), v = cam.get(), s = cam.size();
    if (v.z * r.w > Math.min(360, s.w * .7)) return;          // already readable
    moved = true; dismissHint();
    var zz = Math.min(isNarrow() ? (s.w - 48) / r.w : 1.25, 2);
    cam.animateTo(cam.fit({ x: r.x - 40, y: r.y - 40, w: r.w + 80, h: r.h + 80 }, chromePad(), zz), { duration: 520 });
  });

  /* ---------- artboards: keyboard focus brings them into view ---------- */
  function boardFor(el) { for (var i = 0; i < boards.length; i++) if (boards[i].el === el) return boards[i]; return null; }
  function primaryBoard(slug) { for (var i = 0; i < boards.length; i++) if (boards[i].slug === slug && boards[i].primary) return boards[i]; return null; }
  world.addEventListener("focusin", function (e) {
    var t = e.target;
    var el = t.closest && t.closest(".ab, .note");
    if (!el || isOpen() || opening) return;
    var kb = false; try { kb = t.matches(":focus-visible"); } catch (err) { kb = true; }
    if (!kb) return;
    var r = el.classList.contains("ab") ? boardFor(el) : elRect(el);
    var v = cam.get(), s = cam.size(), pd = chromePad();
    var a = cam.toScreen(r.x, r.y), b = cam.toScreen(r.x + r.w, r.y + r.h);
    var visible = a.x >= pd.l && a.y >= pd.t && b.x <= s.w - pd.r && b.y <= s.h - pd.b;
    if (visible && (b.x - a.x) > 140) return;
    var zz = Math.max(v.z, Math.min(1, 0.36 * s.w / r.w));
    var f = cam.fit({ x: r.x - 120, y: r.y - 100, w: r.w + 240, h: r.h + 200 }, pd, zz);
    cam.animateTo(f, { duration: 420 });
    moved = true;
  });

  /* ---------- open a frame: zoom in, then the project view ---------- */
  var saved = null;          // camera before zooming into a frame
  var opening = false;
  var openBoard = null;      // board rect the camera is parked on while a project is open
  var openTimer = 0;

  boardsEl.addEventListener("click", function (e) {
    var a = e.target.closest(".ab"); if (!a) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;   // new tab etc. stays native
    e.preventDefault();
    openFromCanvas(a);
  });

  function openFromCanvas(a) {
    if (opening || isOpen()) return;
    var b = boardFor(a); if (!b) return;
    dismissHint(); closeMenu();
    saved = cam.get();
    opening = true;
    openBoard = b;
    world.classList.add("is-focusing");
    a.classList.add("is-target");
    var target = cam.fit(b, chromePad(), 3);
    var dur = 560;
    if (reduced()) { opening = false; openProject(b.slug, { frame: Number(a.dataset.frame) || 0 }); return; }
    clearTimeout(openTimer);
    openTimer = setTimeout(function () {
      // the project view starts fading in over the last part of the dive
      if (!opening) return;
      opening = false;
      openProject(b.slug, { frame: Number(a.dataset.frame) || 0 });
    }, dur * .72);
    cam.animateTo(target, {
      duration: dur,
      onCancel: function () {
        if (opening) { opening = false; clearTimeout(openTimer); world.classList.remove("is-focusing"); a.classList.remove("is-target"); openBoard = null; }
      }
    });
  }

  /* ================= Project view (overlay) ================= */
  function isOpen() { return !projectView.hidden; }
  function view() { return root.classList.contains("view-list") ? "list" : "canvas"; }
  function setURL(slug, mode) {
    // mode: "push" | "replace" | null. Fails quietly where history is restricted (some file:// setups).
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
  var pushed = false; // true while the open project sits on a history entry we pushed
  var baseTitle = D.title;
  var leaveTimer = 0;

  function sectionLabel(p) { for (var i = 0; i < SECTIONS.length; i++) if (SECTIONS[i].key === p.category) return SECTIONS[i].label; return ""; }

  function openProject(slug, opts) {
    opts = opts || {};
    var p = bySlug(slug);
    if (!p) return;
    var wasOpen = isOpen();
    clearTimeout(leaveTimer);
    projectView.classList.remove("is-leaving");
    if (opts.frame != null && slug !== current) { current = null; }
    select(slug);
    if (opts.frame != null) setFrame(opts.frame, { instant: true });
    projectView.hidden = false;
    projectView.setAttribute("aria-label", p.title);
    root.classList.add("pv-open");
    canvasEl.inert = true; listView.inert = true; topbar.inert = true;
    pvCrumb.innerHTML = "<span>" + esc(sectionLabel(p)) + '</span><span aria-hidden="true">/</span><b>' + esc(p.title) + "</b>";
    pvBackLabel.textContent = view() === "list" ? "All work" : "Canvas";

    // keep the camera parked on this project's frame (it is what Back zooms out from)
    if (view() === "canvas" && cam) {
      var b = primaryBoard(slug);
      if (b) {
        if (!saved) saved = landingView();
        openBoard = b;
        world.classList.add("is-focusing");
        [].forEach.call(boardsEl.querySelectorAll(".ab.is-target"), function (x) { x.classList.remove("is-target"); });
        if (!opts.keepTarget) b.el.classList.add("is-target");
        if (wasOpen || opts.instant) cam.set(cam.fit(b, chromePad(), 3));
      }
    }

    var mode = opts.history === null ? null : (opts.replace || wasOpen ? "replace" : "push");
    if (setURL(slug, mode) && mode === "push") pushed = true;
    D.title = p.title + " — Hediyeh Khodashenas";
    if (opts.target === "case-study" && !caseEl.hidden) scrollToEl(caseEl, true);
    else projectView.scrollTop = 0;
    if (!opts.noFocus) backBtn.focus({ preventScroll: true });
  }

  function closeProject(opts) {
    opts = opts || {};
    if (!isOpen()) return;
    if (pushed && opts.history !== null) {
      // Step back to the canvas entry so the browser Back button stays in sync.
      pushed = false;
      pendingFocus = !opts.noFocus;
      history.back();
      return;
    }
    pushed = false;
    if (lb.open) lb.close();
    var last = current;
    canvasEl.inert = false; listView.inert = false; topbar.inert = false;
    root.classList.remove("pv-open");
    D.title = baseTitle;
    if (opts.history !== null) setURL(null, "replace");

    var finish = function () { projectView.hidden = true; projectView.classList.remove("is-leaving"); };
    if (reduced()) finish();
    else { projectView.classList.add("is-leaving"); leaveTimer = setTimeout(finish, 240); }

    if (view() === "canvas" && cam) {
      var back = saved || landingView();
      saved = null;
      var tgt = openBoard && openBoard.el;
      openBoard = null;
      world.classList.remove("is-focusing");
      cam.animateTo(cam.clampView(back), { duration: 540, cb: function () { if (tgt) tgt.classList.remove("is-target"); } });
      if (tgt && !reduced()) setTimeout(function () { tgt.classList.remove("is-target"); }, 560); else if (tgt) tgt.classList.remove("is-target");
      var pb = primaryBoard(last);
      if (pb && !opts.noFocus) pb.el.focus({ preventScroll: true });
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
  info.addEventListener("click", function (e) {
    var b = e.target.closest("[data-go]"); if (!b) return;
    openProject(b.dataset.go, { replace: true });
  });
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
      if (!menu.hidden) { e.preventDefault(); closeMenu(true); return; }
      if (isOpen()) { e.preventDefault(); closeProject(); return; }
      return;
    }
    if (isOpen() || lb.open || view() !== "canvas" || !cam) return;
    if (e.altKey || e.metaKey || e.ctrlKey) return;
    if (t && t.closest && (t.closest("input, textarea, select, [contenteditable]") || t.closest(".hud-menu"))) return;
    var k = e.key, step = e.shiftKey ? 320 : 120, done = true;
    if (k === "ArrowLeft" || k === "a" || k === "A") cam.panBy(-step, 0, true);
    else if (k === "ArrowRight" || k === "d" || k === "D") cam.panBy(step, 0, true);
    else if (k === "ArrowUp" || k === "w" || k === "W") cam.panBy(0, -step, true);
    else if (k === "ArrowDown" || k === "s" || k === "S") cam.panBy(0, step, true);
    else if (k === "+" || k === "=") cam.zoomAt(cam.get().z * 1.5, null, null, true);
    else if (k === "-" || k === "_") cam.zoomAt(cam.get().z / 1.5, null, null, true);
    else if (k === "0") cam.animateTo(fitAllView(), { duration: 560 });
    else if (k === "1") cam.zoomAt(1, null, null, true);
    else done = false;
    if (done) { e.preventDefault(); moved = true; dismissHint(); }
  });

  /* ================= List view ================= */
  function buildList() {
    var groups = D.getElementById("lv-groups");
    groups.innerHTML = SECTIONS.map(function (s) {
      var list = projects.filter(function (p) { return p.category === s.key; });
      return '<section class="lv-group" aria-labelledby="lv-' + s.key + '">' +
        '<h3 class="lv-sec" id="lv-' + s.key + '">' + esc(s.label) + ' <span>' + pad(list.length) + "</span></h3>" +
        '<ol class="lv-list">' + list.map(function (p) {
          var m = mediaOf(p).filter(function (f) { return !isPhone(f); })[0];
          var thumb = m
            ? '<span class="lv-thumb"><img src="' + esc(m.src) + '" alt="" loading="lazy" decoding="async" width="' + esc(m.width) + '" height="' + esc(m.height) + '"></span>'
            : '<span class="lv-thumb is-type" data-cat="' + esc(p.category) + '" data-mono="' + esc((p.title || "").trim().charAt(0)) + '" aria-hidden="true"><span class="lv-scope">' +
                (p.scope || []).slice(0, 3).map(function (x) { return "<span>" + esc(x) + "</span>"; }).join("") + "</span></span>";
          var sub = [p.context || CATS[p.category], p.year].filter(Boolean).join(" · ");
          return '<li><a class="lv-item" href="?project=' + encodeURIComponent(p.slug) + '" data-slug="' + esc(p.slug) + '">' + thumb +
            '<span class="lv-text"><span class="lv-name">' + esc(p.title) + (p.award ? '<span class="lv-award" title="Award">' + ICON.star + '<span class="sr">Award</span></span>' : "") + "</span>" +
            '<span class="lv-sub">' + esc(sub) + "</span></span>" +
            '<span class="lv-go" aria-hidden="true">' + ICON.next + "</span></a></li>";
        }).join("") + "</ol></section>";
    }).join("");
    // About: the same notes as the canvas, set as a calm grid
    var about = D.getElementById("lv-about");
    about.innerHTML = '<h3 class="lv-sec">About</h3><div class="lv-notes">' +
      ["note-about", "note-experience", "note-education", "note-recognition"].map(function (id) {
        var n = D.getElementById(id);
        var html = n.innerHTML.replace(/\sid="[^"]*"/g, "").replace(/<h2 class="note-h"/g, '<h4 class="note-h"').replace(/<\/h2>/g, "</h4>");
        return '<div class="lv-note">' + html + "</div>";
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
  D.getElementById("skip-link").addEventListener("click", function (e) {
    e.preventDefault(); setView("list"); listView.focus();
  });
  D.getElementById("tb-home").addEventListener("click", function (e) {
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    if (view() === "canvas") { moved = false; cam.animateTo(landingView(), { duration: 600 }); }
    else window.scrollTo({ top: 0, behavior: behavior() });
  });

  /* ================= Init ================= */
  buildCanvas();
  buildList();
  initCamera();
  [].forEach.call(D.querySelectorAll(".js-year"), function (y) { y.textContent = new Date().getFullYear(); });

  var initial = null;
  try { initial = new URL(window.location.href).searchParams.get("project"); } catch (e) {}
  var startList = window.location.hash === "#list";
  setView(startList ? "list" : "canvas", { silent: true });

  if (bySlug(initial)) {
    // Deep link: straight into the project. Back zooms out to the canvas.
    root.classList.add("no-intro");
    try { history.replaceState({ project: initial }, "", window.location.href); } catch (e) {}
    var target = hashTarget();
    saved = landingView();
    openProject(initial, { history: null, noFocus: true, target: target, instant: true });
    if (target === "case-study" && !caseEl.hidden) {
      // Web fonts and images can shift layout while loading; re-settle on the case study
      // as they arrive, unless the visitor has already scrolled away.
      var settledY = projectView.scrollTop;
      var settleCS = function () {
        if (Math.abs(projectView.scrollTop - settledY) < 4 && isOpen() && !caseEl.hidden) { scrollToEl(caseEl, true); settledY = projectView.scrollTop; }
      };
      if (D.readyState !== "complete") window.addEventListener("load", settleCS, { once: true });
      if (D.fonts && D.fonts.ready) D.fonts.ready.then(settleCS);
      setTimeout(settleCS, 600);
    }
  } else if (!startList) {
    // A quick, non-blocking intro: the file opens and settles on the title.
    var land = landingView();
    if (reduced()) cam.set(land);
    else {
      cam.set({ x: land.x, y: land.y + 40 / land.z, z: land.z * .9 });
      root.classList.add("is-intro");
      setTimeout(function () { root.classList.remove("is-intro"); }, 1400);
      requestAnimationFrame(function () {
        cam.animateTo(land, { duration: 900, force: true, ease: function (t) { return 1 - Math.pow(1 - t, 4); } });
      });
    }
    hintTimer = setTimeout(dismissHint, 12000);
  }
  if (D.fonts && D.fonts.ready) D.fonts.ready.then(function () { updateZoomLimits(); });
  requestAnimationFrame(function () { root.classList.add("is-ready"); });
})();
