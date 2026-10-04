(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasIO = "IntersectionObserver" in window;
  const inr = new Intl.NumberFormat("en-IN");
  const cfg = window.solarFace || {};
  const t = Object.assign({
    leadOk: "Thank you. Our solar expert will call you back shortly.",
    leadFail: "Something went wrong. Please call us at %s.",
    subOk: "You are subscribed. Thank you!",
    subFail: "Could not subscribe right now. Please try again later.",
    subInvalid: "Please enter a valid email address.",
    menuOpen: "Open menu",
    menuClose: "Close menu",
  }, cfg.i18n || {});

  // Send a form to WordPress (admin-ajax.php). Resolves with the JSON reply.
  const postToWordPress = async (form) => {
    const res = await fetch(cfg.ajaxUrl, { method: "POST", body: new FormData(form), credentials: "same-origin" });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok && json.success === true, data: json.data || {} };
  };

  /* ---------- Footer year ---------- */
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Remote image fallback ---------- */
  document.querySelectorAll("[data-img]").forEach((img) => {
    const frame = img.closest("[data-img-frame]");
    if (!frame) return;
    const fail = () => frame.classList.add("img-missing");
    if (img.complete && img.naturalWidth === 0) fail();
    else img.addEventListener("error", fail, { once: true });
  });

  /* ---------- Header hairline once the page scrolls ---------- */
  const header = document.querySelector("[data-header]");
  const sentinel = document.createElement("div");
  sentinel.setAttribute("aria-hidden", "true");
  sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:8px;";
  document.body.prepend(sentinel);
  if (header && hasIO) {
    new IntersectionObserver(([entry]) => header.classList.toggle("is-scrolled", !entry.isIntersecting)).observe(sentinel);
  }

  /* ---------- Statement: split into words for the scroll scrub ---------- */
  document.querySelectorAll("[data-scrub]").forEach((el) => {
    const text = el.textContent.trim();
    const words = text.split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ");
    el.innerHTML = `<span class="sr-only">${text}</span><span aria-hidden="true">${words}</span>`;
  });

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  if (toggle && menu) {
    const icon = toggle.querySelector(".ph");
    const label = toggle.querySelector(".sr-only");
    const setOpen = (open) => {
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      icon.className = open ? "ph ph-x" : "ph ph-list";
      label.textContent = open ? t.menuClose : t.menuOpen;
    };
    toggle.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 1100px)").addEventListener("change", () => setOpen(false));
  }

  /* ---------- Active nav link ---------- */
  // Menu links may be "#id" or a full URL to "/#id"; only same-page anchors are tracked.
  const navLinks = [...document.querySelectorAll(".nav-links a:not(.btn)")].filter(
    (a) => a.hash && a.pathname.replace(/\/$/, "") === location.pathname.replace(/\/$/, "") && document.getElementById(a.hash.slice(1))
  );
  if (hasIO && navLinks.length) {
    const byId = new Map(navLinks.map((a) => [a.hash.slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.removeAttribute("aria-current"));
        byId.get(entry.target.id)?.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- Scroll reveal with sibling stagger ---------- */
  const reveals = [...document.querySelectorAll(".reveal")];
  reveals.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    el.style.setProperty("--d", `${Math.min(siblings.indexOf(el), 4) * 90}ms`);
  });
  if (reduceMotion || !hasIO) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Count-up figures ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const render = (el, value) => {
    el.textContent = inr.format(value);
  };
  if (!reduceMotion && hasIO && counters.length) {
    counters.forEach((el) => render(el, 0));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        const el = entry.target;
        const target = Number(el.dataset.count);
        const start = performance.now();
        const duration = 1400;
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 4);
          render(el, Math.round(target * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => io.observe(el));
  }

  /* ---------- FAQ accordion (one open at a time) ---------- */
  const accordion = document.querySelector("[data-accordion]");
  if (accordion) {
    accordion.addEventListener("click", (e) => {
      const button = e.target.closest("button[aria-controls]");
      if (!button) return;
      const item = button.closest(".faq-item");
      const open = button.getAttribute("aria-expanded") !== "true";
      accordion.querySelectorAll(".faq-item.is-open").forEach((other) => {
        if (other === item) return;
        other.classList.remove("is-open");
        other.querySelector("button").setAttribute("aria-expanded", "false");
      });
      item.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
    });
  }

  /* ---------- Pricing buttons prefill the quote form ---------- */
  const typeSelect = document.querySelector("#f-type");
  document.querySelectorAll("[data-plan]").forEach((btn) => {
    btn.addEventListener("click", () => { if (typeSelect) typeSelect.value = btn.dataset.plan; });
  });

  /* ---------- Floating call button hides over the contact section ---------- */
  const fab = document.querySelector(".call-fab");
  const contact = document.querySelector("#contact");
  if (fab && contact && hasIO) {
    new IntersectionObserver(([entry]) => fab.classList.toggle("is-hidden", entry.isIntersecting), { threshold: 0.2 }).observe(contact);
  }

  /* ---------- Quote form ---------- */
  const form = document.querySelector("[data-lead-form]");
  if (form) {
    const status = form.querySelector("[data-status]");
    const submit = form.querySelector("[data-submit]");
    const spinner = form.querySelector("[data-spinner]");

    const rules = {
      name: (v) => v.trim().length >= 2,
      email: (v) => v.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      phone: (v) => /^[6-9]\d{9}$/.test(v.replace(/\D/g, "")),
    };

    const setError = (input, invalid) => {
      input.setAttribute("aria-invalid", String(invalid));
      const err = document.getElementById(input.getAttribute("aria-describedby"));
      if (err) err.hidden = !invalid;
    };

    form.elements.phone.addEventListener("input", (e) => { e.target.value = e.target.value.replace(/\D/g, ""); });
    form.addEventListener("input", (e) => {
      const el = e.target;
      if (el.getAttribute("aria-invalid") === "true" && rules[el.name]?.(el.value)) setError(el, false);
    });

    const showStatus = (message, isError) => {
      status.hidden = false;
      status.classList.toggle("is-error", isError);
      status.innerHTML = `<i class="ph ${isError ? "ph-warning-circle" : "ph-check-circle"}" aria-hidden="true"></i><span></span>`;
      status.querySelector("span").textContent = message;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.hidden = true;
      let firstInvalid = null;
      Object.entries(rules).forEach(([name, test]) => {
        const input = form.elements[name];
        const invalid = !test(input.value);
        setError(input, invalid);
        if (invalid && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) { firstInvalid.focus(); return; }

      submit.disabled = true; spinner.hidden = false;
      try {
        const { ok, data } = await postToWordPress(form);
        if (ok) {
          form.reset();
          showStatus(t.leadOk, false);
        } else if (Array.isArray(data.fields) && data.fields.length) {
          data.fields.forEach((name) => form.elements[name] && setError(form.elements[name], true));
          form.elements[data.fields[0]]?.focus();
        } else {
          throw new Error("rejected");
        }
      } catch {
        showStatus(t.leadFail.replace("%s", cfg.phone || ""), true);
      } finally {
        submit.disabled = false; spinner.hidden = true;
      }
    });
  }

  /* ---------- Newsletter ---------- */
  const sub = document.querySelector("[data-subscribe]");
  if (sub) {
    const msg = sub.querySelector("[data-sub-status]");
    sub.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = sub.elements.email.value.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      sub.elements.email.setAttribute("aria-invalid", String(!valid));
      msg.hidden = false;
      msg.classList.toggle("is-error", !valid);
      if (!valid) { msg.textContent = t.subInvalid; return; }
      try {
        const { ok } = await postToWordPress(sub);
        if (!ok) throw new Error("rejected");
        sub.reset();
        msg.textContent = t.subOk;
      } catch {
        msg.classList.add("is-error");
        msg.textContent = t.subFail;
      }
    });
  }
})();
