# CLAUDE.md — AIAT Website (V1, built from scratch)

Read this whole file before writing any code. It is the brief, the strategy and
the build plan. Ignore any older website files in this folder unless Mueez asks
you to use them.

---

## 1. The client

**Ali Ibn-e-Abitalib Islamic Institution** — short name **AIAT**.

- A Shia Islamic religious institute. Founded in **1992**; the Quetta institute
  has served the community since **2018**. Quetta, Balochistan, Pakistan.
- Head / founder: **Muhammad Kazim Behjati** (`TODO: confirm title and spelling`).
- **Teaches:** Qur'an, Tajweed, Ahkam, Hawza (religious studies). Some classes
  are online, including for students abroad. **Classes are the only source of
  income.**
- **Runs a yearly cycle of programs:** Muharram (first ten nights), Ramadan,
  Shab-e-Qadr, Eid prayers, Eid al-Ghadir, and a January winter camp for boys
  aged 10–17.
- **Muharram is the peak of the year.** The head speaks every night for the
  first ten nights, attendance is large, and it is livestreamed on YouTube.
  It is filmed and photographed properly (Canon video, Sony A7III photos).
- **Media:** strong Facebook following (photos, posters — mostly red), YouTube
  (lectures and livestreams).
- Logo: dark teal dome over an open book, gold Arabic calligraphy, wordmark
  "ALI IBN-E-ABITALIB / ISLAMIC INSTITUTION". File: `images/logo.png`.

## 2. Who the site is for

| Audience | What they need | Where they are |
|---|---|---|
| Local families & students in Quetta | Class info, timings, how to join, what's on this week | Phone, often slow mobile internet |
| Parents | Trust, the winter camp, who teaches their child | Phone, shared links on WhatsApp |
| Students abroad | Online classes, times in **their** timezone, how to start | Phone or laptop, other countries |
| Muharram & program attendees | Schedule, the livestream, recordings of past nights | Phone, during the season |
| Supporters | Welfare & educational support, how to help | Any device |

Most visitors arrive **from a WhatsApp or Facebook link on a phone**. Design
mobile-first. Assume a mid-range Android phone on a weak connection.

## 3. Strategy — what makes this site different

A generic AI website has: hero → About → Services → Testimonials → Contact.
**Do not build that.** No section named "About" or "Services".

This site is organised around how AIAT actually lives:

1. **It's a living noticeboard, not a brochure.** The top of the site shows
   what is happening *now*: today's Hijri date, prayer times in Quetta, the next
   program and the next class. People should have a reason to open it again.
2. **Time is the structure.** The institute runs on the Islamic year. The site
   knows the current Hijri date and changes what it highlights with the season.
3. **Muharram is the emotional peak**, and it gets the most crafted, solemn,
   scroll-driven chapter of the site.
4. **Every section either proves something or lets someone do something.**
   No decorative filler sections.
5. **Real systems, no backend.** Everything works with plain JS, data files,
   free public APIs, Formspree forms and WhatsApp links.

## 4. How to work

- Work in the **phases in section 11**. At the end of each phase, stop and let
  Mueez review it in the browser before continuing.
- **Phase 0 comes first:** a `styleguide.html` page showing the palette, type
  scale, buttons, cards and one motion sample. Get approval on it before
  building the real pages.
- Ask before changing the brand, the plan, or adding a library not listed here.
- Keep code well organised and commented: one comment above each block saying
  what it is. Mueez maintains this site later.
- Never invent facts, numbers, names, dates, quotes, Qur'an verses or hadith.
  Leave a `TODO` (see section 10).

## 5. Tech

- **HTML, CSS and JavaScript.** No frameworks, no build step, no npm.
- JavaScript can be used freely.
- Allowed libraries (CDN only): **GSAP + ScrollTrigger** for scroll animation.
  Anything else — ask first.
- Data lives in plain JS files (`data/*.js`, defining global objects), **not**
  JSON loaded with `fetch`, so the site still works when `index.html` is opened
  straight from the folder.
- Forms: **Formspree** (free). Endpoints are `TODO` until Mueez creates them.

