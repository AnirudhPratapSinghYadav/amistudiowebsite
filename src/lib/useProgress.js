import { useEffect } from 'react';
import { audio, useAudio } from './audio';

export const fmtTime = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

/* Writes playback progress into `--p` on the element (0 to 1), the time into timeRef and,
   when given, the position into a slider's ARIA value. Runs in rAF without re-rendering React,
   and only while that item is playing. */
export function useProgress(id, ref, timeRef, sliderRef) {
  const s = useAudio();
  const active = s.current === id && s.playing;
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const slider = sliderRef?.current;
    if (!active) {
      el.style.setProperty('--p', '0');
      if (timeRef?.current) timeRef.current.textContent = '0:00';
      slider?.setAttribute('aria-valuenow', '0');
      return undefined;
    }
    let raf = 0;
    let lastSec = -1;
    const tick = () => {
      const { t, d } = audio.progress();
      el.style.setProperty('--p', d ? (t / d).toFixed(4) : '0');
      const sec = Math.floor(t);
      if (sec !== lastSec) {
        if (timeRef?.current) timeRef.current.textContent = fmtTime(t);
        if (slider) {
          slider.setAttribute('aria-valuenow', String(sec));
          slider.setAttribute('aria-valuetext', `${fmtTime(t)} of ${fmtTime(d || 0)}`);
        }
        lastSec = sec;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, ref, timeRef, sliderRef]);
  return active;
}
