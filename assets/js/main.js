(() => {
  "use strict";

  document.documentElement.classList.add("js");

  const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

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

  /* ---------- Header border once the page scrolls ---------- */
  const header = document.querySelector("[data-header]");
  const hero = document.querySelector(".hero");
  if (header && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => header.classList.toggle("is-scrolled", entry.intersectionRatio < 0.98),
      { threshold: [0.98] }
    ).observe(hero);
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
    window.matchMedia("(min-width: 1024px)").addEventListener("change", () => setOpen(false));
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Savings calculator ---------- */
  // Planning assumptions, not quotes. Update to your current pricing.
  const UNITS_PER_KW_MONTH = 120;
  const COST_PER_KW = { home: 60000, society: 52000, business: 45000 };
  const MAX_KW = { home: 10, society: 500, business: 1000 };

  // PM Surya Ghar central financial assistance.
  const subsidyFor = (type, kw) => {
    if (type === "home") return Math.min(kw, 2) * 30000 + Math.max(0, Math.min(kw, 3) - 2) * 18000;
    if (type === "society") return Math.min(kw, 500) * 18000;
    return 0;
  };

  const calc = document.querySelector("[data-calc]");
  const result = document.querySelector("[data-calc-result]");
  if (calc && result) {
    const out = (key) => result.querySelector(`[data-out="${key}"]`);
    const billInput = calc.querySelector("#calc-bill");
    const tariffInput = calc.querySelector("#calc-tariff");
    const billError = calc.querySelector("#calc-bill-error");

    const update = () => {
      const type = calc.querySelector('input[name="type"]:checked').value;
      const bill = Number(billInput.value);
      const tariff = Math.min(Math.max(Number(tariffInput.value) || 8, 3), 20);
      const valid = Number.isFinite(bill) && bill >= 500;

      billInput.setAttribute("aria-invalid", String(!valid));
      billError.hidden = valid;
      result.classList.toggle("is-invalid", !valid);
      if (!valid) return;

      const units = bill / tariff;
      const kw = Math.min(Math.max(Math.ceil((units / UNITS_PER_KW_MONTH) * 2) / 2, 1), MAX_KW[type]);
      const cost = kw * COST_PER_KW[type];
      const subsidy = subsidyFor(type, kw);
      const yearly = Math.min(units, kw * UNITS_PER_KW_MONTH) * tariff * 12;
      const payback = (cost - subsidy) / yearly;

      out("kw").textContent = kw % 1 ? kw.toFixed(1) : String(kw);
      out("cost").textContent = inr.format(cost);
      out("subsidy").textContent = subsidy ? inr.format(subsidy) : "Not applicable";
      out("savings").textContent = inr.format(yearly);
      out("payback").textContent = `${payback.toFixed(1)} years`;
    };

    calc.addEventListener("input", update);
    calc.addEventListener("submit", (e) => e.preventDefault());
    update();
  }

  /* ---------- Lead form ---------- */
  const form = document.querySelector("[data-lead-form]");
  if (form) {
    const status = form.querySelector("[data-form-status]");
    const submit = form.querySelector("[data-submit]");
    const spinner = form.querySelector("[data-submit-spinner]");

    const rules = {
      name: (v) => v.trim().length >= 2,
      phone: (v) => /^[6-9]\d{9}$/.test(v.replace(/\D/g, "")),
      pincode: (v) => /^[1-9]\d{5}$/.test(v.trim()),
    };

    const setFieldError = (input, invalid) => {
      input.setAttribute("aria-invalid", String(invalid));
      const err = form.querySelector(`#${input.getAttribute("aria-describedby")}`);
      if (err) err.hidden = !invalid;
    };

    const validate = () => {
      let firstInvalid = null;
      Object.entries(rules).forEach(([name, test]) => {
        const input = form.elements[name];
        const invalid = !test(input.value);
        setFieldError(input, invalid);
        if (invalid && !firstInvalid) firstInvalid = input;
      });
      const consent = form.elements.consent;
      setFieldError(consent, !consent.checked);
      if (!consent.checked && !firstInvalid) firstInvalid = consent;
      return firstInvalid;
    };

    // Clear an error as soon as the field becomes valid.
    form.addEventListener("input", (e) => {
      const t = e.target;
      if (t.getAttribute("aria-invalid") !== "true") return;
      const ok = t.type === "checkbox" ? t.checked : rules[t.name]?.(t.value);
      if (ok) setFieldError(t, false);
    });
    ["phone", "pincode"].forEach((name) => {
      form.elements[name].addEventListener("input", (e) => { e.target.value = e.target.value.replace(/\D/g, ""); });
    });

    const showStatus = (message, isError) => {
      status.hidden = false;
      status.classList.toggle("is-error", isError);
      status.innerHTML = `<i class="ph ${isError ? "ph-warning-circle" : "ph-check-circle"}" aria-hidden="true"></i><span></span>`;
      status.querySelector("span").textContent = message;
    };

    const setLoading = (loading) => {
      submit.disabled = loading;
      spinner.hidden = !loading;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.hidden = true;
      const firstInvalid = validate();
      if (firstInvalid) { firstInvalid.focus(); return; }

      const data = Object.fromEntries(new FormData(form));
      data.phone = data.phone.replace(/\D/g, "");
      const endpoint = form.dataset.endpoint;

      if (endpoint) {
        setLoading(true);
        try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error(String(res.status));
          form.reset();
          showStatus("Thank you. A solar engineer will call you within one working day.", false);
        } catch {
          showStatus("We could not send your request. Please call or WhatsApp us instead.", true);
        } finally {
          setLoading(false);
        }
        return;
      }

      // No backend configured: hand the enquiry to WhatsApp so it still reaches the team.
      const text = [
        "Hello Arkaa Solar, I would like a free site survey.",
        `Name: ${data.name.trim()}`,
        `Mobile: +91 ${data.phone}`,
        `PIN code: ${data.pincode}`,
        `Property: ${data.type}`,
        `Monthly bill: ${data.bill}`,
      ].join("\n");
      window.open(`https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      showStatus("WhatsApp has opened with your details. Press send and we will reply to confirm your survey slot.", false);
    });
  }
})();
