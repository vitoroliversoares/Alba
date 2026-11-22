import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CoffeeJourney } from './CoffeeJourney.jsx';
import { Iconoir } from './components/IconoirIcons.jsx';
import {
  CampusWorkbench,
  EditorialDossier,
  EditorialFaq,
  OfferAnatomyInspector,
  RoutineBuilder,
  SavedPathsDialog,
  SpotlightSearch,
} from './components/InteractiveSections.jsx';
import { FlowButton } from './components/SpellPrimitives.jsx';
import { AccountDialog } from './components/AccountDialog.jsx';
import {
  SAVED_TOPICS_KEY,
  STEPS,
  TOPICS,
} from './data/editorialData.js';
import './landing.css';
import './interactive-antigravity.css';

const Catalog = lazy(() => import('./Catalog.jsx').then(module => ({ default: module.Catalog })));

function readSavedTopics() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVED_TOPICS_KEY) || '[]');
    return Array.isArray(parsed)
      ? parsed.filter((id) => TOPICS.some((t) => t.id === id))
      : [];
  } catch {
    return [];
  }
}

export function App({ onViewPending, onViewReady } = {}) {
  const [catalogOpen, setCatalogOpen] = useState(
    () => typeof window !== 'undefined' && window.location.hash === '#catalogo',
  );
  useLayoutEffect(() => {
    onViewPending?.();
    if (!catalogOpen) onViewReady?.();
  }, [catalogOpen, onViewPending, onViewReady]);
  const [catalogCategory, setCatalogCategory] = useState('todos');
  const [accountMode, setAccountMode] = useState('signup');
  const [accountUser, setAccountUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [spotlightViaKey, setSpotlightViaKey] = useState(false);
  const [savedTopics, setSavedTopics] = useState(readSavedTopics);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const accountRef = useRef(null);
  const savedDialogRef = useRef(null);
  const storyRef = useRef(null);
  const stepRefs = useRef([]);
  const heroRef = useRef(null);
  const heroBookRef = useRef(null);

  // A small pointer-led drift makes the paper cutout feel loose on the page.
  useEffect(() => {
    if (catalogOpen) return;
    const hero = heroRef.current;
    const book = heroBookRef.current;
    if (!hero || !book) return;
    const motion = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let frame = 0;
    let x = 0;
    let y = 0;

    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      book.style.transform = '';
    };
    const move = (event) => {
      if (!motion.matches || event.pointerType !== 'mouse') return;
      const rect = hero.getBoundingClientRect();
      x = Math.max(-0.5, Math.min(0.5, (event.clientX - rect.left) / Math.max(1, rect.width) - 0.5));
      y = Math.max(-0.5, Math.min(0.5, (event.clientY - rect.top) / Math.max(1, rect.height) - 0.5));
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        book.style.transform = `translate3d(${-x * 4}px, ${-y * 3}px, 0)`;
      });
    };

    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerleave', reset);
    hero.addEventListener('pointercancel', reset);
    motion.addEventListener('change', reset);
    window.addEventListener('blur', reset);
    window.addEventListener('resize', reset);
    return () => {
      reset();
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', reset);
      hero.removeEventListener('pointercancel', reset);
      motion.removeEventListener('change', reset);
      window.removeEventListener('blur', reset);
      window.removeEventListener('resize', reset);
    };
  }, [catalogOpen]);

  // Hash & browser history navigation + deep-link scroll on initial load
  useEffect(() => {
    const scrollToHash = (instant = false) => {
      const hash = window.location.hash;
      if (hash === '#catalogo') {
        setCatalogOpen(true);
        return;
      }
      if (
        ['', '#inicio', '#a-revista', '#possibilidades', '#rotina', '#como-funciona', '#transparencia', '#duvidas'].includes(hash)
      ) {
        setCatalogOpen(false);
        if (hash && hash !== '#inicio') {
          const targetId = hash.slice(1);
          requestAnimationFrame(() => {
            const el = document.getElementById(targetId);
            if (el?.tagName === 'DETAILS') el.open = true;
            if (el) el.scrollIntoView({ behavior: instant || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
          });
        }
      }
    };
    scrollToHash(true);
    const onHash = () => scrollToHash(false);
    window.addEventListener('popstate', onHash);
    window.addEventListener('hashchange', onHash);
    return () => {
      window.removeEventListener('popstate', onHash);
      window.removeEventListener('hashchange', onHash);
    };
  }, []);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === SAVED_TOPICS_KEY) setSavedTopics(readSavedTopics());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(''), 2600);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Global Ctrl+K / Cmd+K shortcut for instant Spotlight
  useEffect(() => {
    if (catalogOpen) return;
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSpotlightViaKey(true);
        setSpotlightOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [catalogOpen]);

  // Follow the native scroll only while the coffee journey is visible.
  useEffect(() => {
    if (catalogOpen) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      let best = 0;
      const focusY = window.innerHeight * 0.42;
      stepRefs.current.forEach((node, idx) => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        if (rect.top <= focusY) best = idx;
      });
      setActiveStepIndex(best);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [catalogOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const onPointer = (event) => {
      if (!event.target.closest?.('.landing-mobile-menu, .landing-menu-toggle')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [menuOpen]);

  function persistSavedTopics(next) {
    setSavedTopics(next);
    try {
      localStorage.setItem(SAVED_TOPICS_KEY, JSON.stringify(next));
      setStorageUnavailable(false);
    } catch {
      setStorageUnavailable(true);
    }
  }

  function toggleTopic(topic) {
    const saved = savedTopics.includes(topic.id);
    const next = saved ? savedTopics.filter((id) => id !== topic.id) : [...savedTopics, topic.id];
    persistSavedTopics(next);
    setToastMessage(`Caminho ${topic.name} ${saved ? 'removido do' : 'guardado no'} caderno.`);
  }

  function saveManyTopics(topics) {
    const merged = [...new Set([...savedTopics, ...topics.map((t) => t.id)])];
    const addedCount = merged.length - savedTopics.length;
    persistSavedTopics(merged);
    setToastMessage(
      addedCount > 0
        ? `${addedCount} ${addedCount === 1 ? 'caminho guardado' : 'caminhos guardados'} no seu caderno.`
        : 'Estes caminhos já estão guardados no seu caderno.',
    );
  }

  function explore(category = 'todos') {
    setCatalogCategory(category);
    setCatalogOpen(true);
    setMenuOpen(false);
    setSpotlightOpen(false);
    window.history.pushState({ view: 'catalog' }, '', '#catalogo');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function home() {
    setCatalogOpen(false);
    window.history.pushState({ view: 'landing' }, '', '#inicio');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function account(mode) {
    setAccountMode(mode);
    setMenuOpen(false);
    accountRef.current.showModal();
  }

  function jumpToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (!el) return;
    if (el.tagName === 'DETAILS') el.open = true;
    el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  }

  function scrollToJourneyStep(index) {
    setActiveStepIndex(index);
    const node = stepRefs.current[index];
    if (node) node.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
  }

  if (catalogOpen) {
    return (
      <>
        <Suspense fallback={null}>
          <Catalog initialCategory={catalogCategory} onBack={home} onReady={onViewReady} onAccount={() => account('login')} hasAccount={Boolean(accountUser)} />
        </Suspense>
        <AccountDialog dialogRef={accountRef} mode={accountMode} onModeChange={setAccountMode} onUserChange={setAccountUser} onExplore={() => explore(catalogCategory)} />
      </>
    );
  }

  return (
    <>
      <a className="skip-link" href="#a-revista">
        Pular para a apresentação
      </a>

      <div className="presentation" id="inicio">
        <header className="presentation-masthead is-sticky-bar">
          <a className="brand" href="#inicio" aria-label="Alba — início">
            <span className="brand-name">Alba</span>
            <span className="presentation-brand-note">Hub de Benefícios Estudantis</span>
          </a>

          <nav className="presentation-nav" aria-label="Navegação principal">
            <a href="#a-revista">A Alba</a>
            <a href="#possibilidades">Possibilidades</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#transparencia">Transparência</a>
          </nav>

          <div className="masthead-interactive-tools">
            <button
              type="button"
              className="spotlight-trigger"
              aria-label="Abrir navegação rápida na Alba (Ctrl K)"
              onClick={() => {
                setSpotlightViaKey(false);
                setSpotlightOpen(true);
              }}
            >
              <Iconoir name="search" size={16} />
            </button>

            <button
              type="button"
              className={`saved-pill-trigger ${savedTopics.length > 0 ? 'has-items' : ''}`}
              aria-label={`Abrir meus caminhos salvos, ${savedTopics.length} itens`}
              onClick={() => savedDialogRef.current.showModal()}
            >
              <Iconoir name={savedTopics.length > 0 ? 'bookmark-solid' : 'bookmark'} size={17} />
              <span className="saved-pill-label">Salvos</span>
              {savedTopics.length > 0 && <span className="saved-pill-count">{savedTopics.length}</span>}
            </button>
          </div>

          <div className="account-actions">
            <a href="/apoie.html" className="support-header-link"><Iconoir name="coffee-cup" size={16} /><span>Apoie</span></a>
            <button type="button" className="login-link" onClick={() => account('login')}>
              {accountUser ? 'Minha conta' : 'Entrar'}
            </button>
          </div>

          <button
            type="button"
            className="icon-button landing-menu-toggle"
            aria-label="Abrir navegação"
            aria-expanded={menuOpen}
            aria-controls="landing-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Iconoir name={menuOpen ? 'xmark' : 'menu'} size={22} />
          </button>

          {menuOpen && (
            <nav className="landing-mobile-menu" id="landing-menu" aria-label="Seções da Alba">
              <a href="#a-revista" onClick={() => setMenuOpen(false)}>
                A Alba
              </a>
              <a href="#possibilidades" onClick={() => setMenuOpen(false)}>
                Possibilidades
              </a>
              <a href="#rotina" onClick={() => setMenuOpen(false)}>
                Sua rotina
              </a>
              <a href="#como-funciona" onClick={() => setMenuOpen(false)}>
                Como funciona
              </a>
              <a href="#transparencia" onClick={() => setMenuOpen(false)}>
                Transparência
              </a>
              <a href="#duvidas" onClick={() => setMenuOpen(false)}>
                Dúvidas
              </a>
              <button type="button" onClick={() => account('login')}>Entrar</button>
            </nav>
          )}

        </header>

        <main>
          <section
            ref={heroRef}
            className="product-hero"
            aria-labelledby="product-title"
          >
            <div className="product-hero-copy">
              <p className="eyebrow">Um guia para a vida universitária</p>
              <h1 id="product-title">
                <span>Boas descobertas</span>
                <span>para a vida estudantil.</span>
              </h1>
              <p className="product-hero-description">
                Cursos, ferramentas e benefícios digitais para estudar,
                criar e cuidar da rotina. Reunidos em um só lugar.
              </p>
              <div className="product-hero-actions">
                <FlowButton variant="primary" onClick={() => explore()}>
                  Explorar benefícios
                </FlowButton>
                <a className="hero-secondary-link" href="#a-revista">
                  Conheça a Alba <span aria-hidden="true">↓</span>
                </a>
              </div>
              <p className="hero-footnote">Pode entrar. O catálogo é aberto, sem cadastro.</p>
            </div>

            <div className="hero-illustration">
              <img
                ref={heroBookRef}
                className="landing-book"
                src="/assets/sol-e-livro-cutout.png"
                alt="Livro aberto diante de um sol, em colagem de papel."
                width="1672"
                height="941"
                fetchPriority="high"
              />
            </div>
          </section>

          <EditorialDossier />

          <CampusWorkbench
            savedTopics={savedTopics}
            onToggleTopic={toggleTopic}
            onExplore={explore}
          />

          <RoutineBuilder savedTopics={savedTopics} onSaveManyTopics={saveManyTopics} onExplore={explore} />

          <section
            className="coffee-journey section-padding"
            id="como-funciona"
            aria-labelledby="journey-title"
          >
            <div className="section-heading journey-heading">
              <div>
                <p className="eyebrow">Como funciona</p>
                <h2 id="journey-title">
                  Entre uma aula e um café,
                  <br />
                  encontre seu próximo achado.
                </h2>
              </div>
            </div>

            <div className="journey-layout" ref={storyRef}>
              <div className="journey-steps">
                {STEPS.map((step, index) => {
                  const isActive = activeStepIndex === index;
                  return (
                    <article
                      className={`journey-step ${isActive ? 'is-active' : ''}`}
                      key={step.id}
                      ref={(el) => {
                        stepRefs.current[index] = el;
                      }}
                    >
                      <button
                        type="button"
                        className="step-label-btn"
                        onClick={() => scrollToJourneyStep(index)}
                      >
                        <span className="step-label">
                          <Iconoir name={step.icon} size={15} />
                          <span>
                            {step.number} · {step.label}
                          </span>
                        </span>
                      </button>
                      <h3>{step.title}</h3>
                      <p>{step.text}</p>
                    </article>
                  );
                })}
              </div>

              <CoffeeJourney
                storyRef={storyRef}
                activeStepIndex={activeStepIndex}
                onStepSelect={scrollToJourneyStep}
              />
            </div>
          </section>

          <OfferAnatomyInspector />

          <EditorialFaq />

          <section className="join-revista" aria-labelledby="join-title">
            <p className="eyebrow">Leve para o seu semestre</p>
            <h2 id="join-title">
              Tem coisa boa esperando por você.
            </h2>
            <p>
              Comece por uma editoria e veja o que combina com a sua rotina.
            </p>
            <div className="join-actions">
              <FlowButton variant="primary" onClick={() => explore()}>
                Explorar benefícios
              </FlowButton>
              <button
                type="button"
                className="button button-outline"
                onClick={() => account('signup')}
              >
                <span>Criar minha conta</span>
              </button>
            </div>
          </section>
        </main>

        <footer className="presentation-footer">
          <div>
            <a className="brand-name" href="#inicio">
              Alba
            </a>
            <p>Boas descobertas para a vida estudantil.</p>
          </div>
          <nav aria-label="Links do rodapé">
            <a href="#a-revista">A Alba</a>
            <a href="#possibilidades">Possibilidades</a>
            <a href="/quem-somos.html">Quem somos</a>
            <a href="/privacidade.html">Privacidade e LGPD</a>
            <a href="/apoie.html">Apoie a Alba</a>
            <button type="button" onClick={() => explore()}>
              Benefícios
            </button>
            <button type="button" onClick={() => account('login')}>
              {accountUser ? 'Minha conta' : 'Entrar'}
            </button>
          </nav>
          <p className="presentation-demo-note">
            Alba · Fontes e datas de conferência em cada opção do catálogo.
          </p>
        </footer>
      </div>

      <AccountDialog
        dialogRef={accountRef}
        mode={accountMode}
        onModeChange={setAccountMode}
        onUserChange={setAccountUser}
        onExplore={() => explore()}
      />

      <SavedPathsDialog
        dialogRef={savedDialogRef}
        savedTopics={savedTopics}
        storageUnavailable={storageUnavailable}
        onToggleTopic={toggleTopic}
        onExplore={explore}
      />

      <SpotlightSearch
        open={spotlightOpen}
        openedViaKeyboard={spotlightViaKey}
        onClose={() => setSpotlightOpen(false)}
        onExplore={explore}
        onJumpSection={jumpToSection}
        savedTopics={savedTopics}
        onToggleTopic={toggleTopic}
      />

      <div
        className={`toast ${toastMessage ? 'visible' : ''}`}
        role="status"
        aria-live="polite"
      >
        <Iconoir name="check-circle" size={18} />
        <span>{toastMessage}</span>
      </div>
    </>
  );
}
