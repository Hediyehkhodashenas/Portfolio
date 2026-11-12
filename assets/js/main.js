(function () {
  "use strict";
  var D = document;
  var projects = window.PROJECTS || [];
  var CATS = { digital: "Digital product", visual: "Visual & content", engineering: "Engineering study" };

  var list = D.getElementById("project-list");
  var showcase = D.getElementById("showcase");
  var workIndex = D.getElementById("work-index");
  var projectView = D.getElementById("project-view");
  var backBtn = D.getElementById("pv-back");
  var workSec = D.getElementById("work");
  var root = D.documentElement;
  var stage = D.getElementById("stage");
  var bar = D.getElementById("stage-bar");
  var strip = D.getElementById("strip");
  var info = D.getElementById("info");
  var lb = D.getElementById("lightbox");
  var lbBody = D.getElementById("lb-body");
  var lbTitle = D.getElementById("lb-title");
  var lbCount = D.getElementById("lb-count");
  var peek = D.getElementById("peek");
  var masthead = D.getElementById("masthead");
  var filters = [].slice.call(D.querySelectorAll(".filter"));
  var reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  var hoverMQ = window.matchMedia("(hover: hover) and (pointer: fine)");

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

  /* ================= Index ================= */
  projects.forEach(function (p, i) {
    p.no = pad(i + 1);
    var m = mediaOf(p);
    var li = D.createElement("li");
    li.className = "item";
    li.dataset.cat = p.category;
    li.dataset.slug = p.slug;
    var initial = (p.title || "").trim().charAt(0);
    li.innerHTML =
      '<button class="row" type="button" aria-controls="project-view" id="row-' + esc(p.slug) + '">' +
        '<span class="row-no" aria-hidden="true">' + p.no + "</span>" +
        '<span class="row-prev' + (m.length ? " has-img" : " is-empty") + '" data-cat="' + esc(p.category) + '" aria-hidden="true">' +
          (m.length
            ? '<img src="' + esc(m[0].src) + '" alt="" loading="lazy" decoding="async" draggable="false">' +
              (m.length > 1 ? '<span class="row-prev-n">' + pad(m.length) + "</span>" : "")
            : '<span class="row-prev-mark">' + esc(initial) + "</span>") +
        "</span>" +
        '<span class="row-title">' + esc(p.title) + (p.award ? '<span class="row-award" title="Award">' + ICON.star + '<span class="sr">Award</span></span>' : "") + "</span>" +
        '<span class="row-meta">' + esc(p.context || CATS[p.category]) + "</span>" +
        '<span class="row-year">' + esc(p.year || "") + "</span>" +
        '<span class="row-go" aria-hidden="true">' + ICON.next + "</span>" +
        (m.length ? '<span class="sr">, ' + m.length + " frames</span>" : "") +
      "</button>";
    var pimg = li.querySelector(".row-prev img");
    if (pimg) pimg.addEventListener("error", function () {
      var slot = pimg.parentNode;
      slot.className = "row-prev is-empty";
      slot.innerHTML = '<span class="row-prev-mark">' + esc(initial) + "</span>";
    }, { once: true });
    list.appendChild(li);
  });

  ["all", "digital", "visual", "engineering"].forEach(function (k) {
    var n = k === "all" ? projects.length : projects.filter(function (p) { return p.category === k; }).length;
    [].forEach.call(D.querySelectorAll('[data-count="' + k + '"]'), function (el) { el.textContent = pad(n); });
  });

  function items() { return [].slice.call(list.querySelectorAll(".item")); }
  function visibleItems() { return items().filter(function (li) { return !li.hidden; }); }

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
    var vis = visibleItems();
    var idx = vis.findIndex(function (li) { return li.dataset.slug === p.slug; });
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
      (p.note ? '<p class="info-note">' + esc(p.note) + "</p>" : "") +
      (links.length ? '<p class="info-links">' + links.map(function (l) {
        return '<a href="' + esc(l.href) + '" target="_blank" rel="noopener">' + esc(l.label || "View") + " ↗</a>";
      }).join("") + "</p>" : "") +
      (prev && next ?
        '<div class="info-pager">' +
          '<button type="button" class="pager" data-go="' + esc(prev.dataset.slug) + '" aria-label="Previous project">' + ICON.prev + "</button>" +
          '<span class="pager-pos">' + pad(idx + 1) + " / " + pad(vis.length) + "</span>" +
          '<button type="button" class="pager" data-go="' + esc(next.dataset.slug) + '" aria-label="Next project">' + ICON.next + "</button>" +
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
    renderLightbox();
    D.documentElement.classList.add("lb-open");
    lb.showModal();
    D.getElementById("lb-close").focus();
  }
  lb.addEventListener("close", function () {
    D.documentElement.classList.remove("lb-open");
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
    if (lb.open) { e.preventDefault(); step(e.key === "ArrowLeft" ? -1 : 1); return; }
    if (t && t.closest && (t.closest("input, textarea, select, [contenteditable]") || t.closest(".index"))) return;
    if (!inView && !(t && t.closest && t.closest("#showcase"))) return;
    if (frames.length < 2) return;
    e.preventDefault();
    step(e.key === "ArrowLeft" ? -1 : 1);
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { inView = en[0].isIntersecting; }, { threshold: 0.4 }).observe(stage);
  } else { inView = true; }

  /* ================= Selection ================= */
  function select(slug) {
    var p = bySlug(slug);
    if (!p) return;
    if (slug !== current) frame = 0;
    current = slug;
    items().forEach(function (li) { li.classList.toggle("is-active", li.dataset.slug === slug); });
    renderShowcase(p);
  }

  /* ================= Index <-> project view ================= */
  function isOpen() { return !projectView.hidden; }
  function setURL(slug, mode) {
    // mode: "push" | "replace" | null. Fails quietly where history is restricted (some file:// setups).
    if (!mode) return false;
    try {
      var url = new URL(window.location.href);
      if (slug) url.searchParams.set("project", slug); else url.searchParams.delete("project");
      url.hash = slug ? "" : "work";
      var href = url.pathname + url.search + url.hash;
      if (mode === "push") history.pushState({ project: slug || null }, "", href);
      else history.replaceState({ project: slug || null }, "", href);
      return true;
    } catch (e) { return false; }
  }
  var pushed = false; // true while the open project sits on a history entry we pushed
  function scrollToWork(instant) {
    var r = workSec.getBoundingClientRect();
    var off = (masthead.offsetHeight || 0) + 8;
    window.scrollTo({ top: Math.max(0, window.scrollY + r.top - off), behavior: instant ? "auto" : behavior() });
  }

  function openProject(slug, opts) {
    opts = opts || {};
    if (!bySlug(slug)) return;
    hidePeek();
    var wasOpen = isOpen();
    workIndex.hidden = true;
    projectView.hidden = false;
    root.classList.add("is-project");
    select(slug);
    var mode = opts.history === null ? null : (opts.replace || wasOpen ? "replace" : "push");
    if (setURL(slug, mode) && mode === "push") pushed = true;
    D.title = bySlug(slug).title + " — Hediyeh Khodashenas";
    scrollToWork(true);
    if (!opts.noFocus) backBtn.focus({ preventScroll: true });
  }

  function closeProject(opts) {
    opts = opts || {};
    if (!isOpen()) return;
    if (pushed && opts.history !== null) {
      // Step back to the index entry so the browser Back button stays in sync.
      pushed = false;
      pendingFocus = !opts.noFocus;
      history.back();
      return;
    }
    pushed = false;
    if (lb.open) lb.close();
    var last = current;
    projectView.hidden = true;
    workIndex.hidden = false;
    root.classList.remove("is-project");
    D.title = baseTitle;
    if (opts.history !== null) setURL(null, "replace");
    // reveal-on-scroll items in the index should be visible on return
    [].forEach.call(workIndex.querySelectorAll("[data-reveal]"), function (el) { el.classList.add("is-in"); });
    var row = last && D.getElementById("row-" + last);
    var li = row && row.parentNode;
    if (row && li && !li.hidden) {
      var r = row.getBoundingClientRect();
      window.scrollTo({ top: Math.max(0, window.scrollY + r.top - window.innerHeight * 0.35), behavior: "auto" });
      if (!opts.noFocus) row.focus({ preventScroll: true });
    } else {
      scrollToWork(true);
    }
  }

  var baseTitle = D.title;
  backBtn.addEventListener("click", function (e) { e.preventDefault(); closeProject(); });
  [].forEach.call(D.querySelectorAll('[data-nav="work"], .wordmark'), function (a) {
    a.addEventListener("click", function (e) {
      if (!isOpen()) return;
      e.preventDefault();
      closeProject({ noFocus: true });
      if (a.classList.contains("wordmark")) window.scrollTo({ top: 0, behavior: "auto" });
    });
  });
  D.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen() && !lb.open && !e.defaultPrevented) { e.preventDefault(); closeProject(); }
  });
  var pendingFocus = false;
  window.addEventListener("popstate", function () {
    var slug = null;
    try { slug = new URL(window.location.href).searchParams.get("project"); } catch (e) {}
    var focus = pendingFocus; pendingFocus = false;
    if (bySlug(slug)) openProject(slug, { history: null, noFocus: true });
    else closeProject({ history: null, noFocus: !focus });
  });

  /* ================= Filters ================= */
  function applyFilter(key) {
    filters.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.filter === key ? "true" : "false"); });
    var n = 0;
    items().forEach(function (li) {
      var show = key === "all" || li.dataset.cat === key;
      li.hidden = !show;
      li.classList.remove("is-entering");
      if (show) { li.style.setProperty("--i", n); n++; }
    });
    void list.offsetWidth;
    visibleItems().forEach(function (li) { li.classList.add("is-entering"); });
  }
  filters.forEach(function (b) { b.addEventListener("click", function () { applyFilter(b.dataset.filter); }); });

  list.addEventListener("click", function (e) {
    var row = e.target.closest(".row"); if (!row) return;
    openProject(row.parentNode.dataset.slug);
  });
  list.addEventListener("keydown", function (e) {
    var row = e.target.closest(".row"); if (!row) return;
    var rows = visibleItems().map(function (li) { return li.querySelector(".row"); });
    var i = rows.indexOf(row), j = -1;
    if (e.key === "ArrowDown") j = Math.min(rows.length - 1, i + 1);
    else if (e.key === "ArrowUp") j = Math.max(0, i - 1);
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = rows.length - 1;
    if (j < 0) return;
    e.preventDefault();
    rows[j].focus();
  });

  /* ---- cursor-following preview on index rows with images ---- */
  var peekImg = peek.querySelector("img");
  var px = 0, py = 0, tx = 0, ty = 0, peekRAF = 0, peekOn = false;
  function peekTick() {
    px += (tx - px) * (reduceMQ.matches ? 1 : 0.18);
    py += (ty - py) * (reduceMQ.matches ? 1 : 0.18);
    peek.style.transform = "translate3d(" + px.toFixed(1) + "px," + py.toFixed(1) + "px,0)";
    peekRAF = (peekOn && (Math.abs(tx - px) > 0.3 || Math.abs(ty - py) > 0.3)) ? requestAnimationFrame(peekTick) : 0;
  }
  function hidePeek() { peekOn = false; peek.classList.remove("is-on"); }
  list.addEventListener("pointermove", function (e) {
    if (!hoverMQ.matches || e.pointerType !== "mouse") return;
    var li = e.target.closest(".item");
    var p = li && bySlug(li.dataset.slug);
    var m = p && mediaOf(p)[0];
    if (!m) { hidePeek(); return; }
    if (peekImg.getAttribute("src") !== m.src) peekImg.src = m.src;
    tx = e.clientX + 24; ty = e.clientY - 90;
    if (!peekOn) { px = tx; py = ty; peekOn = true; peek.classList.add("is-on"); }
    if (!peekRAF) peekRAF = requestAnimationFrame(peekTick);
  });
  list.addEventListener("pointerleave", hidePeek);
  window.addEventListener("scroll", function () { if (peekOn) hidePeek(); }, { passive: true });

  window.addEventListener("resize", function () { if (frames.length) fitFrames(); });

  /* ================= Masthead, nav, reveal ================= */
  var onScroll = function () { masthead.classList.toggle("is-scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var navLinks = [].slice.call(D.querySelectorAll("[data-nav]"));
  if ("IntersectionObserver" in window) {
    var state = {};
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { state[en.target.id] = en.isIntersecting; });
      var active = state.about ? "about" : state.work ? "work" : null;
      navLinks.forEach(function (a) {
        if (a.dataset.nav === active) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["work", "about"].forEach(function (id) { var s = D.getElementById(id); if (s) navIO.observe(s); });

    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); revealIO.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
    [].forEach.call(D.querySelectorAll("[data-reveal]"), function (el) { revealIO.observe(el); });
  } else {
    [].forEach.call(D.querySelectorAll("[data-reveal]"), function (el) { el.classList.add("is-in"); });
  }

  /* ================= Initial state ================= */
  // No query: show the preview index only. ?project=<slug>: open that project's full design.
  var initial = null;
  try { initial = new URL(window.location.href).searchParams.get("project"); } catch (e) {}
  applyFilter("all");
  if (bySlug(initial)) {
    try { history.replaceState({ project: initial }, "", window.location.href); } catch (e) {}
    openProject(initial, { history: null, noFocus: true });
  }

  var y = D.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
