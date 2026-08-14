/* ============================================================
   IEDC SIAS — 2026-27 site engine
   ------------------------------------------------------------
   Everything on the page renders from the files in /data:
     data/site-config.js      years + contact info
     data/announcements.js    announcement bar + events section
     data/team-<year>.js      team cards
     data/content-<year>.js   programmes, gallery, proof chips

   Student maintainers: you should almost never need to edit
   this file — edit the data files instead. See README.md.
   ============================================================ */

(function () {
  "use strict";

  var CONFIG = window.SITE_CONFIG || { currentYear: "2026-27", years: [], contact: {} };
  var DATA = window.SITE_DATA || {};
  var CONTACT = CONFIG.contact || {};
  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Which year does this page render? ?year= wins if we have data
     for it (archived page-years already redirected in <head>). */
  var param = new URLSearchParams(window.location.search).get("year");
  var YEAR = DATA[param] ? param : CONFIG.currentYear;
  var YEAR_DATA = DATA[YEAR] || {};

  try {
    sessionStorage.setItem("iedc-year", YEAR);
  } catch (e) {
    /* private-mode Safari — non-essential */
  }

  /* ---------- tiny helpers ---------- */
  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function dash(yearId) {
    return String(yearId).replace("-", "–"); /* 2026-27 -> 2026–27 */
  }

  /* Dates: parse "YYYY-MM-DD" as a LOCAL date (never UTC) */
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function parseDate(str) {
    if (!str) return null;
    var p = String(str).split("-");
    if (p.length !== 3) return null;
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return isNaN(d.getTime()) ? null : d;
  }
  function fmtDate(d) {
    return MONTHS[d.getMonth()] + " " + d.getDate();
  }
  function startOfToday() {
    var n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }
  function daysUntil(d) {
    return Math.round((d - startOfToday()) / 86400000);
  }
  /* Honest urgency: real dates, no fake scarcity */
  function deadlineText(d) {
    if (!d) return null;
    var n = daysUntil(d);
    if (n < 0) return null;
    if (n === 0) return "Closes today";
    if (n === 1) return "Closes tomorrow";
    if (n <= 7) return "Closes in " + n + " days";
    return "Closes " + fmtDate(d);
  }

  var ICONS = {
    chevron:
      '<svg class="ysw-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    close:
      '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    linkedin:
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S.02 4.88.02 3.5 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4v15.5h-4V8zm7.5 0h3.8v2.1h.06c.53-1 1.82-2.1 3.75-2.1 4.01 0 4.75 2.64 4.75 6.07v9.43h-4v-8.36c0-2-.04-4.56-2.78-4.56-2.78 0-3.2 2.17-3.2 4.42v8.5H8V8z"/></svg>',
    instagram:
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.4"/><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" stroke="none"/></svg>',
  };

  /* ============================================================
     1. Year labels + page title
     ============================================================ */
  $all("[data-year-text]").forEach(function (n) {
    n.textContent = dash(YEAR);
  });
  if (YEAR !== CONFIG.currentYear) {
    document.title = "IEDC SIAS — Innovation & Entrepreneurship Development Centre | " + dash(YEAR);
  }
  var fy = $("#footerYear");
  if (fy) fy.textContent = String(new Date().getFullYear());

  /* ============================================================
     2. Year switcher — accessible custom listbox
     ============================================================ */
  function initYearSwitcher() {
    var mount = $("#yearSwitcher");
    if (!mount || !CONFIG.years.length) return;

    var btn = el("button", "ysw-btn");
    btn.type = "button";
    btn.setAttribute("aria-haspopup", "listbox");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML =
      '<span class="visually-hidden">Academic year:&nbsp;</span><span class="ysw-label">' +
      esc(dash(YEAR)) +
      "</span>" +
      ICONS.chevron;

    var list = el("ul", "ysw-list");
    list.setAttribute("role", "listbox");
    list.setAttribute("aria-label", "Academic year");
    list.tabIndex = -1;
    list.hidden = true;

    var opts = CONFIG.years.map(function (y, i) {
      var li = el("li", "ysw-opt");
      li.setAttribute("role", "option");
      li.id = "yswOpt" + i;
      li.dataset.yearId = y.id;
      li.setAttribute("aria-selected", y.id === YEAR ? "true" : "false");
      li.textContent = dash(y.id);
      list.appendChild(li);
      return li;
    });

    var focusIdx = Math.max(
      0,
      CONFIG.years.findIndex(function (y) {
        return y.id === YEAR;
      })
    );

    function paintFocus() {
      opts.forEach(function (o, i) {
        o.classList.toggle("focused", i === focusIdx);
      });
      list.setAttribute("aria-activedescendant", opts[focusIdx].id);
    }
    function open() {
      list.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      paintFocus();
      list.focus();
    }
    function close(refocus) {
      list.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      if (refocus) btn.focus();
    }
    function choose(id) {
      try {
        sessionStorage.setItem("iedc-year", id);
      } catch (e) {}
      if (id === YEAR) {
        close(true);
        return;
      }
      var y = CONFIG.years.filter(function (x) {
        return x.id === id;
      })[0];
      if (!y) return;
      if (y.type === "page" && y.href) {
        window.location.href = y.href;
      } else {
        window.location.href =
          id === CONFIG.currentYear
            ? "index.html"
            : "index.html?year=" + encodeURIComponent(id);
      }
    }

    btn.addEventListener("click", function () {
      list.hidden ? open() : close(true);
    });
    btn.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        open();
      }
    });

    list.addEventListener("keydown", function (e) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          focusIdx = Math.min(focusIdx + 1, opts.length - 1);
          paintFocus();
          break;
        case "ArrowUp":
          e.preventDefault();
          focusIdx = Math.max(focusIdx - 1, 0);
          paintFocus();
          break;
        case "Home":
          e.preventDefault();
          focusIdx = 0;
          paintFocus();
          break;
        case "End":
          e.preventDefault();
          focusIdx = opts.length - 1;
          paintFocus();
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          choose(opts[focusIdx].dataset.yearId);
          break;
        case "Escape":
          e.preventDefault();
          close(true);
          break;
        case "Tab":
          close(false);
          break;
      }
    });

    list.addEventListener("click", function (e) {
      var opt = e.target.closest(".ysw-opt");
      if (opt) choose(opt.dataset.yearId);
    });
    list.addEventListener("mousemove", function (e) {
      var opt = e.target.closest(".ysw-opt");
      if (!opt) return;
      var i = opts.indexOf(opt);
      if (i !== -1 && i !== focusIdx) {
        focusIdx = i;
        paintFocus();
      }
    });

    document.addEventListener("click", function (e) {
      if (!list.hidden && !mount.contains(e.target)) close(false);
    });

    mount.appendChild(btn);
    mount.appendChild(list);
  }

  /* ============================================================
     3. Announcements — bar + events section share the data
     ============================================================ */
  function upcomingEvents() {
    var today = startOfToday();
    return (window.ANNOUNCEMENTS || [])
      .filter(function (a) {
        return a && a.active && a.title;
      })
      .map(function (a) {
        var copy = {};
        for (var k in a) copy[k] = a[k];
        copy._date = parseDate(a.date);
        copy._deadline = parseDate(a.deadline);
        return copy;
      })
      .filter(function (a) {
        return a._date && a._date >= today; /* past events hide themselves */
      })
      .sort(function (a, b) {
        return a._date - b._date;
      });
  }

  function initAnnouncementBar() {
    var mount = $("#announcementMount");
    if (!mount) return;

    var dismissed = false;
    try {
      dismissed = sessionStorage.getItem("iedc-annc-dismissed") === "1";
    } catch (e) {}
    if (dismissed) return;

    var events = upcomingEvents();
    if (!events.length) return; /* no active announcements -> no bar */

    var bar = el("div", "annc");
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Announcement");

    var inner = el("div", "container annc-inner");
    var text = el("p", "annc-text");
    text.setAttribute("aria-live", "polite");
    var actions = el("div", "annc-actions");

    var idx = 0;
    function paint() {
      var a = events[idx];
      var meta = fmtDate(a._date) + (a.venue ? " · " + a.venue : "");
      var dl = deadlineText(a._deadline);
      text.innerHTML =
        '<span class="annc-flag">Next up</span>' +
        '<strong class="annc-title">' + esc(a.title) + "</strong>" +
        '<span class="annc-meta">' + esc(meta) + "</span>" +
        (dl ? '<span class="annc-deadline">' + esc(dl) + "</span>" : "");

      actions.innerHTML = "";
      if (events.length > 1) {
        actions.appendChild(
          el("span", "annc-count", idx + 1 + " / " + events.length)
        );
      }
      if (a.registrationUrl) {
        var cta = el("a", "annc-cta", "Register now →");
        cta.href = a.registrationUrl;
        cta.target = "_blank";
        cta.rel = "noopener";
        cta.setAttribute("aria-label", "Register for " + a.title);
        actions.appendChild(cta);
      }
      var closeBtn = el("button", "annc-close", ICONS.close);
      closeBtn.type = "button";
      closeBtn.setAttribute("aria-label", "Dismiss announcement");
      closeBtn.addEventListener("click", function () {
        try {
          sessionStorage.setItem("iedc-annc-dismissed", "1");
        } catch (e) {}
        if (timer) clearInterval(timer);
        bar.remove();
      });
      actions.appendChild(closeBtn);
    }
    paint();

    /* Multiple events rotate gently */
    var timer = null;
    if (events.length > 1) {
      timer = setInterval(function () {
        idx = (idx + 1) % events.length;
        paint();
      }, 7000);
    }

    inner.appendChild(text);
    inner.appendChild(actions);
    bar.appendChild(inner);
    mount.appendChild(bar);
  }

  function emptyState(title, body, link) {
    var box = el("div", "empty-state");
    box.setAttribute("data-reveal", "");
    box.appendChild(el("span", "empty-node"));
    box.appendChild(el("h3", null, esc(title)));
    box.appendChild(el("p", null, body));
    if (link) {
      var a = el("a", "btn btn-ghost btn-sm", esc(link.label));
      a.href = link.href;
      if (/^https?:/.test(link.href)) {
        a.target = "_blank";
        a.rel = "noopener";
      }
      box.appendChild(a);
    }
    return box;
  }

  function renderEvents() {
    var grid = $("#eventsGrid");
    if (!grid) return;

    var events = upcomingEvents();
    if (!events.length) {
      grid.appendChild(
        emptyState(
          "Nothing on the calendar — yet",
          "New events are announced on Instagram first, then land here with registration links.",
          { href: CONTACT.instagram || "#", label: "Follow " + (CONTACT.instagramHandle || "@iedc.sias") }
        )
      );
      return;
    }

    events.forEach(function (a, i) {
      var card = el("article", "event-card");
      card.setAttribute("data-reveal", "");
      card.style.setProperty("--i", i % 6);

      var day = a._date.getDate();
      card.appendChild(
        el(
          "div",
          "event-datebox",
          '<span class="event-day">' + (day < 10 ? "0" + day : day) + "</span>" +
            '<span class="event-mon">' + MONTHS[a._date.getMonth()] + "</span>"
        )
      );

      var body = el("div", "event-body");
      body.appendChild(el("h3", null, esc(a.title)));
      if (a.description) body.appendChild(el("p", "event-desc", esc(a.description)));

      var metaBits = [];
      if (a.time) metaBits.push(esc(a.time));
      if (a.venue) metaBits.push(esc(a.venue));
      if (metaBits.length)
        body.appendChild(el("p", "event-meta", metaBits.join(" · ")));

      var foot = el("div", "event-foot");
      var dl = deadlineText(a._deadline);
      if (dl) foot.appendChild(el("span", "event-deadline", esc(dl)));
      if (a.registrationUrl) {
        var cta = el("a", "btn btn-volt btn-sm", "Register for " + esc(a.title));
        cta.href = a.registrationUrl;
        cta.target = "_blank";
        cta.rel = "noopener";
        foot.appendChild(cta);
      } else {
        foot.appendChild(el("span", "chip-soon", "Registration opens soon"));
      }
      body.appendChild(foot);
      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  /* ============================================================
     4. Programmes
     ============================================================ */
  function renderProgrammes() {
    var grid = $("#programmesGrid");
    if (!grid) return;

    var progs = (YEAR_DATA.programmes || []).slice().sort(function (a, b) {
      return (parseDate(b.date) || 0) - (parseDate(a.date) || 0); /* newest first */
    });

    if (!progs.length) {
      /* Scaffold: what's coming, stated honestly */
      [
        { tag: "Bootcamps", title: "Idea to prototype, hands-on", blurb: "First edition announced soon." },
        { tag: "EN-Talks", title: "Founders, unfiltered", blurb: "Speaker lineup in the works." },
        { tag: "Competitions", title: "Deadlines that sharpen ideas", blurb: "Dates land here first." },
      ].forEach(function (p, i) {
        var card = el("article", "prog-card is-placeholder");
        card.setAttribute("data-reveal", "");
        card.style.setProperty("--i", i);
        card.appendChild(
          el(
            "div",
            "prog-body",
            '<span class="prog-tag">' + esc(p.tag) + "</span>" +
              "<h3>" + esc(p.title) + "</h3>" +
              "<p>" + esc(p.blurb) + "</p>"
          )
        );
        grid.appendChild(card);
      });
      return;
    }

    progs.forEach(function (p, i) {
      var card = el("article", "prog-card");
      card.setAttribute("data-reveal", "");
      card.style.setProperty("--i", i % 6);

      var photo = el("div", "prog-photo");
      if (p.photo) {
        var img = document.createElement("img");
        img.src = p.photo;
        img.alt = p.title + (p.tag ? " — " + p.tag : "");
        img.loading = "lazy";
        img.decoding = "async";
        img.width = 480;
        img.height = 300;
        img.onerror = function () {
          this.onerror = null;
          photo.innerHTML = "";
          photo.appendChild(el("div", "prog-photo-fallback", esc((p.title || "?").charAt(0))));
        };
        photo.appendChild(img);
      } else {
        photo.appendChild(el("div", "prog-photo-fallback", esc((p.title || "?").charAt(0))));
      }
      card.appendChild(photo);

      var d = parseDate(p.date);
      card.appendChild(
        el(
          "div",
          "prog-body",
          (p.tag ? '<span class="prog-tag">' + esc(p.tag) + "</span>" : "") +
            "<h3>" + esc(p.title) + "</h3>" +
            (p.blurb ? "<p>" + esc(p.blurb) + "</p>" : "") +
            (d ? '<span class="prog-date">' + MONTHS[d.getMonth()] + " " + d.getFullYear() + "</span>" : "")
        )
      );
      grid.appendChild(card);
    });
  }

  /* ============================================================
     5. Team — tiered, data-driven, graceful photo fallback
     ============================================================ */
  function avatarURI(name) {
    var initials = String(name || "?")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(function (w) {
        return w.charAt(0).toUpperCase();
      })
      .join("")
      .replace(/[&<>]/g, ""); /* keep the inline SVG well-formed */
    var svg =
      "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='500'>" +
      "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
      "<stop offset='0' stop-color='#F4E63F'/><stop offset='0.5' stop-color='#8DD449'/>" +
      "<stop offset='1' stop-color='#2FA84F'/></linearGradient></defs>" +
      "<rect width='400' height='500' fill='#12301F'/>" +
      "<circle cx='200' cy='230' r='96' fill='none' stroke='url(#g)' stroke-width='3'/>" +
      "<text x='200' y='230' text-anchor='middle' dominant-baseline='central' " +
      "font-family='Arial, Helvetica, sans-serif' font-size='68' font-weight='700' " +
      "fill='#EAF2EA'>" + initials + "</text></svg>";
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  function teamCard(m, i) {
    var card = el("article", "team-card");
    card.setAttribute("data-reveal", "");
    card.style.setProperty("--i", i % 8);

    var photoWrap = el("div", "team-photo");
    var img = document.createElement("img");
    img.alt = m.name + ", " + m.position;
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 400;
    img.height = 500;
    img.src = m.photo ? m.photo : avatarURI(m.name);
    img.onerror = function () {
      this.onerror = null;
      this.src = avatarURI(m.name);
    };
    photoWrap.appendChild(img);
    card.appendChild(photoWrap);

    var meta = el("div", "team-meta");
    meta.appendChild(el("h3", "team-name", esc(m.name)));
    meta.appendChild(el("p", "team-role", esc(m.position)));

    if (m.linkedin || m.instagram) {
      var social = el("div", "team-social");
      if (m.linkedin) {
        var li = el("a", null, ICONS.linkedin);
        li.href = m.linkedin;
        li.target = "_blank";
        li.rel = "noopener";
        li.setAttribute("aria-label", m.name + " on LinkedIn");
        social.appendChild(li);
      }
      if (m.instagram) {
        var ig = el("a", null, ICONS.instagram);
        ig.href = m.instagram;
        ig.target = "_blank";
        ig.rel = "noopener";
        ig.setAttribute("aria-label", m.name + " on Instagram");
        social.appendChild(ig);
      }
      meta.appendChild(social);
    }
    card.appendChild(meta);
    return card;
  }

  function renderTeam() {
    var mount = $("#teamGroups");
    if (!mount) return;

    var team = YEAR_DATA.team;
    if (!team || !team.members || !team.members.length) {
      mount.appendChild(
        emptyState(
          "Team " + dash(YEAR) + " — announcement soon",
          "The new core team is being finalised. Watch Instagram for the reveal.",
          { href: CONTACT.instagram || "#", label: "Follow " + (CONTACT.instagramHandle || "@iedc.sias") }
        )
      );
      return;
    }

    (team.tiers || []).forEach(function (tier) {
      var members = team.members
        .filter(function (m) {
          return m.tier === tier.id;
        })
        .sort(function (a, b) {
          return (a.order || 0) - (b.order || 0);
        });
      if (!members.length) return;

      var sec = el("div", "team-tier");
      var head = el("div", "team-tier-head");
      head.appendChild(el("h3", null, esc(tier.label)));
      head.appendChild(el("span", "team-tier-count", String(members.length)));
      sec.appendChild(head);

      var grid = el("div", "team-grid tier-" + tier.id);
      members.forEach(function (m, i) {
        grid.appendChild(teamCard(m, i));
      });
      sec.appendChild(grid);
      mount.appendChild(sec);
    });
  }

  /* ============================================================
     6. Gallery
     ============================================================ */
  function renderGallery() {
    var grid = $("#galleryGrid");
    if (!grid) return;

    var items = YEAR_DATA.gallery || [];
    if (!items.length) {
      grid.classList.add("is-empty"); /* drop the masonry columns */
      grid.appendChild(
        emptyState(
          "This year's story starts soon",
          "Photos from the first " + dash(YEAR) + " events will land here. The archive lives on Instagram meanwhile.",
          { href: CONTACT.instagram || "#", label: "See past moments " + (CONTACT.instagramHandle || "@iedc.sias") }
        )
      );
      return;
    }

    items.forEach(function (g) {
      var fig = el("figure");
      var img = document.createElement("img");
      img.src = g.src;
      img.alt = g.alt || "IEDC SIAS event photo";
      img.loading = "lazy";
      img.decoding = "async";
      img.onerror = function () {
        fig.remove();
      };
      fig.appendChild(img);
      grid.appendChild(fig);
    });
  }

  /* ============================================================
     7. Hero proof chips
     ============================================================ */
  function renderStats() {
    var ul = $("#heroProof");
    if (!ul) return;
    var stats = YEAR_DATA.stats || [];
    if (!stats.length) {
      ul.hidden = true;
      return;
    }
    stats.forEach(function (s) {
      ul.appendChild(
        el(
          "li",
          null,
          '<span class="proof-value">' + esc(s.value) + "</span><span>" + esc(s.label) + "</span>"
        )
      );
    });
  }

  /* ============================================================
     8. FAQ accordion
     ============================================================ */
  function initFaq() {
    $all(".faq-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var expanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!expanded));
        var panel = document.getElementById(btn.getAttribute("aria-controls"));
        if (panel) panel.classList.toggle("open", !expanded);
      });
    });
  }

  /* ============================================================
     9. Mobile navigation
     ============================================================ */
  function initNav() {
    var toggle = $("#navToggle");
    var menu = $("#navMenu");
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      menu.classList.toggle("open", open);
    }
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    $all(".nav-links a", menu).forEach(function (a) {
      a.addEventListener("click", function () {
        setOpen(false);
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (
        toggle.getAttribute("aria-expanded") === "true" &&
        !menu.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        setOpen(false);
      }
    });
  }

  /* ============================================================
     10. Scroll: header hairline, back-to-top, active nav link
     ============================================================ */
  function initScrollUI() {
    var header = $("#siteHeader");
    var backTop = $("#backTop");
    var ticking = false;

    function paint() {
      var y = window.scrollY || 0;
      if (header) header.classList.toggle("scrolled", y > 8);
      if (backTop) backTop.hidden = y < 480;
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(paint);
        }
      },
      { passive: true }
    );
    paint();

    if (backTop) {
      backTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      });
    }

    /* Active section in the nav */
    var links = $all('.nav-links a[href^="#"]');
    if ("IntersectionObserver" in window && links.length) {
      var byId = {};
      links.forEach(function (a) {
        byId[a.getAttribute("href").slice(1)] = a;
      });
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            links.forEach(function (a) {
              a.classList.remove("active");
            });
            var a = byId[en.target.id];
            if (a) a.classList.add("active");
          });
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
      );
      Object.keys(byId).forEach(function (id) {
        var sec = document.getElementById(id);
        if (sec) io.observe(sec);
      });
    }
  }

  /* ============================================================
     11. Reveal on scroll + circuit-trace section headings
     ============================================================ */
  function initReveals() {
    var targets = $all("[data-reveal]").filter(function (t) {
      return !t.closest(".hero"); /* hero animates on load instead */
    });
    var heads = $all(".section-head");
    var art = $all(".about-art");

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (t) {
        t.classList.add("in");
      });
      heads.forEach(function (h) {
        h.classList.add("lit");
      });
      art.forEach(function (a) {
        a.classList.add("in");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add(en.target.classList.contains("section-head") ? "lit" : "in");
          io.unobserve(en.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
    );

    targets.forEach(function (t) {
      io.observe(t);
    });
    heads.forEach(function (h) {
      io.observe(h);
    });
    art.forEach(function (a) {
      io.observe(a);
    });
  }

  /* ============================================================
     12. Contact form — inline validation, opens the mail app
     ============================================================ */
  function initForm() {
    var form = $("#contactForm");
    if (!form) return;

    var fields = {
      name: {
        input: $("#cfName"),
        err: $("#cfNameErr"),
        check: function (v) {
          if (v.trim().length < 2) return "Please tell us your name.";
          return null;
        },
      },
      email: {
        input: $("#cfEmail"),
        err: $("#cfEmailErr"),
        check: function (v) {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()))
            return "That email doesn't look right — check for typos.";
          return null;
        },
      },
      phone: {
        input: $("#cfPhone"),
        err: $("#cfPhoneErr"),
        check: function (v) {
          if (v.trim() && !/^[+\d][\d\s()-]{6,}$/.test(v.trim()))
            return "Use digits (and +, spaces) — or leave it empty.";
          return null;
        },
      },
      message: {
        input: $("#cfMessage"),
        err: $("#cfMessageErr"),
        check: function (v) {
          if (v.trim().length < 10)
            return "A few more words help us reply usefully.";
          return null;
        },
      },
    };

    function showError(f, msg) {
      f.input.setAttribute("aria-invalid", msg ? "true" : "false");
      f.err.textContent = msg || "";
      f.err.hidden = !msg;
    }
    function validate(f) {
      var msg = f.check(f.input.value);
      showError(f, msg);
      return !msg;
    }

    Object.keys(fields).forEach(function (k) {
      var f = fields[k];
      if (!f.input) return;
      f.input.addEventListener("blur", function () {
        if (f.input.value.trim()) validate(f);
      });
      f.input.addEventListener("input", function () {
        if (f.err.textContent) validate(f);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      var firstBad = null;
      Object.keys(fields).forEach(function (k) {
        var f = fields[k];
        if (!validate(f) && !firstBad) {
          firstBad = f.input;
          ok = false;
        } else if (f.err.textContent) {
          ok = false;
        }
      });
      if (!ok) {
        if (firstBad) firstBad.focus();
        return;
      }

      var name = fields.name.input.value.trim();
      var email = fields.email.input.value.trim();
      var phone = fields.phone.input.value.trim();
      var message = fields.message.input.value.trim();
      var to = CONTACT.email || "iedc@siasindia.org";
      var subject = "Message from " + name + " — iedcsias.github.io";
      var body =
        message + "\n\n— " + name + "\nEmail: " + email + (phone ? "\nPhone: " + phone : "");

      window.location.href =
        "mailto:" + to +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      var note = $("#formNote");
      if (note) {
        note.textContent =
          "Your email app should open now — hit send there and we'll reply to " + email + ".";
        note.classList.add("is-success");
      }
    });
  }

  /* ============================================================
     Boot — render first, then wire up behaviour & motion
     ============================================================ */
  renderStats();
  renderEvents();
  renderProgrammes();
  renderTeam();
  renderGallery();

  initYearSwitcher();
  initAnnouncementBar();
  initFaq();
  initNav();
  initScrollUI();
  initForm();
  initReveals();
})();
