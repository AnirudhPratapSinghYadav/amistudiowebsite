import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FAQ } from '../content/site';
import { usePageMeta } from '../lib/usePageMeta';
import { Icon } from '../components/Icon';
import { Cta, PageHero } from '../components/ui';
import { WhatsAppButton } from '../components/Visit';
import { MSG } from '../content/messages';

export function FaqList({ items = FAQ, level = 3 }) {
  const [open, setOpen] = useState(0);
  const H = `h${level}`;
  return (
    <div className="faq">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div className="faq__item" key={f.q}>
            <H>
              <button type="button" className="faq__q" aria-expanded={isOpen} aria-controls={`faq-${i}`} id={`faq-q-${i}`} onClick={() => setOpen(isOpen ? -1 : i)}>
                {f.q}
                <span className="faq__icon" aria-hidden="true">
                  <Icon name="plus" size={18} />
                </span>
              </button>
            </H>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={`faq-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className="faq__a"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p>{f.a}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default function Faq() {
  usePageMeta('/faq');
  return (
    <>
      <PageHero
        short
        crumb="FAQ"
        kicker="Questions"
        title={
          <>
            Straight <em>answers.</em>
          </>
        }
        lead="The things artists ask before they book. If yours is not here, send it on WhatsApp."
      >
        <WhatsAppButton className="btn btn--ghost" text={MSG.question}>
          Ask on WhatsApp
        </WhatsAppButton>
      </PageHero>
      <section className="section">
        <div className="wrap">
          <FaqList level={2} />
        </div>
      </section>
      <Cta kicker="Still wondering" title={<>Ask it <em>in the</em> booking form.</>} button="Send the details" />
    </>
  );
}