```
/index.html
/muharram.html          (full Muharram chapter, see 8.5)
/library.html           (full lecture archive, see 8.6)
/styleguide.html        (phase 0, internal only)
/css/   base.css, layout.css, components.css, motion.css
/js/    main.js, now.js, classes.js, calendar.js, archive.js, forms.js, motion.js
/data/  settings.js, classes.js, programs.js, lectures.js, muharram.js
/images/ (webp, compressed)
```

## 6. Data layer — the "real system"

Staff and Mueez update the site by editing **only** the `data/` files, never
the layout code. Each file starts with a comment explaining how to edit it.

- `settings.js` — WhatsApp number, phone, email, address, map link, Facebook
  and YouTube URLs, YouTube live URL, Formspree endpoints, prayer-time method,
  `hijriOffsetDays` (local moon-sighting can differ from the computed calendar
  by ±1–2 days; this corrects it).
- `classes.js` — each class: subject, level, age group, mode (in person /
  online / both), days, start and end time (in Pakistan time), teacher,
  short description, status (open / full / starting soon).
- `programs.js` — the yearly programs: name, Hijri or Gregorian date range,
  description, image, whether it's livestreamed.
- `muharram.js` — the ten nights: night number, date, topic, recording link,
  photo.
- `lectures.js` — the archive: title, speaker, year, occasion, topic tags,
  YouTube ID, duration.

## 7. Visual identity

The logo colors are the base, extended the way a studio would extend them.
Not a copy of any other site.

### Palette (define all as CSS variables in `:root`)

| Token | Value | Use |
|---|---|---|
| `--paper` | `#F6F3EC` | Main background (warm ivory, not pure white) |
| `--paper-2` | `#ECE6DA` | Alternate surfaces, cards |
| `--ink` | `#16262A` | Body text |
| `--teal` | `#123D45` | Primary brand color, headings, primary buttons |
| `--teal-deep` | `#0C2A30` | Dark sections, footer |
| `--teal-soft` | `#DCE7E6` | Tints, tags, selected filters |
| `--gold` | `#C29A5E` | Accents, rules, icons, on dark backgrounds |
| `--gold-text` | `#8A6631` | Gold used for small text on light backgrounds (contrast) |
| `--line` | `rgba(18, 61, 69, 0.14)` | Hairline borders and dividers |

**Muharram mode** (used in the Muharram chapter and, during Muharram, the top
of the homepage):

| Token | Value | Use |
|---|---|---|
| `--mourning` | `#0B0E0F` | Background |
| `--mourning-text` | `#D9D6D0` | Text |
| `--crimson` | `#7A1F1F` | The only accent — ties to AIAT's red Facebook posters |

Tune these if they don't sit well together on screen — that's expected — but
keep the roles. All text must pass WCAG AA contrast.

### Typography

Elegant and calm. **No heavy bold weights** (nothing above 600).

- **Display / headings:** *Cormorant Garamond*, weights 400–500, set large with
  generous line spacing.
- **Body / interface:** *Manrope*, weights 400–600.
- **Arabic text** (calligraphic lines, names of programs): *Amiri*.
- **Urdu** (if used): *Noto Nastaliq Urdu*.

All from Google Fonts. If a pairing doesn't work in practice, propose an
alternative in the styleguide before using it.

Type scale is up to you, but keep it to a small fixed set and reuse it.

### Layout and feel

- Generous space between sections, but not empty-looking — every screen should
  feel considered and full of intent.
- Thin gold hairlines and small numbered labels (e.g. `01 — The Year`) as the
  recurring structural device instead of boxes and shadows.
- Photography is real AIAT photography, never stock and never AI-generated.
  Full-bleed where it matters, with a subtle warm grade for consistency.
- Icons: thin line style, consistent stroke, used sparingly.

### Motion

- Motion has meaning: it follows time (the year, the ten nights) or reveals
  proof. Never motion for decoration.
- Scroll-driven chapters (pinned sections) are allowed in the places marked
  **[scroll]** below.
- Respect `prefers-reduced-motion`: everything still readable with no motion.
- On phones, simplify pinned sequences into simple vertical reveals if they
  feel cramped or slow.

## 8. Site map

Navigation (desktop: logo left, links centered, one button right; mobile:
full-screen menu):

