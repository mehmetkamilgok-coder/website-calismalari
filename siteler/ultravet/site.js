/* Ortak site davranışları. Her site klasöründe aynı dosya bulunur; bileşenler sayfada varsa çalışır. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  /* Mobil menü */
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-menu]");
  if (toggle && menu) {
    var setMenu = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
      menu.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-acik", open);
    };
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
    window.matchMedia("(min-width: 960px)").addEventListener("change", function () { setMenu(false); });
  }

  /* Kaydırınca başlık durumu */
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 24); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Mobil hızlı erişim çubuğu: açılıştaki ana çağrı ekrandayken gizli, kaydırınca görünür */
  var anaCagri = document.querySelector("[data-ana-cagri]");
  var bar = document.querySelector(".mobil-bar");
  if (anaCagri && bar && "IntersectionObserver" in window) {
    bar.classList.add("is-bekliyor");
    new IntersectionObserver(function (girdiler) {
      bar.classList.toggle("is-gorunur", !girdiler[0].isIntersecting);
    }).observe(anaCagri);
  }

  /* İstanbul saati */
  function istanbulNow() {
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Istanbul", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date());
    var get = function (t) { return parts.filter(function (p) { return p.type === t; })[0].value; };
    var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { day: days[get("weekday")], h: Number(get("hour")) % 24, m: Number(get("minute")) };
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function toMin(s) { var p = s.split(":"); return Number(p[0]) * 60 + Number(p[1]); }

  /* Açık / kapalı durumu. body[data-saatler] = "7/24" ya da {"0":["09:00","21:00"], ...} (0 = Pazar) */
  var plan = document.body.getAttribute("data-saatler");
  function durum() {
    if (!plan) return null;
    if (plan === "7/24") return { acik: true, metin: "Şu an açık, 7/24 hizmetteyiz" };
    var p = JSON.parse(plan), n = istanbulNow(), now = n.h * 60 + n.m, bugun = p[n.day];
    if (bugun && now >= toMin(bugun[0]) && now < toMin(bugun[1])) {
      return { acik: true, metin: "Şu an açık, kapanış " + bugun[1] };
    }
    if (bugun && now < toMin(bugun[0])) return { acik: false, metin: "Şu an kapalı, bugün " + bugun[0] + " açılıyor" };
    for (var i = 1; i <= 7; i++) {
      var g = p[(n.day + i) % 7];
      if (g) return { acik: false, metin: "Şu an kapalı, " + (i === 1 ? "yarın " : "") + g[0] + " açılıyor" };
    }
    return null;
  }
  function durumYaz() {
    var d = durum();
    if (!d) return;
    document.querySelectorAll("[data-acik-durum]").forEach(function (el) {
      el.textContent = d.metin;
      el.classList.toggle("is-acik", d.acik);
      el.classList.toggle("is-kapali", !d.acik);
    });
  }

  /* Canlı saat ve 24 saat kadranı */
  function saatYaz() {
    var n = istanbulNow(), text = pad(n.h) + ":" + pad(n.m);
    document.querySelectorAll("[data-canli-saat]").forEach(function (el) { el.textContent = text; });
    document.querySelectorAll("[data-kadran-ibre]").forEach(function (el) {
      el.style.transform = "rotate(" + ((n.h * 60 + n.m) / 1440) * 360 + "deg)";
    });
  }
  durumYaz();
  saatYaz();
  setInterval(function () { durumYaz(); saatYaz(); }, 30000);

  /* Sekmeler (erişilebilir, ok tuşlarıyla gezilebilir) */
  document.querySelectorAll("[role=tablist]").forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll("[role=tab]"));
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t, false); });
      t.addEventListener("keydown", function (e) {
        var k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (k) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true); }
        if (e.key === "Home") { e.preventDefault(); select(tabs[0], true); }
        if (e.key === "End") { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });
  });

  /* Tarih alanında geçmiş günleri kapat */
  document.querySelectorAll("input[type=date]").forEach(function (el) {
    var d = new Date();
    el.min = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  });

  /* Netlify Forms uyumlu gönderim. Yerelde gönderim yapılmaz, akış gösterilir. */
  document.querySelectorAll("form[data-netlify]").forEach(function (form) {
    var btn = form.querySelector("[type=submit]");
    var out = form.querySelector("[data-form-durum]");
    var tel = form.getAttribute("data-telefon") || "";
    var label = btn.textContent;
    var yerel = ["localhost", "127.0.0.1", ""].indexOf(location.hostname) > -1;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      btn.disabled = true;
      btn.textContent = "Gönderiliyor...";
      out.removeAttribute("data-tur");
      out.textContent = "";

      var body = new URLSearchParams(new FormData(form)).toString();
      var istek = yerel
        ? new Promise(function (r) { setTimeout(r, 700); })
        : fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body })
            .then(function (r) { if (!r.ok) throw new Error(r.status); });

      istek.then(function () {
        form.reset();
        out.setAttribute("data-tur", "basari");
        out.textContent = yerel
          ? "Randevu talebiniz alındı. (Yerel önizleme: gerçek gönderim site Netlify'da yayınlanınca çalışır.)"
          : "Randevu talebiniz alındı. Kısa süre içinde sizi arayıp saati netleştireceğiz.";
        btn.textContent = "Talebiniz alındı";
        setTimeout(function () { btn.disabled = false; btn.textContent = label; }, 5000);
      }).catch(function () {
        out.setAttribute("data-tur", "hata");
        out.textContent = "Talep gönderilemedi. Bağlantınızı kontrol edip tekrar deneyin ya da bizi arayın: " + tel;
        btn.disabled = false;
        btn.textContent = label;
      });
    });
  });

  /* Yıl */
  document.querySelectorAll("[data-yil]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
