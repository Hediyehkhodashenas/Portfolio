/*
  CAMERA — pan / zoom for the design canvas.
  ------------------------------------------------------------------
  One CSS transform on the world layer (translate + scale), driven by
  requestAnimationFrame. Pointer events for mouse, pen and touch:
    drag to pan (with momentum), two fingers to pinch, wheel / trackpad
    to pan, ctrl/⌘ + wheel or trackpad pinch to zoom, double-click to
    zoom in. Soft bounds pull the view back if you drift off the content.
  The camera knows nothing about projects; main.js tells it what to frame.
*/
(function () {
  "use strict";

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function easeInOut(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 4); }

  function Camera(vp, world, opt) {
    opt = opt || {};
    var self = this;
    var cx = 0, cy = 0, z = 1;          // world point at the viewport centre, and scale
    var W = 1, H = 1;
    var minZ = opt.minZ || .2, maxZ = opt.maxZ || 2.5;
    var bounds = opt.bounds || { x: -1000, y: -1000, w: 2000, h: 2000 };
    var reduce = opt.reduceMotion || function () { return false; };
    var listeners = [];
    var anim = null, inertia = null, raf = 0;
    var lastIZ = -1, moving = false, idleT = 0;

    /* ---------- render ---------- */
    function apply() {
      var tx = W / 2 - cx * z, ty = H / 2 - cy * z;
      world.style.transform = "translate3d(" + tx.toFixed(2) + "px," + ty.toFixed(2) + "px,0) scale(" + z.toFixed(5) + ")";
      var iz = 1 / z;
      if (Math.abs(iz - lastIZ) > 1e-4) { world.style.setProperty("--iz", iz.toFixed(5)); lastIZ = iz; }
      // Dot grid: keep the on-screen spacing between 16 and 32 px, like a design tool.
      var s = 24 * z; while (s < 16) s *= 2; while (s > 32) s /= 2;
      vp.style.backgroundSize = s.toFixed(2) + "px " + s.toFixed(2) + "px";
      vp.style.backgroundPosition = (((tx % s) + s) % s).toFixed(2) + "px " + (((ty % s) + s) % s).toFixed(2) + "px";
      if (!moving) { moving = true; world.classList.add("is-moving"); }
      clearTimeout(idleT);
      idleT = setTimeout(function () { moving = false; world.classList.remove("is-moving"); }, 140);
      for (var i = 0; i < listeners.length; i++) listeners[i](cx, cy, z);
    }

    /* ---------- limits ---------- */
    // The view centre may wander past the content, but at least ~22% of the
    // smaller viewport side must still show content. Beyond that: rubber band.
    function limits(zz) {
      var keep = Math.min(W, H) * .22 / zz;
      var hx = W / 2 / zz - keep, hy = H / 2 / zz - keep;
      return {
        x0: bounds.x - Math.max(0, hx), x1: bounds.x + bounds.w + Math.max(0, hx),
        y0: bounds.y - Math.max(0, hy), y1: bounds.y + bounds.h + Math.max(0, hy)
      };
    }
    function rubber(v, a, b) {
      if (v < a) return a - (a - v) * .28;
      if (v > b) return b + (v - b) * .28;
      return v;
    }
    function clampView(v) {
      var L = limits(v.z);
      return { x: clamp(v.x, L.x0, L.x1), y: clamp(v.y, L.y0, L.y1), z: v.z };
    }
    function outOfBounds() {
      var L = limits(z);
      return cx < L.x0 - .5 || cx > L.x1 + .5 || cy < L.y0 - .5 || cy > L.y1 + .5;
    }
    function settle() { if (outOfBounds()) self.animateTo(clampView({ x: cx, y: cy, z: z }), { duration: 380, ease: easeOut }); }

    /* ---------- animation ---------- */
    function stopAll() {
      if (anim && anim.onCancel) anim.onCancel();
      anim = null; inertia = null;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    }
    function tick(now) {
      raf = 0;
      if (anim) {
        var t = clamp((now - anim.t0) / anim.d, 0, 1), e = anim.ease(t);
        var zz = Math.exp(anim.lz0 + (anim.lz1 - anim.lz0) * e);
        if (anim.fixed) {
          // Zoom about the transform's fixed point: the motion reads as one smooth dive.
          var f = anim.fixed;
          cx = f.x - (f.sx - W / 2) / zz; cy = f.y - (f.sy - H / 2) / zz;
          // blend toward the exact target to cancel accumulated drift
          if (t === 1) { cx = anim.x1; cy = anim.y1; }
        } else {
          cx = anim.x0 + (anim.x1 - anim.x0) * e; cy = anim.y0 + (anim.y1 - anim.y0) * e;
        }
        z = zz;
        apply();
        if (t < 1) raf = requestAnimationFrame(tick);
        else { var done = anim.cb; anim = null; if (done) done(); }
        return;
      }
      if (inertia) {
        var dt = Math.min(32, now - inertia.t); inertia.t = now;
        cx -= inertia.vx * dt / z; cy -= inertia.vy * dt / z;
        var k = Math.exp(-dt / 280);
        inertia.vx *= k; inertia.vy *= k;
        apply();
        if (outOfBounds()) { inertia = null; settle(); return; }
        if (Math.abs(inertia.vx) + Math.abs(inertia.vy) > .02) raf = requestAnimationFrame(tick);
        else inertia = null;
      }
    }

    /* ---------- public ---------- */
    self.resize = function () {
      var r = vp.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      apply();
    };
    self.size = function () { return { w: W, h: H }; };
    self.get = function () { return { x: cx, y: cy, z: z }; };
    self.setBounds = function (b) { bounds = b; };
    self.setZoomLimits = function (a, b) { minZ = a; maxZ = b; };
    self.limits = function () { return { min: minZ, max: maxZ }; };
    self.onChange = function (fn) { listeners.push(fn); };
    self.isAnimating = function () { return !!anim; };
    self.stop = stopAll;
    self.set = function (v) { stopAll(); cx = v.x; cy = v.y; z = clamp(v.z, minZ, maxZ); apply(); };
    self.toWorld = function (sx, sy) { return { x: cx + (sx - W / 2) / z, y: cy + (sy - H / 2) / z }; };
    self.toScreen = function (wx, wy) { return { x: W / 2 + (wx - cx) * z, y: H / 2 + (wy - cy) * z }; };

    // View that fits a world rect, with padding in screen px {t,r,b,l}.
    self.fit = function (rect, pad, zMax) {
      pad = pad || {};
      var t = pad.t || 0, r = pad.r || 0, b = pad.b || 0, l = pad.l || 0;
      var aw = Math.max(40, W - l - r), ah = Math.max(40, H - t - b);
      var zz = clamp(Math.min(aw / rect.w, ah / rect.h), minZ, zMax || maxZ);
      // centre of the padded area, mapped back to the viewport centre
      var ox = (l - r) / 2, oy = (t - b) / 2;
      return { x: rect.x + rect.w / 2 - ox / zz, y: rect.y + rect.h / 2 - oy / zz, z: zz };
    };

    self.animateTo = function (v, o) {
      o = o || {};
      stopAll();
      var tz = clamp(v.z, minZ, maxZ);
      var d = o.duration == null ? 520 : o.duration;
      if (reduce() && !o.force) d = 0;
      if (d <= 0) { cx = v.x; cy = v.y; z = tz; apply(); if (o.cb) o.cb(); return; }
      var a = { t0: performance.now(), d: d, ease: o.ease || easeInOut, x0: cx, y0: cy, x1: v.x, y1: v.y,
        lz0: Math.log(z), lz1: Math.log(tz), cb: o.cb, onCancel: o.onCancel };
      // Fixed point of the move (world coords) when the scale changes meaningfully.
      var s0 = z, s1 = tz;
      if (Math.abs(Math.log(s1 / s0)) > .18) {
        var t0x = W / 2 - cx * s0, t0y = H / 2 - cy * s0, t1x = W / 2 - v.x * s1, t1y = H / 2 - v.y * s1;
        var fx = (t1x - t0x) / (s0 - s1), fy = (t1y - t0y) / (s0 - s1);
        var sx = s0 * fx + t0x, sy = s0 * fy + t0y;
        // only use it when the fixed point sits reasonably near the screen (otherwise the arc swings)
        if (sx > -W * .5 && sx < W * 1.5 && sy > -H * .5 && sy < H * 1.5) a.fixed = { x: fx, y: fy, sx: sx, sy: sy };
      }
      anim = a;
      raf = requestAnimationFrame(tick);
    };

    self.zoomAt = function (nz, sx, sy, animate) {
      nz = clamp(nz, minZ, maxZ);
      if (sx == null) { sx = W / 2; sy = H / 2; }
      var w = self.toWorld(sx, sy);
      var v = { x: w.x - (sx - W / 2) / nz, y: w.y - (sy - H / 2) / nz, z: nz };
      if (animate) self.animateTo(clampView(v), { duration: 260, ease: easeOut });
      else { stopAll(); cx = v.x; cy = v.y; z = nz; apply(); }
    };
    self.panBy = function (dx, dy, animate) {   // screen px
      var v = clampView({ x: cx + dx / z, y: cy + dy / z, z: z });
      if (animate) self.animateTo(v, { duration: 220, ease: easeOut });
      else { stopAll(); cx = v.x; cy = v.y; apply(); }
    };
    self.clampView = clampView;

    /* ---------- gestures ---------- */
    var ptrs = {}, nPtr = 0, drag = null, pinch = null;
    self.dragged = false;           // true right after a drag, so a click can be ignored

    function isUI(t) { return t && t.closest && t.closest("[data-cam-ignore]"); }
    function mid() {
      var ks = Object.keys(ptrs), a = ptrs[ks[0]], b = ptrs[ks[1]];
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, d: Math.hypot(a.x - b.x, a.y - b.y) || 1 };
    }
    function local(e) { var r = vp.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }

    vp.addEventListener("pointerdown", function (e) {
      if (isUI(e.target)) return;
      if (e.pointerType === "mouse" && e.button !== 0 && e.button !== 1) return;
      stopAll();
      var p = local(e);
      ptrs[e.pointerId] = { x: p.x, y: p.y };
      nPtr = Object.keys(ptrs).length;
      self.dragged = false;
      if (nPtr === 1) {
        drag = { id: e.pointerId, x: p.x, y: p.y, sx: p.x, sy: p.y, active: false, cx: cx, cy: cy, hist: [{ x: p.x, y: p.y, t: e.timeStamp }], touch: e.pointerType !== "mouse" };
        if (e.button === 1) e.preventDefault();
      } else if (nPtr === 2) {
        var m = mid();
        pinch = { d0: m.d, z0: z, w: self.toWorld(m.x, m.y) };
        drag = null;
        self.dragged = true;
        try { vp.setPointerCapture(e.pointerId); } catch (err) {}
      }
      if (opt.onInteract) opt.onInteract();
    });

    vp.addEventListener("pointermove", function (e) {
      if (!ptrs[e.pointerId]) return;
      var p = local(e);
      ptrs[e.pointerId] = { x: p.x, y: p.y };
      if (pinch && Object.keys(ptrs).length >= 2) {
        var m = mid();
        z = clamp(pinch.z0 * m.d / pinch.d0, minZ * .85, maxZ * 1.15);
        cx = pinch.w.x - (m.x - W / 2) / z; cy = pinch.w.y - (m.y - H / 2) / z;
        apply();
        return;
      }
      if (!drag || drag.id !== e.pointerId) return;
      var dx = p.x - drag.sx, dy = p.y - drag.sy;
      if (!drag.active) {
        if (Math.hypot(dx, dy) < (drag.touch ? 8 : 4)) return;
        drag.active = true; self.dragged = true;
        vp.classList.add("is-grabbing");
        try { vp.setPointerCapture(e.pointerId); } catch (err) {}
      }
      var L = limits(z);
      cx = rubber(drag.cx - dx / z, L.x0, L.x1);
      cy = rubber(drag.cy - dy / z, L.y0, L.y1);
      drag.hist.push({ x: p.x, y: p.y, t: e.timeStamp });
      if (drag.hist.length > 6) drag.hist.shift();
      apply();
    });

    function end(e) {
      if (!ptrs[e.pointerId]) return;
      delete ptrs[e.pointerId];
      var left = Object.keys(ptrs).length;
      vp.classList.remove("is-grabbing");
      if (pinch) {
        if (left < 2) {
          pinch = null;
          // snap back inside zoom limits, then continue as a one-finger drag
          if (z < minZ || z > maxZ) self.zoomAt(clamp(z, minZ, maxZ), W / 2, H / 2, true);
          else settle();
          if (left === 1) {
            var id = Object.keys(ptrs)[0], q = ptrs[id];
            drag = { id: Number(id), x: q.x, y: q.y, sx: q.x, sy: q.y, active: true, cx: cx, cy: cy, hist: [], touch: true };
          }
        }
        return;
      }
      if (drag && drag.id === e.pointerId) {
        var d = drag; drag = null;
        if (d.active) {
          var h = d.hist, n = h.length;
          if (!reduce() && n > 1 && e.type === "pointerup") {
            var a = h[0], b = h[n - 1], dt = Math.max(1, b.t - a.t);
            var vx = (b.x - a.x) / dt, vy = (b.y - a.y) / dt;
            if (e.timeStamp - b.t < 60 && Math.hypot(vx, vy) > .15 && !outOfBounds()) {
              inertia = { vx: clamp(vx, -4, 4), vy: clamp(vy, -4, 4), t: performance.now() };
              raf = requestAnimationFrame(tick);
              return;
            }
          }
          settle();
        }
      }
    }
    vp.addEventListener("pointerup", end);
    vp.addEventListener("pointercancel", end);
    vp.addEventListener("lostpointercapture", function (e) { if (ptrs[e.pointerId] && e.pointerType === "mouse") end(e); });

    // Swallow the click that ends a drag, so dragging across a frame never opens it.
    vp.addEventListener("click", function (e) {
      if (self.dragged) { e.preventDefault(); e.stopPropagation(); self.dragged = false; }
    }, true);

    var wheelEnd = 0;
    vp.addEventListener("wheel", function (e) {
      if (isUI(e.target)) return;
      e.preventDefault();
      stopAll();
      var p = local(e);
      var unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? H : 1;
      if (e.ctrlKey || e.metaKey) {
        var dy = clamp(e.deltaY * unit, -30, 30);
        self.zoomAt(z * Math.exp(-dy * .0105), p.x, p.y);
      } else {
        var dx = e.deltaX * unit, dy2 = e.deltaY * unit;
        if (e.shiftKey && !dx) { dx = dy2; dy2 = 0; }
        var L = limits(z);
        cx = rubber(cx + dx / z, L.x0, L.x1);
        cy = rubber(cy + dy2 / z, L.y0, L.y1);
        apply();
      }
      clearTimeout(wheelEnd);
      wheelEnd = setTimeout(settle, 160);
      if (opt.onInteract) opt.onInteract();
    }, { passive: false });

    // Safari trackpad pinch
    var gz = 1;
    vp.addEventListener("gesturestart", function (e) { e.preventDefault(); gz = z; });
    vp.addEventListener("gesturechange", function (e) {
      e.preventDefault();
      var p = local(e);
      self.zoomAt(gz * e.scale, p.x, p.y);
    });
    vp.addEventListener("gestureend", function (e) { e.preventDefault(); });

    vp.addEventListener("dblclick", function (e) {
      if (isUI(e.target) || (opt.isFrame && opt.isFrame(e.target))) return;
      var p = local(e);
      self.zoomAt(z * (e.shiftKey ? .5 : 2), p.x, p.y, true);
    });

    // A focused element inside an overflow:hidden box can scroll it; keep it pinned.
    vp.addEventListener("scroll", function () { vp.scrollTop = 0; vp.scrollLeft = 0; });

    self.resize();
  }

  window.Camera = Camera;
})();
