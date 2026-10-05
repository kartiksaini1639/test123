(() => {
  "use strict";

  document.documentElement.classList.add("js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasIO = "IntersectionObserver" in window;

  /* ---------- Footer year ---------- */
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Header hairline once the page leaves the top ---------- */
  const header = document.querySelector("[data-header]");
  const sentinel = document.createElement("div");
  sentinel.setAttribute("aria-hidden", "true");
  sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:8px;";
  document.body.prepend(sentinel);
  if (header && hasIO) {
    new IntersectionObserver(([entry]) => header.classList.toggle("is-scrolled", !entry.isIntersecting)).observe(sentinel);
  }

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
      label.textContent = open ? "Close menu" : "Open menu";
    };
    toggle.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 1000px)").addEventListener("change", () => setOpen(false));
  }

  /* ---------- Active nav link ---------- */
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]:not(.btn)')];
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

  /* ---------- Pricing region (India / US), remembered per visitor ---------- */
  const radios = [...document.querySelectorAll("[data-region]")];
  const prices = [...document.querySelectorAll(".price [data-in]")];
  const showRegion = (region, animate) => {
    prices.forEach((el) => {
      const value = el.dataset[region];
      if (!animate || reduceMotion) { el.textContent = value; return; }
      el.classList.add("is-swapping");
      setTimeout(() => { el.textContent = value; el.classList.remove("is-swapping"); }, 200);
    });
  };
  if (radios.length) {
    let saved = null;
    try { saved = localStorage.getItem("scrollr-region"); } catch { /* storage unavailable */ }
    if (!saved) saved = /^en-US$/i.test(navigator.language) ? "us" : "in";
    const start = radios.find((r) => r.value === saved) || radios[0];
    start.checked = true;
    showRegion(start.value, false);
    radios.forEach((r) => r.addEventListener("change", () => {
      showRegion(r.value, true);
      try { localStorage.setItem("scrollr-region", r.value); } catch { /* storage unavailable */ }
    }));
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

  /* ---------- Audit form ---------- */
  const form = document.querySelector("[data-lead-form]");
  if (form) {
    const status = form.querySelector("[data-status]");
    const submit = form.querySelector("[data-submit]");
    const spinner = form.querySelector("[data-spinner]");
    const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    const rules = { name: (v) => v.trim().length >= 2, email: emailOk };

    const setError = (input, invalid) => {
      input.setAttribute("aria-invalid", String(invalid));
      const err = document.getElementById(input.getAttribute("aria-describedby"));
      if (err) err.hidden = !invalid;
    };
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

      const data = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        website: form.elements.website.value.trim(),
        country: form.elements.country.value,
        needs: [...form.querySelectorAll('input[name="needs"]:checked')].map((c) => c.value),
        message: form.elements.message.value.trim(),
      };

      if (form.dataset.endpoint) {
        submit.disabled = true; spinner.hidden = false;
        try {
          const res = await fetch(form.dataset.endpoint, {
            method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error(String(res.status));
          form.reset();
          showStatus("Thanks! We'll email you within one working day to book your audit call.", false);
        } catch {
          showStatus(`That didn't send. Please email us at ${form.dataset.mailto}.`, true);
        } finally {
          submit.disabled = false; spinner.hidden = true;
        }
        return;
      }

      // No form backend yet: open an email draft with everything filled in.
      const body = [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        data.website && `Website: ${data.website}`,
        `Country: ${data.country}`,
        data.needs.length && `Needs help with: ${data.needs.join(", ")}`,
        data.message && `\n${data.message}`,
      ].filter(Boolean).join("\n");
      window.location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent("Free audit request: " + data.name)}&body=${encodeURIComponent(body)}`;
      showStatus("Your email app has opened with the details. Press send and we'll reply within one working day.", false);
    });
  }
})();
