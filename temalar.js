// Temalar bölümü: bir karta basılınca kartlar gizlenir, yalnızca o tema açılır.
// "Tüm temalar" kartlara döner; oklar sıradaki/önceki temaya geçer.
// Ekran adları uygulamadaki ThemeCatalog.swift ile aynı.
(function () {
  var order = ["cini", "cinar", "ebru", "mahalle", "vapur"];
  var names = {
    cini:    { name: "Çini",    today: "Bugünün çinisi",     earn: "Fırçanı seç",       focus: "Fırın",          progress: "Pano" },
    cinar:   { name: "Çınar",   today: "Çınarın gölgesinde", earn: "Çınarını sula",     focus: "Kökler",         progress: "Bahçe" },
    ebru:    { name: "Ebru",    today: "Bugünün teknesi",    earn: "Boyanı seç",        focus: "Durgun su",      progress: "Defter" },
    mahalle: { name: "Mahalle", today: "Sokağın bugün",      earn: "Komşuna yardım et", focus: "Mahalle sessiz", progress: "Mahallen" },
    vapur:   { name: "Vapur",   today: "Güvertede bugün",    earn: "Martılara simit",   focus: "Kaptan köşkü",   progress: "Rota" }
  };

  var cards = document.getElementById("tema-kartlar");
  var stage = document.getElementById("tema-sahne");
  if (!cards || !stage) return;
  var buttons = Array.prototype.slice.call(cards.querySelectorAll(".theme"));
  var title = stage.querySelector(".stage-title");
  var screens = Array.prototype.slice.call(stage.querySelectorAll(".screens img"));
  var fields = Array.prototype.slice.call(stage.querySelectorAll("[data-key]"));
  var current = null;

  // Ekranlar ilk açılışta gecikmesin diye bölüm yaklaşınca hepsi yüklenir.
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) {
        screens.forEach(function (img) { img.loading = "eager"; });
        io.disconnect();
      }
    }, { rootMargin: "400px" });
    io.observe(cards);
  }

  function show(id) {
    var data = names[id];
    if (!data) return;
    current = id;
    stage.setAttribute("data-theme", id);
    stage.setAttribute("aria-label", data.name + " teması");
    title.textContent = data.name;
    fields.forEach(function (dd) { dd.textContent = data[dd.getAttribute("data-key")]; });
    screens.forEach(function (img) {
      img.classList.toggle("active", img.getAttribute("data-theme") === id);
    });
  }

  function open(id) {
    show(id);
    buttons.forEach(function (b) { b.setAttribute("aria-expanded", "true"); });
    cards.hidden = true;
    stage.classList.add("open");
    title.focus({ preventScroll: true });
    var top = stage.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.4) stage.scrollIntoView({ block: "start", behavior: smooth() });
  }

  function close() {
    var last = current;
    stage.classList.remove("open");
    cards.hidden = false;
    buttons.forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    var back = cards.querySelector('[data-theme="' + last + '"]');
    if (back) back.focus({ preventScroll: true });
    cards.scrollIntoView({ block: "nearest", behavior: smooth() });
  }

  function step(delta) {
    var i = order.indexOf(current);
    show(order[(i + delta + order.length) % order.length]);
  }

  function smooth() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () { open(b.getAttribute("data-theme")); });
  });
  stage.querySelector(".stage-back").addEventListener("click", close);
  stage.querySelector(".stage-prev").addEventListener("click", function () { step(-1); });
  stage.querySelector(".stage-next").addEventListener("click", function () { step(1); });
  stage.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
  });
})();
