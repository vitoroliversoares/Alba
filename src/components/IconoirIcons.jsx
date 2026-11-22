// Iconoir-aesthetic SVG icons (24x24 grid, 1.5px stroke, round linecap & linejoin)
// Zero external CDN calls — crisp inline vectors inheriting currentColor.

const ICON_PATHS = {
  'open-book': (
    <>
      <path d="M12 21V7a2 2 0 0 1 2-2h7.4a.6.6 0 0 1 .6.6v13.114" />
      <path d="M12 21V7a2 2 0 0 0-2-2H2.6a.6.6 0 0 0-.6.6v13.114" />
      <path d="M14 19h8" />
      <path d="M10 19H2" />
      <path d="M12 21a2 2 0 0 1 2-2" />
      <path d="M12 21a2 2 0 0 0-2-2" />
    </>
  ),
  palette: (
    <>
      <path d="M12 21a9 9 0 1 1 0-18c4.97 0 9 3.582 9 8 0 1.06-.474 2.078-1.318 2.828-.844.75-1.989 1.172-3.182 1.172h-2.5a2 2 0 0 0-1 3.75 1.3 1.3 0 0 1-1 2.25Z" />
      <circle cx="8.5" cy="10.5" r=".75" fill="currentColor" stroke="none" />
      <circle cx="12.5" cy="7.5" r=".75" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="10.5" r=".75" fill="currentColor" stroke="none" />
      <circle cx="7.5" cy="14.5" r=".75" fill="currentColor" stroke="none" />
    </>
  ),
  'coffee-cup': (
    <>
      <path d="M17 11.6V15a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6v-3.4a.6.6 0 0 1 .6-.6h12.8a.6.6 0 0 1 .6.6Z" />
      <path d="M12 9c0-1 .714-2 2.143-2v0A2.857 2.857 0 0 0 17 4.143V3.5" />
      <path d="M8 9v-.5a3 3 0 0 1 3-3v0a2 2 0 0 0 2-2V3" />
      <path d="M16 11h2.5a2.5 2.5 0 0 1 0 5H17" />
    </>
  ),
  headphones: (
    <>
      <path d="M3 16v-4a9 9 0 0 1 18 0v4" />
      <path d="M3 14h2.4a1.6 1.6 0 0 1 1.6 1.6v2.8A1.6 1.6 0 0 1 5.4 20H4.5A1.5 1.5 0 0 1 3 18.5V14Z" />
      <path d="M21 14h-2.4a1.6 1.6 0 0 0-1.6 1.6v2.8a1.6 1.6 0 0 0 1.6 1.6h.9a1.5 1.5 0 0 0 1.5-1.5V14Z" />
    </>
  ),
  bookmark: (
    <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-5.918-3.805a2 2 0 0 0-2.164 0L5 21Z" />
  ),
  'bookmark-solid': (
    <path
      d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-5.918-3.805a2 2 0 0 0-2.164 0L5 21Z"
      fill="currentColor"
    />
  ),
  search: (
    <>
      <path d="M17 17l4 4" />
      <path d="M3 11a8 8 0 1 0 16 0 8 8 0 0 0-16 0Z" />
    </>
  ),
  'arrow-up-right': (
    <path d="M6 19L19 6m0 0v12.48M19 6H6.52" />
  ),
  'nav-arrow-right': (
    <path d="M9 6l6 6-6 6" />
  ),
  'nav-arrow-left': (
    <path d="M15 6l-6 6 6 6" />
  ),
  'nav-arrow-down': (
    <path d="M6 9l6 6 6-6" />
  ),
  check: (
    <path d="M5 13l4 4L19 7" />
  ),
  'check-circle': (
    <>
      <path d="M7 12.5l3 3 7-7" />
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
    </>
  ),
  xmark: (
    <path d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243" />
  ),
  menu: (
    <>
      <path d="M3 5h18" />
      <path d="M3 12h18" />
      <path d="M3 19h18" />
    </>
  ),
  'shield-check': (
    <>
      <path d="M8.5 11.5l2.5 2.5 4.5-4.5" />
      <path d="M5 18L3.13 4.913a.996.996 0 0 1 .774-1.114l7.662-1.703a2 2 0 0 1 .868 0L20.096 3.8c.51.113.848.596.774 1.114L19 18c-.07.495-.5 3.5-7 3.5S5.07 18.495 5 18Z" />
    </>
  ),
  calendar: (
    <>
      <path d="M15 4V2m0 2v2m0-2h-4.5M3 10v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9H3Z" />
      <path d="M3 10V6a2 2 0 0 1 2-2h2" />
      <path d="M7 2v4" />
      <path d="M21 10V6a2 2 0 0 0-2-2h-.5" />
    </>
  ),
  compass: (
    <>
      <path d="M10.586 10.586L16.95 7.05l-3.536 6.364L7.05 16.95l3.536-6.364Z" />
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
    </>
  ),
  sparks: (
    <>
      <path d="M8 15c4.875 0 7-2.051 7-7 0 4.949 2.11 7 7 7-4.89 0-7 2.11-7 7 0-4.89-2.125-7-7-7Z" />
      <path d="M2 6.5c3.134 0 4.5-1.318 4.5-4.5 0 3.182 1.357 4.5 4.5 4.5-3.143 0-4.5 1.357-4.5 4.5 0-3.143-1.366-4.5-4.5-4.5Z" />
    </>
  ),
  filter: (
    <>
      <path d="M3 6h18" />
      <path d="M7 12h10" />
      <path d="M11 18h2" />
    </>
  ),
  'graduation-cap': (
    <>
      <path d="M2.573 8.463l8.659-4.329a.6.6 0 0 1 .536 0l8.659 4.33a.6.6 0 0 1 0 1.073l-8.659 4.329a.6.6 0 0 1-.536 0L2.573 9.536a.6.6 0 0 1 0-1.073Z" />
      <path d="M22.5 13V9.5l-2-1" />
      <path d="M4.5 10.5v5.412a2 2 0 0 0 1.142 1.807l5 2.374a2 2 0 0 0 1.716 0l5-2.374a2 2 0 0 0 1.142-1.807V10.5" />
    </>
  ),
  pause: (
    <>
      <path d="M6 18.4V5.6a.6.6 0 0 1 .6-.6h2.8a.6.6 0 0 1 .6.6v12.8a.6.6 0 0 1-.6.6H6.6a.6.6 0 0 1-.6-.6Z" />
      <path d="M14 18.4V5.6a.6.6 0 0 1 .6-.6h2.8a.6.6 0 0 1 .6.6v12.8a.6.6 0 0 1-.6.6h-2.8a.6.6 0 0 1-.6-.6Z" />
    </>
  ),
  play: (
    <path d="M6.906 4.537A.6.6 0 0 0 6 5.053v13.894a.6.6 0 0 0 .906.516l11.723-6.947a.6.6 0 0 0 0-1.032L6.906 4.537Z" />
  ),
  eye: (
    <>
      <path d="M3 13c3.6-8 14.4-8 18 0" />
      <path d="M12 17a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
    </>
  ),
  'page-flip': (
    <>
      <path d="M12 11h5" />
      <path d="M12 7h5" />
      <path d="M8 15h9" />
      <path d="M8 19h7" />
      <path d="M5 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a6 6 0 0 1-6 6H7a2 2 0 0 1-2-2Z" />
    </>
  ),
  laptop: (
    <>
      <path d="M3.2 14.222V4a2 2 0 0 1 2-2h13.6a2 2 0 0 1 2 2v10.222m-17.6 0h17.6m-17.6 0l-1.48 5.234A2 2 0 0 0 3.644 22h16.712a2 2 0 0 0 1.924-2.544l-1.48-5.234" />
      <path d="M11 19h2" />
    </>
  ),
  'arrow-left': (
    <path d="M21 12H3m0 0l8.5-8.5M3 12l8.5 8.5" />
  ),
  info: (
    <>
      <path d="M12 11.5v5" />
      <path d="M12 7.51l.01-.011" />
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
    </>
  ),
};

export const ICONOIR_NAMES = Object.keys(ICON_PATHS);

export function Iconoir({
  name,
  size = 20,
  strokeWidth = 1.5,
  className = '',
  ...rest
}) {
  const content = ICON_PATHS[name] || ICON_PATHS['sparks'];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`iconoir-svg ${className}`.trim()}
      {...rest}
    >
      {content}
    </svg>
  );
}
