import { useEffect, useRef, useState } from 'react';
import { STEPS } from './data/editorialData.js';

export function CoffeeJourney({ storyRef, activeStepIndex = 0, onStepSelect }) {
  const hostRef = useRef(null);
  const overrideProgressRef = useRef(null);
  const invalidateRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false;
    let controller;
    let frame = 0;
    let visible = false;
    let loading = false;
    let contextLost = false;

    const render = () => {
      frame = 0;
      if (disposed || !visible || contextLost || preference.matches || !controller) return;
      let progress;
      if (overrideProgressRef.current !== null) {
        progress = overrideProgressRef.current;
      } else {
        const rect = storyRef.current.getBoundingClientRect();
        const distance = Math.max(1, rect.height - window.innerHeight * 0.45);
        progress = Math.min(1, Math.max(0, (window.innerHeight * 0.3 - rect.top) / distance));
      }
      controller.update(progress);
    };

    const invalidate = () => {
      if (!frame && !disposed && visible && !contextLost && !preference.matches) {
        frame = requestAnimationFrame(render);
      }
    };
    invalidateRef.current = invalidate;

    const onScroll = () => {
      overrideProgressRef.current = null;
      invalidate();
    };

    const load = async () => {
      if (loading || controller || disposed || preference.matches) return;
      loading = true;
      try {
        const { mountCoffeeScene } = await import('./coffee-scene.js');
        if (disposed || preference.matches) return;
        const next = await mountCoffeeScene(host, {
          onContextLost: () => {
            if (!disposed) {
              setReady(false);
              contextLost = true;
            }
          },
        });
        if (disposed || preference.matches) {
          next.dispose();
          return;
        }
        controller = next;
        setReady(true);
        invalidate();
      } catch {
        // Keep the Blender poster render if WebGL is unavailable.
        if (!disposed) setReady(false);
      } finally {
        loading = false;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (visible) {
          load();
          invalidate();
        }
      },
      { rootMargin: '160px' },
    );
    observer.observe(host);

    const resize = new ResizeObserver(() => {
      controller?.resize();
      invalidate();
    });
    resize.observe(host);

    const onPreference = () => {
      if (preference.matches) {
        cancelAnimationFrame(frame);
        frame = 0;
        controller?.dispose();
        controller = undefined;
        contextLost = false;
        setReady(false);
      } else if (visible) {
        load();
      }
    };
    preference.addEventListener('change', onPreference);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      preference.removeEventListener('change', onPreference);
      window.removeEventListener('scroll', onScroll);
      invalidateRef.current = null;
      controller?.dispose();
    };
  }, [storyRef]);

  function previewStepAngle(index) {
    const target = STEPS[index];
    if (!target) return;
    overrideProgressRef.current = target.progress;
    invalidateRef.current?.();
    onStepSelect?.(index);
  }

  return (
    <div className="coffee-stage">
      <div className={`coffee-frame ${ready ? 'is-ready' : ''}`}>
        <img
          className="coffee-poster"
          src="/assets/coffee-poster.png"
          width="900"
          height="1000"
          alt="Copo de café verde, com faixa ocre e tampa clara."
          loading="lazy"
        />
        <div ref={hostRef} className="coffee-canvas" aria-hidden="true" />
      </div>

      <p className="coffee-caption">Boas ideias pedem uma pausa.</p>

      <div className="coffee-controls-stack">
        <div className="coffee-step-pills" role="group" aria-label="Etapas da pausa">
          {STEPS.map((step, index) => (
            <button
              key={step.id}
              type="button"
              className={`coffee-step-pill ${activeStepIndex === index ? 'is-active' : ''}`}
              aria-pressed={activeStepIndex === index}
              onClick={() => previewStepAngle(index)}
            >
              <span className="coffee-pill-num">{step.number}</span>
              <span>{step.label}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
