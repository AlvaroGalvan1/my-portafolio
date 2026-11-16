// The page the QR code on the printed cards opens. Phone-only, English-only:
// it is the card's front side, nothing else.
//
// It is a route handler returning HTML rather than a page.tsx because every
// page here lives under [lang], whose layout owns <html> — a page outside it
// would need its own root layout and a restructure of the app. This one
// screen needs neither the site's nav nor its fonts.
//
// Everything is on one phone screen and nothing links to the rest of the
// site: the call to action is Text / Call. On load the script sends the phone to /alvaro.vcf, which opens the
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
*{box-sizing:border-box}
body{margin:0;background:#f5821f;color:#7a1710;font-family:ui-monospace,Menlo,monospace;min-height:100dvh}
main{padding:22px 20px 18px;max-width:480px;margin:0 auto;min-height:100dvh;display:flex;flex-direction:column}
h1{font-size:20px;margin:0 0 12px}
p,li{font-size:14px;line-height:1.45;margin:0 0 9px}
ul{margin:0 0 9px;padding-left:18px;list-style:"- "}
.cta{margin-top:auto;padding-top:10px}
.row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.btn{display:block;text-align:center;background:#7a1710;color:#fff4de;padding:15px 8px;font-weight:700;font-size:17px;border-radius:10px;text-decoration:none}
.btn.s{background:transparent;color:#7a1710;border:2px solid #7a1710;font-size:14px;padding:11px 8px;margin-top:10px}
.tel{text-align:center;font-weight:700;font-size:18px;margin:0 0 10px}
</style>
</head>
<body>
<main>
<h1>hi, I'm Álvaro from Oaxaca</h1>
<p>I just moved to the Mission and I'm looking for work :)</p>
<p>I studied Computer Science (just graduated). I've been a:</p>
<ul><li>Waiter</li><li>Tutor (SAT/Spanish)</li><li>Front desk</li><li>Web designer</li></ul>
<p>I'm hardworking, proactive, and responsible.</p>
<p>If you think I can help you with something, let's chat. I'm open to temporary positions or side gigs.</p>
<div class="cta">
<div class="tel">(415) 825-7580</div>
<div class="row"><a class="btn" href="sms:+14158257580">Text me</a><a class="btn" href="tel:+14158257580">Call me</a></div>
<a class="btn s" href="${CONTACT_FILE}">Save my contact</a>
</div>
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