**Learn · The Year · Muharram · Library · Camp · Support · Visit**
Right-side button: **Join a class** (opens the enrollment drawer).
(A login button replaces this in V2.)

### Homepage, in order

#### 8.1 Now — the living noticeboard
The first screen. Not a slogan over a photo.
- Institute name and one short line of purpose (`TODO: Mueez to confirm line`).
- A "now" strip: today's Hijri and Gregorian date, today's prayer times for
  Quetta with the next prayer highlighted, and the next upcoming program with a
  countdown.
- If a livestream is happening (time window from `programs.js` /
  `muharram.js`), a small **Live now** badge linking to YouTube.
- During the Islamic month of Muharram, this screen switches to **Muharram mode**
  automatically.
- One strong real photograph.

#### 8.2 Proof **[scroll]**
Right after the first screen. A pinned sequence: as you scroll, real photos
change and facts arrive one at a time.
- Founded 1992
- Serving Quetta since 2018
- `[X]` students taught (`TODO`)
- 10 nights of Muharram every year, livestreamed
- `[X]` Facebook followers (`TODO`)
- 6 yearly programs

Numbers count up when they arrive. Never fill in a number that Mueez hasn't
confirmed — skip that fact until it's provided.

#### 8.3 Learn — class finder (system)
The most important section: it's where income comes from.
- Filter chips: subject, level, age group, in person / online.
- Class cards from `data/classes.js`: subject, level, days and time, teacher,
  status (open / full / starting soon).
- **Timezone switch:** times shown in Pakistan time by default; one tap shows
  them in the visitor's own timezone (detected automatically) — for students
  abroad.
- Each card has **Request a seat**, which opens the enrollment drawer (8.10)
  with that class pre-selected.

#### 8.4 The Year **[scroll]**
The Islamic year as a horizontal timeline, driven by vertical scroll on desktop
(vertical list on mobile).
- Programs from `data/programs.js`, placed in calendar order.
- A "we are here" marker at today's Hijri date.
- Each program: name (with Arabic), dates, one line, photo, and **Add to
  calendar** (Google Calendar link + downloadable `.ics` file, generated in JS).
- Includes the January winter camp (a Gregorian date) on the same line.

#### 8.5 Muharram — the peak chapter **[scroll]**
On the homepage: a short, solemn teaser chapter in Muharram mode, leading to
`muharram.html`.

`muharram.html`: the ten nights as a scroll journey — one night per step,
with photo, date, topic and a "watch the recording" link (from
`data/muharram.js`). Quiet, slow, dark, respectful. No celebratory effects,
no bright colors, no playful motion. Includes the livestream panel and the
schedule for the coming Muharram.

#### 8.6 Library — lecture archive (system)
On the homepage: the latest few lectures. Full archive on `library.html`.
- Search by title/topic, filter by year, occasion and speaker.
- Data from `data/lectures.js`.
- **Light YouTube embeds:** show the thumbnail first and load the real player
  only when tapped (much faster on slow connections).

#### 8.7 Camp — the January winter camp
For parents. What happens, the age range (10–17), dates, what to bring
(`TODO`), photos from past camps.
- **Registration form** (Formspree): child's name, age (validated 10–17),
  parent name, parent WhatsApp number, any notes. Clear confirmation message.

#### 8.8 Support — School and Welfare & Educational Support
Two short, honest blocks with real details (`TODO: Mueez to provide`).
- A confidential **request support** form (Formspree).
- A **support a student** call to action (details `TODO`).

#### 8.9 Visit
- Address, embedded map, opening hours (`TODO`).
- **WhatsApp button** with a pre-filled message — WhatsApp is how people here
  actually get in touch.
- A short general enquiry form (Formspree). No "call us" as the main action.

#### 8.10 Enrollment drawer (system, site-wide)
A slide-in panel used by every "Join a class" / "Request a seat" button.
- Fields: name, age, city and country, class (pre-selected if opened from a
  card), in person or online, preferred time, WhatsApp number, email (optional).
- Sends to Formspree, and offers "or send this on WhatsApp" which opens WhatsApp
  with the same details pre-written.
- Proper validation, error messages, loading state and a success state.

