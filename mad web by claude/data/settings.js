/* ==========================================================================
   AIAT — data/settings.js
   HOW TO EDIT: change the values between the quotes. Keep the quotes and
   the commas. Leave a value as "" if you don't have it yet; the site hides
   anything that's empty. Save the file and reload the page.
   ========================================================================== */
window.AIAT_SETTINGS = {
  name: "Ali Ibn-e-Abitalib Islamic Institution",
  shortName: "AIAT",

  /* Contact */
  whatsapp: "",        // TODO: number with country code, digits only, e.g. "923001234567"
  phone: "",           // TODO
  email: "",           // TODO
  address: "",         // TODO: full address in Quetta
  mapUrl: "",          // TODO: Google Maps link to the institute
  openingHours: "",    // TODO

  /* Social and video */
  facebookUrl: "",     // TODO
  youtubeUrl: "",      // TODO: the channel
  youtubeLiveUrl: "",  // TODO: where the livestream plays

  /* Forms (Formspree endpoints, e.g. "https://formspree.io/f/abcdwxyz") */
  forms: {
    enrol: "",         // TODO
    camp: "",          // TODO
    support: "",       // TODO
    enquiry: ""        // TODO
  },

  /* Prayer times (Aladhan API). Method 0 = Shia Ithna-Ashari (Jafari). */
  prayerCity: "Quetta",
  prayerCountry: "Pakistan",
  prayerMethod: 0,     // TODO: confirm the method the institute follows

  /* Local moon sighting can differ from the printed calendar by a day or
     two. Use 1 or -1 (or 2, -2) to shift every Hijri date on the site. */
  hijriOffsetDays: 0
};
