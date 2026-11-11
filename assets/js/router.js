/* ---------- Tek dosya yönlendirici (hash route) ---------- */
(function () {
  "use strict";
  var TITLES = {"index": "opunta — Kurumsal İnternet Tarayıcı ve Yapay Zeka Yönetişim Platformu", "kisisel-faydalar": "Neden opunta Tarayıcı Kullanmalıyım? — Kişisel Faydalar", "kurumsal-faydalar": "Kurumsal Faydalar — opunta", "yapay-zeka-yonetisim": "Yapay Zeka Yönetişim — opunta", "teknik-ozellikler": "Teknik Özellikler — opunta", "hakkimizda": "Hakkımızda — opunta", "iletisim": "İletişim — opunta"};
  var views = Array.prototype.slice.call(document.querySelectorAll(".page-view"));
  function routeFromHash() {
    var h = (location.hash || "").replace(/^#\/?/, "").replace(/\/$/, "");
    for (var i = 0; i < views.length; i++) {
      if (views[i].getAttribute("data-route") === h) return h;
    }
    return "index";
  }
  function applyRoute() {
    var r = routeFromHash();
    views.forEach(function (v) {
      v.hidden = v.getAttribute("data-route") !== r;
    });
    document.body.classList.toggle("has-hero", r === "index");
    var header = document.querySelector(".site-header");
    if (header) header.classList.toggle("solid", r !== "index" || window.scrollY > 32);
    document.querySelectorAll(".main-nav a").forEach(function (a) {
      var href = (a.getAttribute("href") || "").replace(/^#\/?/, "");
      var match = href === (r === "index" ? "" : r);
      if (match) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    if (TITLES[r]) document.title = TITLES[r];
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", applyRoute);
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#/"]');
    if (!a) return;
    var target = a.getAttribute("href");
    if (location.hash === target) { e.preventDefault(); applyRoute(); }
  });
  applyRoute();
})();
