/* resilientwithkanti.com — small page behaviours
   1. Registration popup (any element with data-open-form opens it)
   2. Form submit -> Pabbly webhook -> Thank You page
   3. Tick-box cards in "Then this Masterclass was built for you"
   4. Photo lightbox (links with data-lightbox)
   5. Webinar date/time from settings.js
*/
(function () {
  // ---- Settings you may want to change ----
  var WEBHOOK_URL = 'https://connect.pabbly.com/webhook-listener/webhook/IjU3NjMwNTZjMDYzZjA0MzAi_pc/IjU3NjcwNTZiMDYzNTA0MzQ1MjY1NTUzMjUxMzAi_pc';
  var THANK_YOU_PAGE = '../thank-you/';
  var FORM_NAME = 'Masterclass Registation';

  // When the file is opened by double-click (file://), folders don't open
  // their index.html automatically, so add it.
  function pageUrl(path) {
    return location.protocol === 'file:' ? path + 'index.html' : path;
  }

  // ---- 5. Webinar date / time (from settings.js) ----
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

  // ---- 1. Popup ----
  var modal = document.getElementById('register');
  function openModal(e) {
    if (e) e.preventDefault();
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var first = modal.querySelector('input');
    if (first) setTimeout(function () { first.focus(); }, 50);
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-open-form]').forEach(function (el) {
    el.addEventListener('click', openModal);
  });
  if (modal) {
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    modal.querySelector('.modal__close').addEventListener('click', closeModal);
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModal(); closeLightbox(); }
  });

  // ---- 2. Form submit ----
  var form = document.getElementById('reg-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      btn.textContent = 'Saving...';

      var v = function (name) { return form.elements[name].value.trim(); };
      var now = new Date();
      var data = new URLSearchParams();
      // Same field names the old WordPress form sent, so Pabbly keeps working.
      data.append('Name', v('name'));
      data.append('Email', v('email'));
      data.append('Phone', v('phone'));
      data.append('Phone ', v('phone'));
      data.append('What is the one thing you keep putting off?', v('putting_off'));
      data.append('Date', now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
      data.append('Time', now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
      data.append('Page URL', location.href);
      data.append('User Agent', navigator.userAgent);
      data.append('form_name', FORM_NAME);

      var done = false;
      var go = function () {
        if (done) return;
        done = true;
        location.href = pageUrl(THANK_YOU_PAGE);
      };
      fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        keepalive: true,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString()
      }).then(go, go);
      setTimeout(go, 4000);
    });
  }

  // ---- 3. Tick-box cards ----
  document.querySelectorAll('.check').forEach(function (item) {
    item.addEventListener('click', function () {
      var on = item.classList.toggle('is-checked');
      item.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); item.click(); }
    });
  });

  // ---- 4. Lightbox ----
  var lightbox = null;
  function closeLightbox() { if (lightbox) lightbox.classList.remove('is-open'); }
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
