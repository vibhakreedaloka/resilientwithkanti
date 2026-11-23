/* resilientwithkanti.com — small page behaviours
   1. Webinar date/time from settings.js
   2. Tick-box cards in "Then this Masterclass was built for you"
   3. Photo lightbox (links with data-lightbox)
   ("Save My Free Seat" buttons are plain links to the checkout page, set in lp-new/index.html)
*/
(function () {
  // ---- 1. Webinar date / time (from settings.js) ----
  // "2026-11-28" -> "Sat | 28th Nov"     "19:00" -> "07:00 PM IST"
  function formatDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return null;
    var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    if (d.getUTCMonth() !== +m[2] - 1 || d.getUTCDate() !== +m[3]) return null;   // not a real date
    var day = +m[3];
    var suffix = (day % 100 >= 11 && day % 100 <= 13) ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] || 'th');
    var weekday = d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
    var month = d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
    return weekday + ' | ' + day + suffix + ' ' + month;
  }
  function formatTime(hhmm) {
    var m = /^(\d{1,2}):(\d{2})$/.exec(hhmm || '');
    if (!m) return null;
    var h = +m[1], ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return (h < 10 ? '0' : '') + h + ':' + m[2] + ' ' + ampm + ' IST';
  }
  var settings = window.SITE_SETTINGS || {};
  var formatters = { webinarDate: formatDate, webinarTime: formatTime };
  document.querySelectorAll('[data-setting]').forEach(function (el) {
    var key = el.getAttribute('data-setting');
    var text = formatters[key] ? formatters[key](settings[key]) : null;
    if (text) el.textContent = text;   // otherwise keep the text already in the HTML
  });

  // ---- 2. Tick-box cards ----
  document.querySelectorAll('.check').forEach(function (item) {
    item.addEventListener('click', function () {
      var on = item.classList.toggle('is-checked');
      item.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); item.click(); }
    });
  });

  // ---- 3. Lightbox ----
  var lightbox = null;
  function closeLightbox() { if (lightbox) lightbox.classList.remove('is-open'); }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLightbox(); });
  document.querySelectorAll('[data-lightbox]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = '<img alt="">';
        lightbox.addEventListener('click', closeLightbox);
        document.body.appendChild(lightbox);
      }
      lightbox.querySelector('img').src = link.getAttribute('href');
      lightbox.classList.add('is-open');
    });
  });
})();
