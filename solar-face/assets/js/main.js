(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasIO = "IntersectionObserver" in window;
  const inr = new Intl.NumberFormat("en-IN");

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

  /* ---------- Header: transparent over the hero, solid after ---------- */
  const header = document.querySelector("[data-header]");
  const hero = document.querySelector("[data-hero]");
  let overHero = false;
  const syncHeader = () => header.classList.toggle("is-solid", !overHero || header.classList.contains("menu-open"));
  if (header && hero && hasIO) {
    new IntersectionObserver(([entry]) => { overHero = entry.isIntersecting; syncHeader(); },
      { rootMargin: "-72px 0px 0px 0px", threshold: 0 }).observe(hero);
  } else if (header) {
    header.classList.add("is-solid");
  }

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  if (toggle && menu) {
    const icon = toggle.querySelector(".ph");
    const label = toggle.querySelector(".sr-only");
    const setOpen = (open) => {
      menu.classList.toggle("is-open", open);
      header.classList.toggle("menu-open", open);
      syncHeader();
      toggle.setAttribute("aria-expanded", String(open));
      icon.className = open ? "ph ph-x" : "ph ph-list";
      label.textContent = open ? "Close menu" : "Open menu";
    };
    toggle.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 1100px)").addEventListener("change", () => setOpen(false));
  }

  /* ---------- Active nav link ---------- */
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]:not(.btn)')];
  if (hasIO && navLinks.length) {
    const byId = new Map(navLinks.map((a) => [a.getAttribute("href").slice(1), a]));
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
    el.textContent = el.dataset.format === "inr" ? inr.format(value) : String(value);
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

  /* ---------- Process steps follow the scroll ---------- */
  const steps = document.querySelector("[data-steps]");
  if (steps) {
    const items = [...steps.querySelectorAll("[data-step]")];
    const activate = (index) => {
      items.forEach((item, i) => item.classList.toggle("is-active", i <= index));
      steps.style.setProperty("--progress", String(items.length > 1 ? index / (items.length - 1) : 1));
    };
    if (reduceMotion || !hasIO) {
      activate(items.length - 1);
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const i = items.indexOf(entry.target);
          if (entry.isIntersecting) activate(i);
          else if (entry.boundingClientRect.top > 0 && i > 0) activate(i - 1);
          else if (entry.boundingClientRect.top > 0 && i === 0) activate(-1);
        });
      }, { rootMargin: "-50% 0px -50% 0px" });
      items.forEach((item) => io.observe(item));
    }
  }

  /* ---------- FAQ accordion (one open at a time) ---------- */
  const accordion = document.querySelector("[data-accordion]");
  if (accordion) {
    accordion.addEventListener("click", (e) => {
      const button = e.target.closest("button[aria-controls]");
      if (!button) return;
      const item = button.closest(".acc-item");
      const open = button.getAttribute("aria-expanded") !== "true";
      accordion.querySelectorAll(".acc-item.is-open").forEach((other) => {
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
      const t = e.target;
      if (t.getAttribute("aria-invalid") === "true" && rules[t.name]?.(t.value)) setError(t, false);
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

      const data = Object.fromEntries(new FormData(form));
      data.subsidy = data.subsidy === "yes";

      if (form.dataset.endpoint) {
        submit.disabled = true; spinner.hidden = false;
        try {
          const res = await fetch(form.dataset.endpoint, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error(String(res.status));
          form.reset();
          showStatus("Thank you. Our solar expert will call you back shortly.", false);
        } catch {
          showStatus("Something went wrong. Please call us at +91 93559 21251.", true);
        } finally {
          submit.disabled = false; spinner.hidden = true;
        }
        return;
      }

      // No backend configured yet: send the enquiry through WhatsApp so it still arrives.
      const lines = [
        "Hello Solar Face, I would like a free consultation.",
        `Name: ${data.name.trim()}`,
        `Phone: +91 ${data.phone}`,
        data.email && `Email: ${data.email}`,
        data.city && `City: ${data.city}`,
        data.type && `Requirement: ${data.type}`,
        data.subsidy && "Please check my eligibility for Govt Subsidy.",
        data.message && `Message: ${data.message}`,
      ].filter(Boolean);
      window.open(`https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
      showStatus("WhatsApp has opened with your details. Press send and our expert will call you back.", false);
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
      if (!valid) { msg.textContent = "Please enter a valid email address."; return; }

      if (sub.dataset.endpoint) {
        try {
          const res = await fetch(sub.dataset.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
          if (!res.ok) throw new Error(String(res.status));
          sub.reset();
          msg.textContent = "You are subscribed. Thank you!";
        } catch {
          msg.classList.add("is-error");
          msg.textContent = "Could not subscribe right now. Please try again later.";
        }
        return;
      }
      window.location.href = `mailto:${sub.dataset.mailto}?subject=${encodeURIComponent("Subscribe to updates")}&body=${encodeURIComponent(`Please add ${email} to the Solar Face updates list.`)}`;
      msg.textContent = "Your email app has opened. Send the message to subscribe.";
    });
  }
})();
