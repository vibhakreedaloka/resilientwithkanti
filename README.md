# resilientwithkanti.com

Plain HTML + CSS site, hosted on GitHub Pages.

## Pages
| URL | File |
|---|---|
| `/` | `index.html` – Meet Your Mentor |
| `/lp-new/` | `lp-new/index.html` – masterclass landing page + registration popup |
| `/thank-you/` | `thank-you/index.html` – shown after registering |
| `/admin/` | `admin/index.html` – password-protected date/time editor (not linked anywhere) |
| `/lp/`, `/lp-1/`, `/my-lp/`, `/home/` | old addresses, redirect to `/lp-new/` |

## Changing the masterclass date and time
Open **https://resilientwithkanti.com/admin/**, log in with your password, pick the date and time, Save.
The landing page updates about a minute later.

- The values are stored in `settings.js` (you can also edit that file by hand).
- First visit to `/admin/` asks for a GitHub fine-grained token (this repo only, *Contents: Read and write*) and a password.
  The token is stored encrypted with the password in `admin/key.json`.
- Token expired or password forgotten: click "Forgot password / new token" and set up again with a new token.

## Common edits
- **Text, testimonials, FAQs** – `lp-new/index.html`; each section is marked with a `<!-- ==== ... ==== -->` comment.
- **Colours and fonts** – top of `assets/css/style.css` (`:root`).
- **Pabbly webhook / thank-you page** – top of `assets/js/main.js`.
- **WhatsApp community link** – `thank-you/index.html`.
- **Images** – `assets/img/`.

## Preview on your computer
Double-click any `index.html`, or run `python3 -m http.server 8000` in this folder and open http://localhost:8000/lp-new/.
Note: submitting the form while previewing sends a real entry to Pabbly / the Google Sheet.

## Publish
```
git add -A && git commit -m "Update" && git push
```
