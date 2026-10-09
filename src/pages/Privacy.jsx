import { BRAND } from '../config/brand';
import { usePageMeta } from '../lib/usePageMeta';
import { PageHero } from '../components/ui';

export default function Privacy() {
  usePageMeta('/privacy');
  return (
    <>
      <PageHero short crumb="Privacy" kicker="Privacy" title={<>Plain <em>and</em> short.</>} />
      <section className="section section--tight">
        <div className="wrap prose" data-todo="Confirm the business name and contact for privacy requests.">
          <h2>What we collect</h2>
          <p>
            Only what you choose to send. The booking form does not store anything on this site. When you press send, it opens WhatsApp or your email app with your request written out: your name, how to reply to you, the service, the genre, your message, an optional reference link and an optional date. Nothing leaves your device until you press send there.
          </p>
          <h2>Why</h2>
          <p>To reply to you about your session. That is the only use.</p>
          <h2>Where it goes</h2>
          <p>
            To {BRAND.producer} on WhatsApp ({BRAND.contact.whatsappDisplay}) or by email ({BRAND.contact.email}). Those apps have their own privacy terms.
          </p>
          <h2>What we do not do</h2>
          <p>
            No tracking cookies, no analytics scripts, no advertising pixels, no selling or sharing your details. Music previews and the beat play from this site, not from a third-party player. The prep checklist and the one-minute send limit are saved on your own device and never sent to us.
          </p>
          <h2>Links out</h2>
          <p>Instagram, Spotify, Apple Music, YouTube, YouTube Music, TIDAL, SoundCloud, Linktree, WhatsApp and Google Maps links open those services in a new tab. Nothing loads from them until you click.</p>
          <h2>How long we keep it</h2>
          <p>Only as long as we need it to arrange and run your session. Ask us to delete it at any time.</p>
          <h2>Questions</h2>
          <p>
            Message {BRAND.contact.whatsappDisplay} on WhatsApp or email {BRAND.contact.email}.
          </p>
        </div>
      </section>
    </>
  );
}
