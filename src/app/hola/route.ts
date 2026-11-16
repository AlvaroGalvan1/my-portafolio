// The page the QR code on the printed cards opens. Phone-only, English-only:
// it is the card's front side, nothing else.
//
// It is a route handler returning HTML rather than a page.tsx because every
// page here lives under [lang], whose layout owns <html> — a page outside it
// would need its own root layout and a restructure of the app. This one
// screen needs neither the site's nav nor its fonts.
//
// On load the script sends the phone to /alvaro.vcf, which opens the
// "Add to Contacts" sheet. Some browsers refuse a navigation the visitor
// didn't tap; the Save contact button is the fallback for that case.
//
// To change the destination or the contact, edit CONTACT_FILE or
// public/alvaro.vcf.

const CONTACT_FILE = "/alvaro.vcf";

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#f5821f">
<meta name="robots" content="noindex">
<title>Álvaro from Oaxaca</title>
<style>
body{margin:0;background:#f5821f;color:#7a1710;font-family:ui-monospace,Menlo,monospace;min-height:100vh}
main{padding:36px 22px;max-width:480px;margin:0 auto}
h1{font-size:22px;margin:0 0 18px}
p,li{font-size:15px;line-height:1.6;margin:0 0 12px}
ul{margin:0 0 12px;padding-left:18px;list-style:"- "}
.tel{font-weight:700;font-size:19px;margin:18px 0 22px}
.btn.s{background:transparent;color:#7a1710;border:2px solid #7a1710;margin-top:10px}
.btn{display:block;text-align:center;background:#7a1710;color:#fff4de;padding:15px;font-weight:700;border-radius:10px;text-decoration:none}
.note{font-size:12px;text-align:center;margin-top:10px}
</style>
</head>
<body>
<main>
<h1>hi, I'm Álvaro from Oaxaca</h1>
<p>I just moved to the Mission and I'm looking for work :)</p>
<p>I studied Computer Science (just graduated). I've been a:</p>
<ul><li>Waiter</li><li>Tutor (SAT/Spanish)</li><li>Front desk</li><li>Web designer</li></ul>
<p>I'm hardworking, proactive, and responsible.</p>
<p>If you think I can help you with something, message me. I'm open to temporary positions or side gigs.</p>
<div class="tel">(415) 825-7580</div>
<a class="btn" href="${CONTACT_FILE}">Save contact</a>
<a class="btn s" href="/">Open my site</a>
<div class="note">Contact sheet opens automatically.<br>Didn't? Tap Save contact.</div>
</main>
<script>location.href=${JSON.stringify(CONTACT_FILE)}</script>
</body>
</html>`;

export function GET() {
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      // The destination will change; don't let anything cache it.
      "cache-control": "no-store",
    },
  });
}
