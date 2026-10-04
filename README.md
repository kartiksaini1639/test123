# test123
## Arkaa Solar landing page

Static landing page for a rooftop solar company in India. No build step: open `index.html`, or serve the folder (`python3 -m http.server`).

- `index.html` sections: hero, trust facts, solutions, savings calculator, PM Surya Ghar subsidy, process, testimonials, FAQ, contact form, footer.
- `assets/css/styles.css`: design tokens, light and dark mode via `prefers-color-scheme`.
- `assets/js/main.js`: mobile menu, scroll reveal, savings calculator, lead form validation.
- Fonts (Geist) and icons (Phosphor) are self-hosted under `assets/`.

Before publishing, replace the sample business details (company name, phone, email, address, testimonials, pricing assumptions in `main.js`). Set `data-endpoint` on the contact form to post leads to your backend; without it the form hands the enquiry to WhatsApp.
