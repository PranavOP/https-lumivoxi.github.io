/* ══════════════════════════════════════════════════
   NEXUS GAMES — script.js
   Starfield · Cursor · Scroll effects · Counters
   ══════════════════════════════════════════════════ */

(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia("(hover: none)").matches;

  /* ─────────────────────────────────────────────────
     1. ANIMATED STARFIELD CANVAS
  ───────────────────────────────────────────────── */
  (function starfield() {
    var canvas = document.getElementById("starfield");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var stars = [];
    var W, H;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function makeStars(count) {
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.4 + 0.2,
          a: Math.random(),
          speed: Math.random() * 0.3 + 0.05,
          drift: (Math.random() - 0.5) * 0.08
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Subtle deep space nebula gradient
      var nebula = ctx.createRadialGradient(W * 0.7, H * 0.2, 0, W * 0.7, H * 0.2, W * 0.55);
      nebula.addColorStop(0, "rgba(0,245,255,0.015)");
      nebula.addColorStop(0.5, "rgba(157,0,255,0.01)");
      nebula.addColorStop(1, "transparent");
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, W, H);

      var nebula2 = ctx.createRadialGradient(W * 0.2, H * 0.8, 0, W * 0.2, H * 0.8, W * 0.4);
      nebula2.addColorStop(0, "rgba(255,0,128,0.012)");
      nebula2.addColorStop(1, "transparent");
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, W, H);

      // Draw stars
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200,230,255," + s.a + ")";
        ctx.fill();

        // Twinkle
        s.a += (Math.random() - 0.5) * 0.02;
        s.a = Math.max(0.05, Math.min(0.9, s.a));

        // Slow drift upward
        s.y -= s.speed;
        s.x += s.drift;
        if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }
        if (s.x < -2) s.x = W + 2;
        if (s.x > W + 2) s.x = -2;
      }

      if (!reduce) requestAnimationFrame(draw);
    }

    resize();
    makeStars(200);
    window.addEventListener("resize", function () { resize(); makeStars(200); });
    draw();
  })();

  /* ─────────────────────────────────────────────────
     2. CURSOR GLOW (desktop only)
  ───────────────────────────────────────────────── */
  (function cursorGlow() {
    if (isTouch || reduce) return;
    var glow = document.getElementById("cursorGlow");
    if (!glow) return;

    document.addEventListener("mousemove", function (e) {
      glow.style.opacity = "1";
      glow.style.left = e.clientX + "px";
      glow.style.top  = e.clientY + "px";
    });
    document.addEventListener("mouseleave", function () {
      glow.style.opacity = "0";
    });
  })();

  /* ─────────────────────────────────────────────────
     3. NAVBAR — scroll state + mobile toggle
  ───────────────────────────────────────────────── */
  (function navbar() {
    var nav    = document.getElementById("nav");
    var toggle = document.getElementById("navToggle");
    var links  = document.getElementById("navLinks");

    window.addEventListener("scroll", function () {
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 40);
    });

    if (toggle && links) {
      toggle.addEventListener("click", function () {
        links.classList.toggle("open");
      });
      links.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { links.classList.remove("open"); });
      });
    }
  })();

  /* ─────────────────────────────────────────────────
     4. GAME CARD — apply dynamic accent colors
  ───────────────────────────────────────────────── */
  (function cardColors() {
    document.querySelectorAll(".game-card[data-color]").forEach(function (card) {
      var color = card.getAttribute("data-color");
      card.style.setProperty("--c", color);

      // Also update the card-glow radial gradient to match
      var glow = card.querySelector(".card-glow");
      if (glow && color) {
        glow.style.background =
          "radial-gradient(600px circle at 50% 50%, " + color + "0f, transparent 70%)";
      }

      // Badge colors
      var badge = card.querySelector(".card-badge");
      if (badge) {
        badge.style.borderColor = color + "44";
        badge.style.color = color;
      }

      // Card button color
      var btn = card.querySelector(".card-btn");
      if (btn) btn.style.color = color;
    });
  })();

  /* ─────────────────────────────────────────────────
     5. SCROLL REVEAL
  ───────────────────────────────────────────────── */
  (function scrollReveal() {
    var els = document.querySelectorAll(
      ".game-card, .section-head, .about-text, .about-specs, .spec-card, .lb-placeholder"
    );

    // Add reveal class
    els.forEach(function (el) {
      if (!el.classList.contains("reveal")) el.classList.add("reveal");
    });

    // Add stagger delays to game cards
    document.querySelectorAll(".game-card").forEach(function (card, i) {
      card.style.transitionDelay = (i * 0.08) + "s";
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in-view");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });

    els.forEach(function (el) { io.observe(el); });
  })();

  /* ─────────────────────────────────────────────────
     6. ANIMATED COUNTERS (hero stats)
  ───────────────────────────────────────────────── */
  (function counters() {
    var nums = document.querySelectorAll(".hstat-num[data-count]");
    var done = false;

    var io = new IntersectionObserver(function (entries) {
      if (done) return;
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          done = true;
          nums.forEach(function (el) { countUp(el); });
        }
      });
    }, { threshold: 0.5 });

    if (nums.length) io.observe(nums[0]);

    function countUp(el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      if (target === 0) { el.textContent = "0"; return; }
      var dur = 1200, t0 = null;
      function step(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(step);
      }
      if (!reduce) requestAnimationFrame(step);
      else el.textContent = target;
    }
  })();

  /* ─────────────────────────────────────────────────
     7. FOOTER YEAR
  ───────────────────────────────────────────────── */
  var yr = document.getElementById("footerYear");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ─────────────────────────────────────────────────
     8. GAME CARD — hover parallax tilt (desktop)
  ───────────────────────────────────────────────── */
  (function tilt() {
    if (isTouch || reduce) return;
    document.querySelectorAll(".game-card:not(.coming-soon)").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r  = card.getBoundingClientRect();
        var cx = r.left + r.width  / 2;
        var cy = r.top  + r.height / 2;
        var dx = (e.clientX - cx) / (r.width  / 2);
        var dy = (e.clientY - cy) / (r.height / 2);
        var rx = -dy * 5;   // degrees
        var ry =  dx * 5;
        card.style.transform =
          "translateY(-6px) perspective(800px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  })();

})();
