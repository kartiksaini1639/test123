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

## Solar Face, version 2 (`solar-face-v2/`)

A second, bolder direction for the same content: Swiss-style light layout, headline above a large framed hero photo, a gapless feature grid, process columns divided by vertical lines, overlapping photos for the subsidy section, a large quote wall and a full-bleed photo behind the quote form. Motion: the "Why Solar Face?" statement darkens line by line as you scroll, and photos drift slightly slower than the page (in browsers that support scroll-driven animations). The same `verify` notes and form setup as the first redesign apply.

## WordPress theme (`wordpress-theme/solar-face/`)

Solar Face version 2 as an installable WordPress theme (WordPress 6.0+, PHP 7.4+). Zip the `solar-face` folder and upload it under Appearance > Themes > Add New > Upload Theme. Business details, prices and photos are editable under Appearance > Customize > Solar Face settings; quote requests and newsletter sign-ups are saved under "Enquiries" in wp-admin and emailed to you. See `wordpress-theme/solar-face/readme.txt`.

## scrollr labs (`scrollr-labs/`)

Agency landing page built from the scrollr labs brand book: Signal Violet for actions, Lime Pop for highlights, Space Grotesk headlines and Inter body text, light and dark mode. The hero turns the logo (a scrollbar) into an interactive reel: moving the pointer up and down over it scrolls through Design, Build, Get found and Grow, each with its own animation; it cycles on its own when idle, and the stage names below it work as tabs on touch screens and with the keyboard. The header logo's lime dot tracks page scroll. Prices, the email address and social links are placeholders; set `data-endpoint` on the audit form to connect a form backend (without it the form opens an email draft).
