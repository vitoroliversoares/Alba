import { useCallback, useEffect, useRef, useState } from 'react';
import { App } from '../App.jsx';
import { LoadingScreen } from './LoadingScreen.jsx';

const MINIMUM_MS = 1000;
const EXIT_MS = 240;

export function LoadingExperience() {
  const [pending, setPending] = useState(true);
  const [phase, setPhase] = useState('loading');
  const [cycle, setCycle] = useState(0);
  const contentRef = useRef(null);
  const startedAt = useRef(performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? performance.now());
  const pendingRef = useRef(true);
  const phaseRef = useRef('loading');

  const begin = useCallback(() => {
    if (pendingRef.current && phaseRef.current === 'loading') return;
    startedAt.current = performance.now();
    pendingRef.current = true;
    phaseRef.current = 'loading';
    setPending(true);
    setPhase('loading');
    setCycle(value => value + 1);
  }, []);

  const ready = useCallback(() => {
    pendingRef.current = false;
    setPending(false);
  }, []);

  useEffect(() => {
    if (pending || phase !== 'loading') return;
    const remaining = Math.max(0, MINIMUM_MS - (performance.now() - startedAt.current));
    const timer = setTimeout(() => {
      phaseRef.current = 'exiting';
      setPhase('exiting');
    }, remaining);
    return () => clearTimeout(timer);
  }, [pending, phase, cycle]);

  useEffect(() => {
    if (phase !== 'exiting') return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(() => {
      phaseRef.current = 'hidden';
      setPhase('hidden');
    }, reducedMotion ? 0 : EXIT_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'hidden' || cycle === 0) return;
    const heading = contentRef.current?.querySelector('main h1');
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }, [phase, cycle]);

  const visible = phase !== 'hidden';
  return (
    <>
      <div ref={contentRef} className="brand-loading-view" inert={visible} aria-hidden={visible ? 'true' : undefined}>
        <App onViewPending={begin} onViewReady={ready} />
      </div>
      {visible && <LoadingScreen key={cycle} exiting={phase === 'exiting'} />}
    </>
  );
}
