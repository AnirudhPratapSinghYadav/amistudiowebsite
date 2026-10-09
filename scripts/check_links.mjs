// Every outbound link the site renders must be https and on an allow-listed host.
// Run:  node scripts/check_links.mjs          (static checks, fails the process on any problem)
//       node scripts/check_links.mjs --live   (also requests each URL and prints the status)
import ID from '../src/config/identity.json' with { type: 'json' };
import MUSIC from '../src/content/releases.json' with { type: 'json' };

const ALLOWED = [
  'open.spotify.com',
  'music.apple.com',
  'www.youtube.com',
  'youtu.be',
  'music.youtube.com',
  'tidal.com',
  'soundcloud.com',
  'www.instagram.com',
  'linktr.ee',
  'wa.me',
  'www.google.com',
];

const links = [
  ...ID.socials.map((s) => [`social ${s.id}`, s.href]),
  ...MUSIC.releases.flatMap((r) => Object.entries(r.links).map(([k, v]) => [`${r.id} ${k}`, v])),
  ['whatsapp', `https://wa.me/${ID.contact.whatsapp}`],
];

let bad = 0;
for (const [label, href] of links) {
  let problem = '';
  try {
    const u = new URL(href);
    if (u.protocol !== 'https:') problem = 'not https';
    else if (!ALLOWED.includes(u.hostname)) problem = `host not allowed: ${u.hostname}`;
    else if (/[?&](si|utm_[a-z]+|igsh|fbclid)=/.test(u.search)) problem = 'tracking parameter left in';
  } catch {
    problem = 'not a valid URL';
  }
  if (problem) {
    bad += 1;
    console.log(`FAIL ${label}: ${problem} (${href})`);
  }
}
if (!/^\d{10,15}$/.test(ID.contact.whatsapp)) {
  bad += 1;
  console.log('FAIL whatsapp number must be digits only, with country code');
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ID.contact.email)) {
  bad += 1;
  console.log('FAIL email looks wrong');
}
console.log(`${links.length} links checked, ${bad} problems`);

if (process.argv.includes('--live')) {
  const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36' };
  for (const [label, href] of links) {
    try {
      const res = await fetch(href, { headers: UA, redirect: 'follow', signal: AbortSignal.timeout(20000) });
      console.log(`${res.status} ${label} -> ${res.url}`);
    } catch (e) {
      console.log(`ERR ${label}: ${e.message}`);
    }
  }
}
process.exit(bad ? 1 : 0);
