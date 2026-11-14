/* ---------- Erken yönlendirici: içerik inmeden önce menü çalışsın ---------- */
(function () {
  "use strict";
  var TITLES = {"index": "opunta — Güvenli İnternet Tarayıcı ve Yapay Zeka Yönetişim Platformu", "kisisel-faydalar": "Neden opunta İnternet Tarayıcı Kullanmalıyım? — Kişisel Faydalar", "kurumsal-faydalar": "Kurumsal Faydalar — opunta", "yapay-zeka-yonetisim": "Yapay Zeka Yönetişim — opunta", "teknik-ozellikler": "Teknik Özellikler — opunta", "hakkimizda": "Hakkımızda — opunta", "iletisim": "İletişim — opunta"};
  function views() { return Array.prototype.slice.call(document.querySelectorAll(".page-view")); }
  function routeFromHash() {
    var h = (location.hash || "").replace(/^#\/?/, "").replace(/\/$/, "");
    var vs = views();
    for (var i = 0; i < vs.length; i++) if (vs[i].getAttribute("data-route") === h) return h;
    return "index";
  }
  function applyRoute() {
    var vs = views();
    if (!vs.length) return;
    var r = routeFromHash(), found = false;
    vs.forEach(function (v) {
      var show = v.getAttribute("data-route") === r;
      v.hidden = !show;
      if (show) found = true;
    });
    if (!found) { r = "index"; vs.forEach(function (v) { v.hidden = v.getAttribute("data-route") !== "index"; }); }
    document.body.classList.toggle("has-hero", r === "index");
    var header = document.querySelector(".site-header");
    if (header) header.classList.toggle("solid", r !== "index" || window.scrollY > 32);
    document.querySelectorAll(".main-nav a").forEach(function (a) {
      var href = (a.getAttribute("href") || "").replace(/^#\/?/, "");
      if (href === (r === "index" ? "" : r)) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    var nav = document.getElementById("main-nav");
    if (nav) nav.classList.remove("open");
    if (TITLES[r]) document.title = TITLES[r];
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", applyRoute);
  document.addEventListener("click", function (e) {
    var t = e.target;
    var mb = t.closest && t.closest("#menu-toggle");
    if (mb && !window.__mainJsReady) {
      var nav = document.getElementById("main-nav");
      if (nav) { var open = nav.classList.toggle("open"); mb.setAttribute("aria-expanded", open ? "true" : "false"); }
      return;
    }
    var a = t.closest && t.closest('a[href^="#/"]');
    if (a && location.hash === a.getAttribute("href")) { e.preventDefault(); applyRoute(); }
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", applyRoute);
  else applyRoute();
})();
