import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Iconoir } from './IconoirIcons.jsx';

// Spell UI-inspired Blur Reveal (crisp GPU entrance, immediate CSS animation for above-the-fold hero)
export function BlurReveal({
  children,
  delay = 0,
  immediate = false,
  as: Tag = 'div',
  className = '',
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(immediate);

  useEffect(() => {
    if (immediate) return;
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [immediate]);

  return (
    <Tag
      ref={ref}
      className={`spell-blur-reveal ${immediate ? 'is-immediate' : visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

// Spell UI-inspired Flow / Rich Button with directional Iconoir arrow slip & tactile press
export function FlowButton({
  children,
  variant = 'primary',
  icon = 'nav-arrow-right',
  as = 'button',
  className = '',
  ...props
}) {
  const Tag = as;
  return (
    <Tag className={`button button-${variant} spell-flow-button ${className}`.trim()} {...props}>
      <span className="spell-flow-label">{children}</span>
      {icon && (
        <span className="spell-flow-icon" aria-hidden="true">
          <Iconoir name={icon} size={17} strokeWidth={1.7} />
        </span>
      )}
    </Tag>
  );
}

// Spell UI-inspired Keyboard Shortcuts keycaps
export function KeycapHint({ keys = ['Ctrl', 'K'] }) {
  return (
    <span className="spell-keycaps" aria-hidden="true">
      {keys.map((key) => (
        <kbd key={key} className="spell-keycap">
          {key}
        </kbd>
      ))}
    </span>
  );
}

// Spell UI-inspired Editorial Marquee with accessible Pause toggle & hover-pause
export function EditorialMarquee({ items }) {
  const [paused, setPaused] = useState(false);
  const trackItems = [...items, ...items];

  return (
    <div className={`spell-marquee ${paused ? 'is-paused' : ''}`} aria-label="Temas e princípios da Alba">
      <div className="spell-marquee-viewport">
        <div className="spell-marquee-track">
          {trackItems.map((item, index) => (
            <span
              className="spell-marquee-chip"
              key={`${item.label}-${index}`}
              aria-hidden={index >= items.length}
            >
              <Iconoir name={item.icon} size={16} />
              <span>{item.label}</span>
              <span className="spell-marquee-dot" aria-hidden="true">·</span>
            </span>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="spell-marquee-toggle"
        aria-pressed={paused}
        aria-label={paused ? 'Retomar faixa editorial' : 'Pausar faixa editorial'}
        onClick={() => setPaused((v) => !v)}
      >
        <Iconoir name={paused ? 'play' : 'pause'} size={14} />
        <span>{paused ? 'Retomar' : 'Pausar'}</span>
      </button>
    </div>
  );
}

// Spell UI-inspired 3D Perspective Book (Editorial linen cover + interactive leaf-through trigger)
export function PerspectiveBook({ open, onToggle, activePageLabel }) {
  return (
    <button
      type="button"
      className={`spell-book-stage ${open ? 'is-open' : ''}`}
      onClick={onToggle}
      aria-expanded={open}
      aria-label={open ? 'Fechar caderno da edição' : 'Folhear caderno da edição'}
    >
      <span className="spell-book-3d" aria-hidden="true">
        <span className="spell-book-pages" />
        <span className="spell-book-back" />
        <span className="spell-book-cover">
          <span className="spell-book-spine" />
          <span className="spell-book-front">
            <span className="spell-book-top">
              <span className="spell-book-issue">Edição 01 · Prévia</span>
              <Iconoir name="open-book" size={18} />
            </span>
            <span className="spell-book-title">
              Caderno
              <br />
              Editorial
            </span>
            <span className="spell-book-band">
              <span>{activePageLabel}</span>
            </span>
            <span className="spell-book-foot">Alba</span>
          </span>
        </span>
      </span>
      <span className="spell-book-cta">
        <Iconoir name="page-flip" size={16} />
        <span>{open ? 'Fechar caderno' : 'Folhear índice (3 págs.)'}</span>
      </span>
    </button>
  );
}

// Spell UI-inspired Animated Checkbox with SVG path-draw check & spring-like tactile feel
export function AnimatedCheckbox({ id, checked, onChange, icon, label, hint }) {
  return (
    <label htmlFor={id} className={`spell-check-card ${checked ? 'is-checked' : ''}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="spell-check-box" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" className="spell-check-svg">
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="spell-check-body">
        <span className="spell-check-title">
          <Iconoir name={icon} size={17} />
          <span>{label}</span>
        </span>
        {hint && <span className="spell-check-hint">{hint}</span>}
      </span>
    </label>
  );
}

// Refero Styles + Emil Kowalski GPU clip-path sliding indicator tabs
export function SegmentedTabs({ items, activeId, onChange, ariaLabel }) {
  const containerRef = useRef(null);
  const tabRefs = useRef({});
  const [clip, setClip] = useState({ left: 0, right: 100, ready: false });

  useLayoutEffect(() => {
    const update = () => {
      const container = containerRef.current;
      const activeNode = tabRefs.current[activeId];
      if (!container || !activeNode) return;
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeNode.getBoundingClientRect();
      if (containerRect.width <= 0) return;
      const left = Math.max(0, ((tabRect.left - containerRect.left) / containerRect.width) * 100);
      const right = Math.max(0, ((containerRect.right - tabRect.right) / containerRect.width) * 100);
      setClip({ left, right, ready: true });
    };
    update();
    const observer = new ResizeObserver(update);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [activeId, items]);

  return (
    <div className="refero-segmented" role="tablist" aria-label={ariaLabel} ref={containerRef}>
      <div className="refero-segmented-base">
        {items.map((item) => {
          const selected = item.id === activeId;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[item.id] = el;
              }}
              type="button"
              role="tab"
              aria-selected={selected}
              className={`refero-segmented-tab ${selected ? 'is-active' : ''}`}
              onClick={() => onChange(item.id)}
            >
              {item.icon && <Iconoir name={item.icon} size={17} />}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      <div
        className={`refero-segmented-overlay ${clip.ready ? 'is-ready' : ''}`}
        aria-hidden="true"
        style={{
          clipPath: `inset(4px ${clip.right}% 4px ${clip.left}% round 7px)`,
        }}
      >
        {items.map((item) => (
          <span key={item.id} className="refero-segmented-tab is-overlay">
            {item.icon && <Iconoir name={item.icon} size={17} />}
            <span>{item.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
