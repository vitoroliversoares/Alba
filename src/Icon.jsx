const ALIASES = {
  'bookmark-simple': 'bookmark',
  'magnifying-glass': 'search',
  'list': 'menu',
  'funnel-simple': 'filter',
  'arrow-up-right': 'open-new-window',
  'x': 'xmark',
  'book-open': 'book',
  'headphones': 'headset',
  'info': 'info-circle'
};

export function Icon({ name, size = 22 }) {
  const asset = ALIASES[name] || name;
  return <span className="icon" aria-hidden="true" style={{
    '--icon-url': `url("/assets/icons/iconoir/${asset}.svg")`,
    width: size,
    height: size
  }} />;
}
