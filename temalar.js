// Temalar bölümü: kart seçilince alttaki sahne ve telefon ekranı o temaya geçer.
// Ekran adları uygulamadaki ThemeCatalog.swift ile aynı.
(function () {
  var names = {
    cini:    { name: "Çini",    today: "Bugünün çinisi",     earn: "Fırçanı seç",       focus: "Fırın",          progress: "Pano" },
    cinar:   { name: "Çınar",   today: "Çınarın gölgesinde", earn: "Çınarını sula",     focus: "Kökler",         progress: "Bahçe" },
    ebru:    { name: "Ebru",    today: "Bugünün teknesi",    earn: "Boyanı seç",        focus: "Durgun su",      progress: "Defter" },
    mahalle: { name: "Mahalle", today: "Sokağın bugün",      earn: "Komşuna yardım et", focus: "Mahalle sessiz", progress: "Mahallen" },
    vapur:   { name: "Vapur",   today: "Güvertede bugün",    earn: "Martılara simit",   focus: "Kaptan köşkü",   progress: "Rota" }
  };

  var tabs = Array.prototype.slice.call(document.querySelectorAll('.themes [role="tab"]'));
  var stage = document.getElementById("tema-sahne");
  if (!tabs.length || !stage) return;
  var title = stage.querySelector(".stage-title");
  var screens = Array.prototype.slice.call(stage.querySelectorAll(".screens img"));
  var fields = Array.prototype.slice.call(stage.querySelectorAll("[data-key]"));

  // Ekran görüntüleri ilk seçimde gecikmesin diye bölüm görünür olunca hepsi yüklenir.
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) {
        screens.forEach(function (img) { img.loading = "eager"; });
        io.disconnect();
      }
    }, { rootMargin: "400px" });
    io.observe(stage);
  }

  function select(tab, moveFocus) {
    var id = tab.getAttribute("data-theme");
    var data = names[id];
    if (!data || stage.getAttribute("data-theme") === id) {
      if (moveFocus) tab.focus();
      return;
    }
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
    stage.setAttribute("data-theme", id);
    stage.setAttribute("aria-labelledby", tab.id);
    title.textContent = data.name;
    fields.forEach(function (dd) { dd.textContent = data[dd.getAttribute("data-key")]; });
    screens.forEach(function (img) {
      img.classList.toggle("active", img.getAttribute("data-theme") === id);
    });
    if (moveFocus) tab.focus();
  }

  var canHover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { select(tab, false); });
    if (canHover) tab.addEventListener("mouseenter", function () { select(tab, false); });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = tabs[(i + 1) % tabs.length];
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === "Home") next = tabs[0];
      else if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); select(next, true); }
    });
  });
})();
