/* ==========================================================================
   AIAT — data/programs.js
   The yearly programs, in calendar order. The homepage uses this list for
   "Next on the calendar" and for the events row.

   HOW TO EDIT: copy one { ... } block to add a program. For each one:
     name      the program's name
     nameAr    the name in Arabic (optional)
     start     when it begins. Islamic dates:   { calendar: "hijri", month: 1, day: 1 }
                                 Gregorian dates: { calendar: "gregorian", month: 1, day: 15 }
               (months are numbers: Muharram = 1 ... Dhu al-Hijjah = 12;
                January = 1 ... December = 12)
     when      how the date should read on the page
     line      one short sentence about it
     image     path to its photo, e.g. "images/programs/muharram.webp"
     livestream  true if it is streamed on YouTube
   ========================================================================== */
window.AIAT_PROGRAMS = [
  {
    id: "muharram",
    name: "The first ten nights of Muharram",
    nameAr: "محرم",
    start: { calendar: "hijri", month: 1, day: 1 },
    when: "1 to 10 Muharram",
    line: "The head of the institute speaks each night.",
    image: "",            // TODO
    livestream: true
  },
  {
    id: "ramadan",
    name: "Ramadan",
    nameAr: "رمضان",
    start: { calendar: "hijri", month: 9, day: 1 },
    when: "Ramadan",
    line: "",             // TODO: what happens through the month
    image: "",            // TODO
    livestream: false
  },
  {
    id: "shab-e-qadr",
    name: "Shab-e-Qadr",
    nameAr: "ليلة القدر",
    start: { calendar: "hijri", month: 9, day: 19 },   // TODO: confirm the nights held
    when: "Nights of Ramadan",
    line: "",             // TODO
    image: "",            // TODO
    livestream: false
  },
  {
    id: "eid-prayers",
    name: "Eid prayers",
    nameAr: "صلاة العيد",
    start: { calendar: "hijri", month: 10, day: 1 },   // TODO: confirm which Eids
    when: "1 Shawwal",
    line: "",             // TODO
    image: "",            // TODO
    livestream: false
  },
  {
    id: "ghadir",
    name: "Eid al-Ghadir",
    nameAr: "عيد الغدير",
    start: { calendar: "hijri", month: 12, day: 18 },
    when: "18 Dhu al-Hijjah",
    line: "",             // TODO
    image: "",            // TODO
    livestream: false
  },
  {
    id: "winter-camp",
    name: "Winter camp",
    nameAr: "",
    start: { calendar: "gregorian", month: 1, day: 1 },  // TODO: exact start date
    when: "January",
    line: "A camp for boys aged 10 to 17.",
    image: "",            // TODO
    livestream: false
  }
];
