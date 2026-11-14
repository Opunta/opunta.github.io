/* opunta — site etkileşimleri: tema, dil, menü, reveal, kubbe ışıkları, kartlar, form */
(function () {
  "use strict";

  /* ---------- Tema ---------- */
  var themeBtn = document.getElementById("theme-toggle");
  function syncThemeBtn() {
    if (themeBtn) {
      var dark = document.documentElement.getAttribute("data-theme") === "dark";
      /* Koyu tema = sürgü hilalde (sol), açık tema = güneşte (sağ, .on) */
      themeBtn.classList.toggle("on", !dark);
      themeBtn.setAttribute("aria-checked", dark ? "true" : "false");
      themeBtn.setAttribute("title", dark ? "Aydınlık temaya geç" : "Karanlık temaya geç");
    }
  }
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var dark = document.documentElement.getAttribute("data-theme") === "dark";
      var next = dark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("opunta-theme", next); } catch (e) {}
      syncThemeBtn();
    });
  }
  syncThemeBtn();

  /* ---------- Dil (TR varsayılan, EN sözlükten) ---------- */
  var originals = new Map();
  var originalsPh = new Map();
  document.querySelectorAll("[data-i18n],[data-i18n-html]").forEach(function (el) {
    originals.set(el, el.innerHTML);
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
    originalsPh.set(el, el.getAttribute("placeholder") || "");
  });

  function applyLang(lang) {
    var dict = (window.OPUNTA_I18N && window.OPUNTA_I18N[lang]) || null;
    document.querySelectorAll("[data-i18n],[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n") || el.getAttribute("data-i18n-html");
      if (lang === "tr") {
        el.innerHTML = originals.get(el);
      } else if (dict && Object.prototype.hasOwnProperty.call(dict, key)) {
        el.innerHTML = dict[key];
      }
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-ph");
      if (lang === "tr") {
        el.setAttribute("placeholder", originalsPh.get(el));
      } else if (dict && Object.prototype.hasOwnProperty.call(dict, key)) {
        el.setAttribute("placeholder", dict[key]);
      }
    });
    document.documentElement.setAttribute("lang", lang);
    var langBtn = document.getElementById("lang-toggle");
    if (langBtn) {
      /* TR = sürgü solda, EN = sürgü sağda (.on) */
      langBtn.classList.toggle("on", lang === "en");
      langBtn.setAttribute("aria-checked", lang === "en" ? "true" : "false");
      langBtn.setAttribute("title", lang === "tr" ? "Switch to English" : "Türkçeye geç");
    }
    try { localStorage.setItem("opunta-lang", lang); } catch (e) {}
  }

  var langBtn = document.getElementById("lang-toggle");
  if (langBtn) {
    langBtn.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("lang") === "en" ? "en" : "tr";
      applyLang(cur === "en" ? "tr" : "en");
    });
  }
  var savedLang = null;
  try { savedLang = localStorage.getItem("opunta-lang"); } catch (e) {}
  if (savedLang === "en") applyLang("en");

  /* ---------- Şeffaf üst çubuk: kaydırınca opak ---------- */
  var header = document.querySelector(".site-header");
  if (header && document.body.classList.contains("has-hero")) {
    var onScroll = function () {
      header.classList.toggle("solid", window.scrollY > 32);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobil menü ---------- */
  var menuBtn = document.getElementById("menu-toggle");
  var nav = document.getElementById("main-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Kaydıkça görünüm ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Kubbe ışık geçişleri (tüm kubbeler, mor + lime) ---------- */
  var streakLayers = document.querySelectorAll(".streak-layer");
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (streakLayers.length && !reduced) {
    streakLayers.forEach(function (layer) {
      function spawnStreak() {
        var w = layer.clientWidth, h = layer.clientHeight;
        if (!w || !h) { setTimeout(spawnStreak, 1200); return; }
        var s = document.createElement("span");
        // Mor ağırlıklı, arada lime ışık
        s.className = "streak" + (Math.random() < 0.38 ? " lime" : "");
        // Kubbe yayı üzerinde rastgele iki nokta
        var side = Math.random() < 0.5 ? 1 : -1;
        var x0 = w * (0.08 + Math.random() * 0.35);
        var y0 = h * (0.10 + Math.random() * 0.45);
        var x1 = x0 + side * w * (0.25 + Math.random() * 0.3);
        var y1 = y0 + (Math.random() - 0.35) * h * 0.35;
        var ang = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI;
        s.style.setProperty("--x0", x0 + "px");
        s.style.setProperty("--y0", y0 + "px");
        s.style.setProperty("--x1", x1 + "px");
        s.style.setProperty("--y1", y1 + "px");
        s.style.setProperty("--ang", ang + "deg");
        s.style.setProperty("--dur", (1.5 + Math.random() * 1.4) + "s");
        s.style.width = (90 + Math.random() * 130) + "px";
        layer.appendChild(s);
        s.addEventListener("animationend", function () { s.remove(); });
        // Sık aralıklarla yeni ışık — dinamik görünüm
        setTimeout(spawnStreak, 650 + Math.random() * 1350);
      }
      // Görünür olduğunda başlat (çift ışıkla açılış)
      var startObs = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { spawnStreak(); spawnStreak(); startObs.disconnect(); }
      }, { threshold: 0.2 });
      startObs.observe(layer);
    });
  }

  /* ---------- Genişletilebilir kartlar ---------- */
  document.querySelectorAll(".xcard").forEach(function (card) {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    if (!card.hasAttribute("aria-expanded")) card.setAttribute("aria-expanded", "false");
    function toggle() {
      card.setAttribute("aria-expanded", card.getAttribute("aria-expanded") === "true" ? "false" : "true");
    }
    card.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      toggle();
    });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });
  });

  /* ---------- İletişim formu -> e-posta ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; };
      var name = v("cf-name"), email = v("cf-email"), phone = v("cf-phone"),
          subject = v("cf-subject"), message = v("cf-message");
      var tr = document.documentElement.getAttribute("lang") !== "en";
      var bodyLines = tr
        ? ["Gönderen: " + name, "E-posta: " + email, "Telefon: " + phone, "", message]
        : ["From: " + name, "Email: " + email, "Phone: " + phone, "", message];
      var href = "mailto:social@opunta.com"
        + "?subject=" + encodeURIComponent(subject || (tr ? "Web sitesi iletişim formu" : "Website contact form"))
        + "&body=" + encodeURIComponent(bodyLines.join("\n"));
      window.location.href = href;
      var st = document.getElementById("form-status");
      if (st) st.classList.add("ok");
    });
  }
})();

window.__mainJsReady = true;
