import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FAQ_ITEMS,
  LANDING_SECTIONS,
  MOMENTS_STORAGE_KEY,
  ROUTINE_MOMENTS,
  TOPICS,
} from '../data/editorialData.js';
import { Iconoir } from './IconoirIcons.jsx';
import {
  FlowButton,
  KeycapHint,
} from './SpellPrimitives.jsx';

const normalize = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

function readSavedMoments() {
  try {
    const parsed = JSON.parse(localStorage.getItem(MOMENTS_STORAGE_KEY) || '["provas-tcc"]');
    if (!Array.isArray(parsed)) return ['provas-tcc'];
    const valid = parsed.filter((id) => ROUTINE_MOMENTS.some((m) => m.id === id));
    return valid;
  } catch {
    return ['provas-tcc'];
  }
}

// 1. Instant Editorial Spotlight (Ctrl K / ⌘ K) — navigates presentation chapters, topics & catalog entry
export function SpotlightSearch({
  open,
  openedViaKeyboard,
  onClose,
  onExplore,
  onJumpSection,
  savedTopics,
  onToggleTopic,
}) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveIndex(0);
      return;
    }
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const items = useMemo(() => {
    const q = normalize(query);

    const topicEntries = TOPICS.filter(
      (t) =>
        !q ||
        normalize(`${t.name} ${t.title} ${t.description} ${t.highlights.join(' ')}`).includes(q),
    ).map((t) => ({
      type: 'topic',
      id: `topic-${t.id}`,
      topic: t,
      icon: t.icon,
      title: `Editoria: ${t.name}`,
      subtitle: `${t.title} · abrir no catálogo`,
    }));

    const sectionEntries = LANDING_SECTIONS.filter(
      (s) => !q || normalize(`${s.label} ${s.hint}`).includes(q),
    ).map((s) => ({
      type: 'section',
      id: `section-${s.id}`,
      section: s,
      icon: 'compass',
      title: `${s.number} · ${s.label}`,
      subtitle: s.hint,
    }));

    const catalogShortcut =
      !q || normalize('abrir catalogo beneficios explorar sem cadastro').includes(q)
        ? [
            {
              type: 'catalog',
              id: 'open-catalog',
              icon: 'open-book',
              title: 'Abrir o catálogo de benefícios',
              subtitle: 'Explorar benefícios, buscar e filtrar sem conta',
            },
          ]
        : [];

    return [...topicEntries, ...catalogShortcut, ...sectionEntries];
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((prev) => (items.length ? (prev + 1) % items.length : 0));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((prev) => (items.length ? (prev - 1 + items.length) % items.length : 0));
      } else if (event.key === 'Enter' && items[activeIndex]) {
        event.preventDefault();
        triggerItem(items[activeIndex]);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, items, activeIndex]);

  function triggerItem(entry) {
    onClose();
    if (entry.type === 'topic') {
      onExplore(entry.topic.id);
    } else if (entry.type === 'catalog') {
      onExplore('todos');
    } else if (entry.type === 'section') {
      onJumpSection(entry.section.id);
    }
  }

  if (!open) return null;

  return (
    <div
      className={`spotlight-backdrop ${openedViaKeyboard ? 'is-instant' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Navegação rápida na Alba"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={`spotlight-panel ${openedViaKeyboard ? 'is-instant' : ''}`}>
        <div className="spotlight-input-row">
          <Iconoir name="search" size={20} className="spotlight-search-icon" />
          <label htmlFor="editorial-spotlight-input" className="sr-only">
            Ir para capítulo, editoria ou catálogo
          </label>
          <input
            ref={inputRef}
            id="editorial-spotlight-input"
            type="search"
            placeholder="Ir para uma editoria, capítulo ou abrir o catálogo…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          <button
            type="button"
            className="icon-button spotlight-close"
            aria-label="Fechar busca rápida"
            onClick={onClose}
          >
            <Iconoir name="xmark" size={19} />
          </button>
        </div>

        <div className="spotlight-results" role="listbox" aria-label="Atalhos da Alba">
          {items.length > 0 ? (
            items.map((entry, idx) => {
              const isSelected = idx === activeIndex;
              const isBookmarked =
                entry.type === 'topic' && savedTopics.includes(entry.topic.id);
              return (
                <div
                  key={entry.id}
                  role="option"
                  aria-selected={isSelected}
                  className={`spotlight-item ${isSelected ? 'is-active' : ''}`}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  <button
                    type="button"
                    className="spotlight-item-main"
                    onClick={() => triggerItem(entry)}
                  >
                    <span className="spotlight-item-icon">
                      <Iconoir name={entry.icon} size={18} />
                    </span>
                    <span className="spotlight-item-text">
                      <strong>{entry.title}</strong>
                      <small>{entry.subtitle}</small>
                    </span>
                    <Iconoir name="nav-arrow-right" size={16} className="spotlight-item-arrow" />
                  </button>
                  {entry.type === 'topic' && (
                    <button
                      type="button"
                      className={`spotlight-bookmark ${isBookmarked ? 'is-saved' : ''}`}
                      aria-pressed={isBookmarked}
                      aria-label={`${isBookmarked ? 'Remover' : 'Guardar'} caminho ${entry.topic.name}`}
                      onClick={() => onToggleTopic(entry.topic)}
                    >
                      <Iconoir name={isBookmarked ? 'bookmark-solid' : 'bookmark'} size={17} />
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="spotlight-empty">
              <Iconoir name="search" size={24} />
              <p>Nenhum capítulo ou editoria encontrado para “{query}”.</p>
              <button type="button" className="text-button" onClick={() => setQuery('')}>
                Limpar busca
              </button>
            </div>
          )}
        </div>

        <div className="spotlight-footer">
          <span className="spotlight-hint">
            <KeycapHint keys={['↑', '↓']} /> navegar · <KeycapHint keys={['↵']} /> abrir ·{' '}
            <KeycapHint keys={['Esc']} /> fechar
          </span>
          <span className="spotlight-note">Acesso livre · sem conta</span>
        </div>
      </div>
    </div>
  );
}

// A short editorial introduction keeps the illustrations as the main visual voice.
export function EditorialDossier() {
  return (
    <section className="about-revista" id="a-revista" aria-labelledby="about-title">
      <div>
        <p className="eyebrow">A Alba</p>
        <h2 id="about-title">A vida de estudante<br />vai além da sala de aula.</h2>
      </div>
      <div className="about-revista-copy">
        <p>Tem o trabalho da semana, o projeto pessoal e aquela vontade de aprender algo novo.</p>
        <p>A Alba reúne benefícios digitais para essa fase. Você encontra o que precisa, confere as condições e segue para a página oficial do serviço.</p>
      </div>
    </section>
  );
}

// Three distinct illustrations, one clear entry into each category.
export function CampusWorkbench({ savedTopics, onToggleTopic, onExplore }) {
  return (
    <section className="possibilities section-padding" id="possibilidades" aria-labelledby="possibilities-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Nossas editorias</p>
          <h2 id="possibilities-title">O que você quer descobrir?</h2>
        </div>
        <p>Escolha um assunto.<br />O resto a gente ajuda a encontrar.</p>
      </div>
      <div className="topic-stories">
        {TOPICS.map((topic) => {
          const saved = savedTopics.includes(topic.id);
          return (
            <article className="topic-story" key={topic.id}>
              <button type="button" className="topic-image-button" onClick={() => onExplore(topic.id)} aria-label={`Explorar ${topic.name}`}>
                <img src={`/assets/${topic.image}`} alt={topic.alt} width="1536" height="1024" loading="lazy" />
              </button>
              <div className="topic-heading-row">
                <p className="topic-name"><span className="topic-index">{topic.indexLabel}</span>{topic.name}</p>
                <button type="button" className={`icon-button topic-save ${saved ? 'is-saved' : ''}`} aria-pressed={saved} aria-label={`${saved ? 'Remover' : 'Guardar'} caminho ${topic.name}`} onClick={() => onToggleTopic(topic)}>
                  <Iconoir name={saved ? 'bookmark-solid' : 'bookmark'} size={19} />
                </button>
              </div>
              <h3>{topic.title}</h3>
              <p className="topic-description">{topic.description}</p>
              <button type="button" className="text-button topic-explore" onClick={() => onExplore(topic.id)}>
                Explorar {topic.name.toLowerCase()} <Iconoir name="nav-arrow-right" size={16} />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// 4. An open editorial guide, with choices saved only in this browser.
export function RoutineBuilder({ savedTopics, onSaveManyTopics, onExplore }) {
  const [selectedMoments, setSelectedMoments] = useState(readSavedMoments);

  function chooseMoments(next) {
    setSelectedMoments(next);
    try {
      localStorage.setItem(MOMENTS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // The guide still works in memory when storage is unavailable.
    }
  }

  function toggleMoment(id) {
    chooseMoments(selectedMoments.includes(id)
      ? selectedMoments.filter(item => item !== id)
      : [...selectedMoments, id]);
  }

  const matchedTopics = useMemo(() => {
    const ids = new Set(ROUTINE_MOMENTS
      .filter(moment => selectedMoments.includes(moment.id))
      .flatMap(moment => moment.topics));
    return TOPICS.filter(topic => ids.has(topic.id));
  }, [selectedMoments]);
  const primary = matchedTopics[0];
  const allAlreadySaved = matchedTopics.length > 0 && matchedTopics.every(topic => savedTopics.includes(topic.id));

  return (
    <section className="routine-builder" id="rotina" aria-labelledby="routine-title">
      <header className="routine-heading">
        <div>
          <p className="eyebrow">Um ponto de partida</p>
          <h2 id="routine-title">Não sabe por onde começar?</h2>
        </div>
        <p>Comece pelo que ocupa seus dias. A gente aproxima as editorias que podem acompanhar esse momento.</p>
      </header>
      <div className="routine-layout">
        <fieldset className="routine-choices">
          <legend>O que faz parte do seu semestre?</legend>
          <p className="routine-choice-note" id="routine-choice-note">Pode escolher mais de um.</p>
          {ROUTINE_MOMENTS.map((moment, index) => (
            <label className="routine-choice" key={moment.id}>
              <span className="routine-choice-number" aria-hidden="true">0{index + 1}</span>
              <span className="routine-choice-copy"><strong>{moment.label}</strong><small>{moment.hint}</small></span>
              <input type="checkbox" name="routine-moment" value={moment.id} checked={selectedMoments.includes(moment.id)} onChange={() => toggleMoment(moment.id)} aria-describedby="routine-choice-note" />
            </label>
          ))}
        </fieldset>
        <aside className="routine-suggestion" aria-labelledby="routine-suggestion-title">
          <p className="sr-only" role="status">{matchedTopics.length ? `Editorias sugeridas: ${matchedTopics.map(topic => topic.name).join(', ')}.` : 'Escolha um momento para encontrar uma editoria.'}</p>
          {primary ? (
            <>
              <img className="routine-illustration" src={`/assets/${primary.image}`} width="1536" height="1024" alt={primary.alt} loading="lazy" />
              <div className="routine-suggestion-copy">
                <p className="eyebrow">Seu próximo achado · {primary.name}</p>
                <h3 id="routine-suggestion-title">{primary.title}</h3>
                <p>{primary.description}</p>
                <button type="button" className="text-button routine-explore" onClick={() => onExplore(primary.id)}>Explorar {primary.name.toLowerCase()} <Iconoir name="nav-arrow-right" size={17} /></button>
                {matchedTopics.length > 1 && (
                  <div className="routine-also"><span>Vale passar também por</span>{matchedTopics.slice(1).map(topic => <button type="button" key={topic.id} className="text-button" onClick={() => onExplore(topic.id)}>{topic.name}<Iconoir name="nav-arrow-right" size={14} /></button>)}</div>
                )}
                <button type="button" className="text-button routine-save" disabled={allAlreadySaved} onClick={() => onSaveManyTopics(matchedTopics)}><Iconoir name={allAlreadySaved ? 'bookmark-solid' : 'bookmark'} size={17} />{allAlreadySaved ? 'Editorias guardadas' : 'Guardar estas editorias'}</button>
              </div>
            </>
          ) : (
            <div className="routine-empty">
              <p className="eyebrow">No seu tempo</p>
              <h3 id="routine-suggestion-title">Uma escolha já abre um caminho.</h3>
              <p>Marque o que combina com seus dias ou passeie por todas as descobertas da Alba.</p>
              <button type="button" className="text-button routine-explore" onClick={() => onExplore('todos')}>Explorar todos os benefícios <Iconoir name="nav-arrow-right" size={17} /></button>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

export function OfferAnatomyInspector() {
  return (
    <section className="transparency-section section-padding" id="transparencia" aria-labelledby="transparency-title">
      <div className="transparency-intro">
        <p className="eyebrow">Nosso cuidado com a informação</p>
        <h2 id="transparency-title">Antes do clique,<br />as condições à vista.</h2>
        <p>Um benefício só ajuda quando você sabe se pode aproveitar. É esse cuidado que orienta o catálogo.</p>
      </div>
      <dl className="editorial-standards">
        <div><dt>Para quem é</dt><dd>Requisitos de acesso e disponibilidade no Brasil, sem esconder as restrições.</dd></div>
        <div><dt>Quanto custa</dt><dd>Gratuidade, preço estudantil e condições de renovação apresentados com clareza.</dd></div>
        <div><dt>De onde vem</dt><dd>Página oficial e data da última conferência junto da informação.</dd></div>
      </dl>
    </section>
  );
}

// 6. Editorial FAQ Accordion
export function EditorialFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="faq-section section-padding" id="duvidas" aria-labelledby="faq-title">
      <div className="faq-layout">
        <div className="faq-intro">
          <p className="eyebrow">Dúvidas frequentes</p>
          <h2 id="faq-title">Pode perguntar.</h2>
          <p>
            Como encontrar benefícios, guardar favoritos e cuidar dos seus dados.
          </p>
        </div>

        <div className="faq-list">
          {FAQ_ITEMS.map((item, idx) => {
            const expanded = openIndex === idx;
            return (
              <div className={`faq-item ${expanded ? 'is-open' : ''}`} key={item.question}>
                <h3>
                  <button
                    type="button"
                    className="faq-trigger"
                    aria-expanded={expanded}
                    aria-controls={`faq-panel-${idx}`}
                    id={`faq-trigger-${idx}`}
                    onClick={() => setOpenIndex(expanded ? -1 : idx)}
                  >
                    <span>{item.question}</span>
                    <span className="faq-chevron" aria-hidden="true">
                      <Iconoir name="nav-arrow-down" size={19} />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-panel-${idx}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${idx}`}
                  className="faq-panel"
                  hidden={!expanded}
                >
                  <p>{item.answer}</p>
                  {item.keyboardTip && <p className="faq-keyboard-tip">{item.keyboardTip}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 7. Saved Editorial Paths Dialog (landing topics saved locally, separate from catalog favorites)
export function SavedPathsDialog({
  dialogRef,
  savedTopics,
  storageUnavailable,
  onToggleTopic,
  onExplore,
}) {
  const items = TOPICS.filter((t) => savedTopics.includes(t.id));

  return (
    <dialog
      ref={dialogRef}
      className="dialog favorites-dialog"
      aria-labelledby="landing-saved-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current.close();
      }}
    >
      <div className="dialog-inner">
        <div className="dialog-heading">
          <div>
            <p className="eyebrow">Seu caderno local</p>
            <h2 id="landing-saved-title">Meus caminhos</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Fechar meus caminhos"
            onClick={() => dialogRef.current.close()}
          >
            <Iconoir name="xmark" size={20} />
          </button>
        </div>
        <p className="dialog-intro">
          Editorias guardadas para revisitar no seu ritmo — salvas apenas neste navegador, sem criar conta.
        </p>

        {items.length > 0 ? (
          <div className="saved-list">
            {items.map((topic) => (
              <article className="saved-benefit" key={topic.id}>
                <div className={`benefit-icon ${topic.tone}`}>
                  <Iconoir name={topic.icon} size={24} />
                </div>
                <div>
                  <h3>{topic.name}</h3>
                  <p>{topic.title}</p>
                </div>
                <button
                  type="button"
                  className="icon-button bookmark-button is-saved"
                  aria-label={`Remover caminho ${topic.name}`}
                  onClick={() => onToggleTopic(topic)}
                >
                  <Iconoir name="bookmark-solid" size={20} />
                </button>
              </article>
            ))}
            <div className="dialog-actions">
              <p className="storage-note">Salvo localmente neste navegador.</p>
              <FlowButton
                variant="primary"
                onClick={() => {
                  dialogRef.current.close();
                  onExplore(items[0].id);
                }}
              >
                Explorar no catálogo
              </FlowButton>
            </div>
          </div>
        ) : (
          <div className="saved-empty">
            <Iconoir name="bookmark" size={34} />
            <h3>Nenhum caminho guardado ainda.</h3>
            <p>
              Use o marcador ao lado de uma editoria para encontrá-la aqui depois.
            </p>
            <FlowButton
              variant="primary"
              onClick={() => {
                dialogRef.current.close();
                onExplore('todos');
              }}
            >
              Explorar o catálogo
            </FlowButton>
          </div>
        )}

        {storageUnavailable && (
          <p className="storage-warning" role="status">
            O armazenamento local está bloqueado. Seus caminhos ficam ativos apenas durante esta visita.
          </p>
        )}
      </div>
    </dialog>
  );
}
