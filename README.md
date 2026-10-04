# test123
## Arkaa Solar landing page

Static landing page for a rooftop solar company in India. No build step: open `index.html`, or serve the folder (`python3 -m http.server`).

- `index.html` sections: hero, trust facts, solutions, savings calculator, PM Surya Ghar subsidy, process, testimonials, FAQ, contact form, footer.
- `assets/css/styles.css`: design tokens, light and dark mode via `prefers-color-scheme`.
- `assets/js/main.js`: mobile menu, scroll reveal, savings calculator, lead form validation.
- Fonts (Geist) and icons (Phosphor) are self-hosted under `assets/`.

Before publishing, replace the sample business details (company name, phone, email, address, testimonials, pricing assumptions in `main.js`). Set `data-endpoint` on the contact form to post leads to your backend; without it the form hands the enquiry to WhatsApp.

## Solar Face redesign (`solar-face/`)

Modern redesign of the Solar Face site with the same content and sections. Open `solar-face/index.html` or serve that folder; it is self-contained (own fonts, icons, CSS, JS).

- One design language: Solar Face blue as the only accent, Geist type, pill buttons, 20px cards, light and dark mode.
- Motion: hero word reveal and photo settle, scroll reveals, count-up figures, scroll-tracked process steps, animated FAQ, header that turns solid after the hero. All of it respects reduced-motion settings.
- Items marked `verify` in the HTML were unreadable or missing in the screenshot of the current site (process steps, FAQ answers, address, phone, email, GSTIN, social links, form options).
- Set `data-endpoint` on the quote and newsletter forms to connect them to your backend.
