=== Solar Face ===
Requires at least: 6.0
Tested up to: 6.8
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

One-page landing theme for Solar Face: solar energy solutions for Indian homes and businesses.

== Installation ==

1. In WordPress, go to Appearance > Themes > Add New > Upload Theme.
2. Choose solar-face.zip, click Install Now, then Activate.
3. Your homepage now shows the Solar Face landing page. It works whether
   Settings > Reading is set to "Your latest posts" or to a static page.

== Editing your details ==

Appearance > Customize > Solar Face settings:

* Business details: phone, WhatsApp number, email, office address, GSTIN,
  the email address that receives quote requests, and social media links.
  Social icons only appear once you add a link.
* Pricing: starting prices for the three plans and the EMI starting amount.
* Photos: hero, climate, subsidy and quote-form photos. Upload your own
  installation photos here; until then the theme uses free Unsplash photos.

Appearance > Customize > Site Identity: site name and logo. Without a logo,
the theme shows its built-in mark next to the site name.

Appearance > Menus: optionally build the header menu ("Header menu") and the
footer "Quick Links" ("Footer quick links"). Until you do, both link to the
homepage sections automatically. To link to a section, add a Custom Link such
as /#pricing or /#contact.

== Quote requests and newsletter sign-ups ==

Both forms save every submission under the "Enquiries" menu in wp-admin and
also email it to the address set in Business details (or the site admin
email). Many hosts do not send WordPress email reliably; if emails do not
arrive, install an SMTP plugin such as WP Mail SMTP. Enquiries are always
kept in wp-admin either way.

The forms include spam protection (hidden honeypot field, security token and
a limit of 6 submissions per visitor every 10 minutes).

If you use a page caching plugin, exclude admin-ajax.php from caching (most
caching plugins do this by default).

== Other pages ==

Posts, pages, the blog, search results and the 404 page use a clean reading
layout with the same header and footer.

== Text changes ==

Section text (headlines, FAQ answers, reviews, process steps) lives in
front-page.php and is translation-ready (text domain: solar-face). You can
change wording with a translation plugin such as Loco Translate without
editing code.

== Credits ==

* Geist and Geist Mono fonts by Vercel, SIL Open Font License 1.1.
* Phosphor Icons, MIT License.
* Default photos from Unsplash (Unsplash License).