#### 8.11 Footer
Deep teal. Name, Quetta address, quick links, Facebook and YouTube, today's
Hijri date, © 2026 AIAT.

## 9. System details

- **Prayer times:** Aladhan API
  (`https://api.aladhan.com/v1/timingsByCity?city=Quetta&country=Pakistan&method=0`;
  method 0 is the Shia Ithna-Ashari / Jafari method). Method stored in
  `settings.js` so the institute can change it (`TODO: confirm method`).
  Cache today's result in `localStorage`. If the request fails, hide the block
  quietly — never show broken content.
- **Hijri date:** `Intl.DateTimeFormat` with the `islamic-umalqura` calendar,
  adjusted by `hijriOffsetDays`.
- **Season switching:** Muharram mode is decided by the Hijri month.
- **Live status:** based on time windows in the data files (no API needed).
- **Countdown:** to the next program in `programs.js`.
- **Add to calendar:** Google Calendar URL + generated `.ics` download.
- **Sharing:** Open Graph and Twitter meta tags with a proper preview image, so
  links look good when shared on WhatsApp and Facebook.
- **Search engines:** `EducationalOrganization` and `Event` structured data
  (JSON-LD).

## 10. Content rules

- Use only the facts in this file and what Mueez provides.
- Never invent: numbers, names, titles, dates, timings, fees, testimonials,
  Qur'an verses, hadith, or quotes from the head.
- When something is missing, put a clearly visible placeholder in the design
  and a `<!-- TODO: ... -->` comment, and add it to the list in `TODO.md`.
- Tone: warm, dignified, plain words. Short sentences. No marketing clichés
  ("unlock", "journey", "transform", "world-class").
- English first. Urdu is a later option (section 12).

## 11. Build phases

| Phase | Build | Stop for review |
|---|---|---|
| 0 | `styleguide.html`: palette, fonts, type scale, buttons, chips, cards, form fields, one scroll sample | Yes |
| 1 | Navigation, footer, data files with sample structure, `TODO.md` | Yes |
| 2 | 8.1 Now (prayer times, Hijri date, countdown, live badge, Muharram mode) | Yes |
| 3 | 8.2 Proof | Yes |
| 4 | 8.3 Learn + 8.10 Enrollment drawer | Yes |
| 5 | 8.4 The Year | Yes |
| 6 | 8.5 Muharram (homepage chapter + `muharram.html`) | Yes |
| 7 | 8.6 Library (homepage + `library.html`) | Yes |
| 8 | 8.7 Camp, 8.8 Support, 8.9 Visit | Yes |
| 9 | Polish: performance, accessibility, SEO, sharing, mobile testing | Yes |

## 12. Not in V1

Login, accounts, student dashboard, online payments, databases, Firebase,
3D/WebGL, AI-generated images or video, an Urdu version (planned later as an
English/Urdu toggle with right-to-left layout).

## 13. Definition of done

- [ ] Every section in section 8 is built and works with real data
- [ ] Looks and works right at 375px, 768px and 1440px
- [ ] Works on a slow connection: images in WebP, lazy-loaded, homepage under
      ~2MB on first load, light YouTube embeds
- [ ] All forms send test submissions and show success/error states
- [ ] Prayer times, Hijri date, countdown and Muharram mode work, and fail
      quietly when offline
- [ ] Keyboard and screen-reader friendly; all images have `alt` text;
      reduced-motion respected
- [ ] Link previews look right on WhatsApp and Facebook
- [ ] `TODO.md` lists every missing fact for Mueez
- [ ] Published live (Netlify or Firebase Hosting) with a shareable link

## 14. Open questions for Mueez (start `TODO.md` with these)

- Number of students taught; current Facebook follower count
- One-line statement of purpose for the first screen
- Full class list: subjects, levels, ages, days, times, teachers, online or not
- Exact program dates for the coming year; Muharram night topics
- YouTube links for past lectures and Muharram nights
- WhatsApp number, phone, email, address, map location, opening hours
- Prayer-time method the institute follows
- School details; Welfare & Educational Support details
- Winter camp dates and what to bring
- Photos: building, classes, each program, Muharram nights, winter camp
