import { BRAND_ICONS } from './brandIcons';

const PATHS = {
  mic: (
    <>
      <rect x="9" y="2.5" width="6" height="11.5" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21.5M8.5 21.5h7M9 6.5h2M9 9.5h2" />
    </>
  ),
  laptop: (
    <>
      <rect x="4" y="4.5" width="16" height="11" rx="1.5" />
      <path d="M2 19.5h20M7 11l1.5-3 1.5 5 1.5-6 1.5 7 1.5-4 1.5 2h1.5" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 17.5h6M10 21h4M12 2.5a6.5 6.5 0 0 0-3.9 11.7c.6.5.9 1.2.9 2V17h6v-.8c0-.8.3-1.5.9-2A6.5 6.5 0 0 0 12 2.5Z" />
    </>
  ),
  wave: <path d="M2 12h2M6 8v8M10 4v16M14 7v10M18 10v4M22 12h-2" />,
  clef: <path d="M12.5 21.5c1.8 0 3-1 3-2.6 0-1.2-.6-6.4-1.6-12.4-.4-2.4.5-4 1.6-4s1.8 1.4 1.1 3.4c-1.2 3.4-6.6 5.2-6.6 9.6a3.6 3.6 0 0 0 3.6 3.6c2.1 0 3.4-1.3 3.4-3s-1.3-2.9-3-2.9c-1.5 0-2.5 1-2.5 2.2" />,
  play: <path d="M7 4.5v15l13-7.5-13-7.5Z" fill="currentColor" stroke="none" />,
  arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
  arrowUp: <path d="M7 17 17 7M9 7h8v8" />,
  left: <path d="M15 5l-7 7 7 7" />,
  right: <path d="M9 5l7 7-7 7" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  list: <path d="M4 6h16M4 12h16M4 18h16" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21.5s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5 12 13l8.5-6.5" />
    </>
  ),
  chat: <path d="M4 19.5 5.3 16A8 8 0 1 1 8 18.8L4 19.5Z" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="4" />
      <path d="M10 9v6l5-3-5-3Z" fill="currentColor" />
    </>
  ),
  spotify: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M7 9.5c3.5-1 7.5-.6 10.5 1M7.5 12.8c2.8-.7 6-.4 8.5.9M8 15.8c2.2-.5 4.6-.3 6.5.7" />
    </>
  ),
  headphones: (
    <>
      <path d="M3.5 17v-4a8.5 8.5 0 0 1 17 0v4" />
      <rect x="3" y="14" width="4.5" height="6.5" rx="1.5" />
      <rect x="16.5" y="14" width="4.5" height="6.5" rx="1.5" />
    </>
  ),
  pause: <path d="M7.5 4.5h3v15h-3zM13.5 4.5h3v15h-3z" fill="currentColor" stroke="none" />,
  skipNext: <path d="M5 5.5v13l9.5-6.5L5 5.5ZM18.5 5.5v13" />,
  skipPrev: <path d="M19 5.5v13L9.5 12 19 5.5ZM5.5 5.5v13" />,
  disc: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 5.5a6.5 6.5 0 0 1 6.5 6.5" />
    </>
  ),
  volume: <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />,
  volumeOff: <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM16 9.5l5 5M21 9.5l-5 5" />,
  sliders: <path d="M6 3.5v17M12 3.5v17M18 3.5v17M3.5 15h5M9.5 8h5M15.5 13h5" />,
  radio: (
    <>
      <rect x="3" y="8" width="18" height="12.5" rx="2" />
      <circle cx="15.5" cy="14.2" r="3" />
      <path d="M7 3.5l9 4.5M6.5 12.5h3M6.5 16h3" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
};

export function BrandIcon({ name, size = 20, className }) {
  const icon = BRAND_ICONS[name];
  if (!icon) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}

export function Icon({ name, size = 20, strokeWidth = 1.6, className, title }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name]}
    </svg>
  );
}
