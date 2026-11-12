(function () {
  "use strict";
  var D = document;
  var projects = window.PROJECTS || [];
  var CATS = { digital: "Digital product", visual: "Visual & content", engineering: "Engineering study" };
  var FILTER_LABEL = { all: "All projects", digital: "Digital products", visual: "Visual & content", engineering: "Engineering studies" };

  var list = D.getElementById("project-list");
  var detail = D.getElementById("detail");
  var detailHome = D.getElementById("detail-home");
  var caption = D.getElementById("index-caption");
  var filters = Array.prototype.slice.call(D.querySelectorAll(".filter"));
  var narrowMQ = window.matchMedia("(max-width: 899px)");
  var reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

  var activeFilter = "all";
  var current = null;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function bySlug(slug) {
    for (var i = 0; i < projects.length; i++) if (projects[i].slug === slug) return projects[i];
    return null;
  }

  /* ---------- Build the index ---------- */
  projects.forEach(function (p, i) {
    p.no = String(i + 1).padStart(2, "0");
    var li = D.createElement("li");
    li.className = "item";
    li.dataset.cat = p.category;
    li.dataset.slug = p.slug;
    li.innerHTML =
      '<button class="row" type="button" aria-pressed="false" aria-controls="detail" id="row-' + esc(p.slug) + '">' +
        '<span class="row-no" aria-hidden="true">' + p.no + "</span>" +
        '<span class="row-main">' +
          '<span class="row-title">' + esc(p.title) + "</span>" +
          '<span class="row-cat">' + esc(CATS[p.category]) + (p.context ? " · " + esc(p.context) : "") + "</span>" +
        "</span>" +
        '<span class="row-year">' + esc(p.year) + (p.award ? '<span class="row-award" title="Award">Award</span>' : "") + "</span>" +
        '<span class="row-arrow" aria-hidden="true">' +
          '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>' +
        "</span>" +
      "</button>";
    list.appendChild(li);
  });

  // filter counts
  ["all", "digital", "visual", "engineering"].forEach(function (k) {
    var n = k === "all" ? projects.length : projects.filter(function (p) { return p.category === k; }).length;
    var el = D.querySelector('[data-count="' + k + '"]');
    if (el) el.textContent = String(n).padStart(2, "0");
  });

  function items() { return Array.prototype.slice.call(list.querySelectorAll(".item")); }
  function visibleItems() { return items().filter(function (li) { return !li.hidden; }); }

  /* ---------- Detail rendering ---------- */
  function renderDetail(p) {
    var vis = visibleItems();
    var idx = vis.findIndex(function (li) { return li.dataset.slug === p.slug; });
    var prev = vis.length > 1 ? vis[(idx - 1 + vis.length) % vis.length] : null;
    var next = vis.length > 1 ? vis[(idx + 1) % vis.length] : null;
    var media = (p.media || []).filter(function (m) { return m && m.src; });
    var links = (p.links || []).filter(function (l) { return l && l.href; });

    var facts = [["Role", p.role], ["Context", p.context], ["Year", p.year]]
      .filter(function (f) { return f[1]; })
      .map(function (f) { return "<div><dt>" + f[0] + "</dt><dd>" + esc(f[1]) + "</dd></div>"; }).join("");

    var html =
      '<div class="detail-inner">' +
        '<div class="detail-top">' +
          '<p class="detail-kicker"><span class="dot" data-cat="' + esc(p.category) + '"></span>' + esc(CATS[p.category]) + "</p>" +
          '<span class="detail-no" aria-hidden="true">' + p.no + "</span>" +
        "</div>" +
        '<h3 class="detail-title">' + esc(p.title) + "</h3>" +
        (p.award ? '<p class="detail-award"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 1.5l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.3l-3.8 2 .7-4.3-3.1-3 4.3-.6z" fill="currentColor"/></svg>' + esc(p.award) + "</p>" : "") +
        '<p class="detail-summary">' + esc(p.summary) + "</p>" +
        (media.length ? '<div class="detail-media">' + media.map(function (m) {
          var phone = m.width && Number(m.width) <= 500;
          return '<figure class="media' + (phone ? " media-phone" : "") + '"><img src="' + esc(m.src) + '" alt="' + esc(m.alt) + '" loading="lazy" decoding="async"' +
            (m.width ? ' width="' + esc(m.width) + '"' : "") + (m.height ? ' height="' + esc(m.height) + '"' : "") + ">" +
            (m.caption ? "<figcaption>" + esc(m.caption) + "</figcaption>" : "") + "</figure>";
        }).join("") + "</div>" : "") +
        '<dl class="detail-facts">' + facts + "</dl>" +
        (p.scope && p.scope.length ? '<div class="detail-scope"><p class="label">Scope</p><ul class="tags">' +
          p.scope.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul></div>" : "") +
        (p.note ? '<p class="detail-note">' + esc(p.note) + "</p>" : "") +
        (links.length ? '<p class="detail-links">' + links.map(function (l) {
          return '<a href="' + esc(l.href) + '" target="_blank" rel="noopener">' + esc(l.label || "View") + " ↗</a>";
        }).join("") + "</p>" : "") +
        (prev && next ? '<div class="detail-pager">' +
          '<button type="button" class="pager" data-go="' + esc(prev.dataset.slug) + '"><span aria-hidden="true">←</span> <span class="pager-label">Previous</span></button>' +
          '<span class="pager-pos">' + String(idx + 1).padStart(2, "0") + " / " + String(vis.length).padStart(2, "0") + "</span>" +
          '<button type="button" class="pager" data-go="' + esc(next.dataset.slug) + '"><span class="pager-label">Next</span> <span aria-hidden="true">→</span></button>' +
        "</div>" : "") +
      "</div>";

    detail.innerHTML = html;
    detail.setAttribute("aria-labelledby", "row-" + p.slug);

    // never leave a broken image frame behind
    Array.prototype.forEach.call(detail.querySelectorAll(".media img"), function (img) {
      img.addEventListener("error", function () {
        var fig = img.closest("figure"); var wrap = fig && fig.parentNode;
        if (fig) fig.remove();
        if (wrap && !wrap.children.length) wrap.remove();
      });
    });

    detail.classList.remove("is-entering");
    void detail.offsetWidth;
    detail.classList.add("is-entering");
  }

  function placeDetail() {
    if (narrowMQ.matches && current) {
      var li = list.querySelector('.item[data-slug="' + current + '"]');
      if (li && detail.parentNode !== li) li.appendChild(detail);
    } else if (detail.parentNode !== detailHome) {
      detailHome.appendChild(detail);
    }
  }

  function select(slug, opts) {
    opts = opts || {};
    var p = bySlug(slug);
    if (!p) return;
    current = slug;
    items().forEach(function (li) {
      var on = li.dataset.slug === slug;
      li.classList.toggle("is-active", on);
      li.querySelector(".row").setAttribute("aria-pressed", on ? "true" : "false");
    });
    renderDetail(p);
    placeDetail();

    if (opts.user) {
      try {
        var url = new URL(window.location.href);
        url.searchParams.set("project", slug);
        url.hash = "";
        history.replaceState(null, "", url.pathname + url.search);
      } catch (e) {}
    }
    if (opts.scroll) {
      var target = narrowMQ.matches ? list.querySelector('.item[data-slug="' + slug + '"]') : detail;
      var rect = target.getBoundingClientRect();
      var off = (D.getElementById("masthead").offsetHeight || 0) + 12;
      if (rect.top < off || rect.top > window.innerHeight * 0.6) {
        window.scrollTo({ top: window.scrollY + rect.top - off, behavior: reduceMQ.matches ? "auto" : "smooth" });
      }
    }
  }

  /* ---------- Filtering ---------- */
  function applyFilter(key, fromUser) {
    activeFilter = key;
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
    caption.textContent = FILTER_LABEL[key] + " — " + String(n).padStart(2, "0");

    var vis = visibleItems();
    var stillVisible = vis.some(function (li) { return li.dataset.slug === current; });
    if (!stillVisible && vis.length) select(vis[0].dataset.slug, { user: fromUser });
    else if (current) select(current, {});
  }

  filters.forEach(function (b) {
    b.addEventListener("click", function () { applyFilter(b.dataset.filter, true); });
  });

  list.addEventListener("click", function (e) {
    var row = e.target.closest(".row");
    if (!row) return;
    var slug = row.parentNode.dataset.slug;
    select(slug, { user: true, scroll: narrowMQ.matches });
  });

  // Arrow-key navigation within the list
  list.addEventListener("keydown", function (e) {
    var row = e.target.closest(".row");
    if (!row) return;
    var rows = visibleItems().map(function (li) { return li.querySelector(".row"); });
    var i = rows.indexOf(row), j = -1;
    if (e.key === "ArrowDown") j = Math.min(rows.length - 1, i + 1);
    else if (e.key === "ArrowUp") j = Math.max(0, i - 1);
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = rows.length - 1;
    if (j < 0) return;
    e.preventDefault();
    rows[j].focus();
    select(rows[j].parentNode.dataset.slug, { user: true });
  });

  detail.addEventListener("click", function (e) {
    var b = e.target.closest("[data-go]");
    if (!b) return;
    var slug = b.dataset.go;
    select(slug, { user: true, scroll: true });
    var row = D.getElementById("row-" + slug);
    if (row && narrowMQ.matches) row.focus({ preventScroll: true });
  });

  var onMQ = function () { placeDetail(); };
  if (narrowMQ.addEventListener) narrowMQ.addEventListener("change", onMQ); else narrowMQ.addListener(onMQ);

  /* ---------- Initial state ---------- */
  var initial = null;
  try { initial = new URL(window.location.href).searchParams.get("project"); } catch (e) {}
  if (!bySlug(initial)) initial = null;
  applyFilter("all", false);
  if (projects.length) select(initial || projects[0].slug, {});
  if (initial) {
    requestAnimationFrame(function () {
      var w = D.getElementById("work");
      if (w) w.scrollIntoView({ behavior: "auto" });
    });
  }

  /* ---------- Masthead + nav state ---------- */
  var masthead = D.getElementById("masthead");
  var onScroll = function () { masthead.classList.toggle("is-scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var navLinks = Array.prototype.slice.call(D.querySelectorAll("[data-nav]"));
  if ("IntersectionObserver" in window) {
    var sections = ["work", "about"].map(function (id) { return D.getElementById(id); }).filter(Boolean);
    var state = {};
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { state[en.target.id] = en.isIntersecting; });
      var active = state.about ? "about" : state.work ? "work" : null;
      navLinks.forEach(function (a) {
        if (a.dataset.nav === active) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navIO.observe(s); });

    /* ---------- Gentle reveal ---------- */
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); revealIO.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    Array.prototype.forEach.call(D.querySelectorAll("[data-reveal]"), function (el) { revealIO.observe(el); });
  } else {
    Array.prototype.forEach.call(D.querySelectorAll("[data-reveal]"), function (el) { el.classList.add("is-in"); });
  }

  var y = D.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
