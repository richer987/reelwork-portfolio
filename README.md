# Reelwork Portfolio

A simple, modern multi-page static website for a UGC (user-generated content) video studio. Plain HTML/CSS/JS — no build step, no framework.

## Pages

- `index.html` — Home
- `pricing.html` — Pricing packages & add-ons
- `about.html` — About / process / values
- `faq.html` — FAQ accordion
- `contact.html` — Booking / contact form

## Local development

No build step required. Serve the folder with any static file server, e.g.:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Contact form

The booking form on `contact.html` currently runs in **demo mode** — submissions are validated client-side but not sent anywhere. To receive real submissions, sign up for a free form backend such as [Formspree](https://formspree.io) and set the form's `action` attribute (in `contact.html`) to the endpoint it gives you. No other code changes are required.

## Deployment

This site is deployed to Cloudflare Pages as static assets, with the source hosted on GitHub.
