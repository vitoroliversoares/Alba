(() => {
  const root = document.documentElement;
  const MINIMUM_MS = 1000;
  const EXIT_MS = 240;
  let cycle = 0;
  let minimumTimer;
  let exitTimer;
  let safetyTimer;

  function clearTimers() {
    clearTimeout(minimumTimer);
    clearTimeout(exitTimer);
    clearTimeout(safetyTimer);
  }

  function finish() {
    cycle += 1;
    clearTimers();
    root.classList.remove('support-is-loading');
    const content = document.getElementById('support-page-content');
    if (content) {
      content.inert = false;
      content.removeAttribute('aria-hidden');
    }
    document.getElementById('support-page-loader')?.setAttribute('hidden', '');
    const heading = document.getElementById('coffee-title');
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }

  function begin() {
    clearTimers();
    const currentCycle = ++cycle;
    const startedAt = performance.now();
    const loader = document.getElementById('support-page-loader');
    const content = document.getElementById('support-page-content');
    if (!loader || !content) return finish();
    root.classList.add('support-is-loading');
    loader.removeAttribute('hidden');
    loader.classList.remove('is-exiting');
    content.inert = true;
    content.setAttribute('aria-hidden', 'true');
    safetyTimer = setTimeout(finish, 5000);

    // The financial link is configured independently; never wait for it here.
    const image = content.querySelector('.coffee-cup-art');
    const imageReady = image?.decode ? image.decode().catch(() => {}) : Promise.resolve();
    imageReady.then(() => {
      if (currentCycle !== cycle) return;
      minimumTimer = setTimeout(() => {
        loader.classList.add('is-exiting');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        exitTimer = setTimeout(finish, reducedMotion ? 0 : EXIT_MS);
      }, Math.max(0, MINIMUM_MS - (performance.now() - startedAt)));
    });
  }

  // If JS cannot load, this class is never added and the HTML stays usable.
  root.classList.add('support-is-loading');
  safetyTimer = setTimeout(finish, 5000);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', begin, { once: true });
  } else {
    begin();
  }
  window.addEventListener('pageshow', event => {
    if (event.persisted) begin();
  });
})();
