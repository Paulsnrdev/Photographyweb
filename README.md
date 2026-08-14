# Lumière Studio — Photography Website

A static, multi-page website for a photography studio, built with plain HTML, CSS, and JavaScript (no build tools or frameworks required).

## Pages

| Page | File | Description |
|---|---|---|
| Home | `index.html` | Hero slider, studio highlights, testimonials |
| Gallery | `gallery.html` | Filterable masonry gallery with a lightbox viewer |
| Services | `services.html` | Photography packages and pricing |
| About | `about.html` | Studio story and team |
| Contact | `contact.html` | Contact form |
| Booking | `booking.html` | Session booking form |

## Features

- Responsive layout with a mobile hamburger menu
- Auto-rotating hero image slider with keyboard navigation
- Gallery filtering by category, plus a swipeable lightbox with keyboard/touch controls
- Scroll-reveal animations via `IntersectionObserver`
- Testimonials carousel
- Contact and booking forms with client-side validation, submitted via [Formspree](https://formspree.io)

## Project Structure

```
photography-website/
├── index.html
├── gallery.html
├── services.html
├── about.html
├── contact.html
├── booking.html
├── css/
│   └── style.css
├── js/
│   ├── main.js       # navigation, hero slider, scroll animations, testimonials
│   ├── gallery.js     # gallery filtering + lightbox
│   └── booking.js     # form validation + Formspree submission
└── images/
    ├── hero/
    ├── gallery/
    ├── services/
    └── about/
```

## Getting Started

No build step is required — open `index.html` directly in a browser, or serve the folder locally:

```bash
npx serve .
```

## Configuration

The contact and booking forms submit to Formspree. Before deploying, replace the placeholder form IDs in `contact.html` and `booking.html`:

```html
<form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST" novalidate>
```

1. Create a free account at [formspree.io](https://formspree.io).
2. Create a form and copy its endpoint URL.
3. Replace `YOUR_FORM_ID` in both `contact.html` and `booking.html`.

## External Dependencies

Loaded via CDN — no local install needed:

- [Google Fonts](https://fonts.google.com) — Playfair Display, Montserrat
- [Font Awesome](https://fontawesome.com) — icons

## Deployment

As a static site, it can be deployed to any static host (GitHub Pages, Netlify, Vercel, etc.) by uploading the project files as-is.
