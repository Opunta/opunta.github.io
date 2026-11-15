/* ---------- Videolar: ilk ziyarette yüklenir ---------- */
window.OPUNTA_VIDEO = {"film": "assets/video/personal.mp4", "kurumsal": "assets/video/corporate.mp4"};
(function () {
  function assign() {
    var v = document.querySelector(".page-view:not([hidden]) video[data-src-key]");
    if (v && !v.getAttribute("data-loaded") && window.OPUNTA_VIDEO[v.getAttribute("data-src-key")]) {
      var s = document.createElement("source");
      s.src = window.OPUNTA_VIDEO[v.getAttribute("data-src-key")];
      s.type = "video/mp4";
      v.appendChild(s);
      v.setAttribute("data-loaded", "1");
      v.load();
    }
  }
  window.addEventListener("hashchange", function () { setTimeout(assign, 60); });
  document.addEventListener("DOMContentLoaded", function () { setTimeout(assign, 150); });
  window.addEventListener("load", function () { setTimeout(assign, 300); });
  assign();
})();
