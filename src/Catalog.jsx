import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon.jsx';
import { BrandMark } from './components/BrandMark.jsx';
import { allModes, filterServices, OFFER_KINDS, offerStatus, SERVICES, VERIFIED_AT } from './data/catalog.js';
import { accountErrorMessage } from '../public/assets/account-service.js';
import { EMPTY_COLLECTION } from './account-collection.js';
import './catalog.css';

const CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'estudo', label: 'Estudo' },
  { id: 'criatividade', label: 'Criatividade' },
  { id: 'bem-estar', label: 'Bem-estar' },
];
const dateLabel = value => new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(`${value}T12:00:00Z`));

function Dialog({ dialogRef, title, children, className }) {
  return (
    <dialog ref={dialogRef} className={`dialog ${className}`} aria-labelledby={`${className}-title`} onClick={event => {
      if (event.target === event.currentTarget) dialogRef.current.close();
    }}>
      <div className="dialog-inner">
        <div className="dialog-heading">
          <h2 id={`${className}-title`}>{title}</h2>
          <button type="button" className="icon-button" aria-label="Fechar" onClick={() => dialogRef.current.close()}><Icon name="x" /></button>
        </div>
        {children}
      </div>
    </dialog>
  );
}

export function OfferDetails({ service }) {
  const [selectedId, setSelectedId] = useState(service.offers[0].id);
  const offer = service.offers.find(item => item.id === selectedId) || service.offers[0];
  const expired = offerStatus(offer) === 'expired';
  return (
    <div className="service-expanded">
      <div className="service-art">
        <img src={`/assets/${service.image}`} width="1536" height="1024" alt={service.imageAlt} loading="lazy" />
        <p>{service.description}</p>
        {service.offers.length > 1 && (
          <fieldset className="offer-plan-picker">
            <legend>Compare os planos</legend>
            <div className="offer-plan-options">
              {service.offers.map(item => (
                <button type="button" key={item.id} className={`offer-plan-option ${offer.id === item.id ? 'is-selected' : ''}`} aria-pressed={offer.id === item.id} aria-controls={`offer-content-${service.id}`} onClick={() => setSelectedId(item.id)}>
                  <span><strong>{item.title}</strong><small>{offerStatus(item) === 'expired' ? 'Resgate encerrado' : OFFER_KINDS[item.kind].label}</small></span>
                  {offer.id === item.id && <Icon name="check" size={17} />}
                </button>
              ))}
            </div>
          </fieldset>
        )}
      </div>
      <div className="offer-detail" id={`offer-content-${service.id}`} role="region" aria-labelledby={`offer-title-${service.id}`}>
        <div className="offer-kind-line">
          <span>{expired ? 'Resgate encerrado' : OFFER_KINDS[offer.kind].label}</span>
          {offer.scope === 'general' && <span>Promoção geral</span>}
        </div>
        <h3 id={`offer-title-${service.id}`}>{offer.title}</h3>
        <p className="offer-price">{offer.price}</p>
        <p className="offer-summary">{offer.summary}</p>
        <dl className="offer-facts">
          <div><dt>Quem pode usar</dt><dd>{offer.eligibility}</dd></div>
          <div><dt>{offer.kind === 'trial' ? 'Depois do teste' : 'Duração e renovação'}</dt><dd>{offer.renewal}</dd></div>
          {offer.redeemBy && <div><dt>Prazo de resgate</dt><dd><time dateTime={offer.redeemBy}>{dateLabel(offer.redeemBy)}</time></dd></div>}
        </dl>
        <div className="offer-action-row">
          {expired ? <span className="offer-expired" aria-disabled="true">Prazo de resgate encerrado</span> : (
            <a className="button button-primary" href={offer.officialUrl} target="_blank" rel="noopener noreferrer" aria-label={`Ver ${offer.title} no site oficial (abre em nova aba)`}>
              Ver no site oficial<Icon name="arrow-up-right" size={18} />
            </a>
          )}
        </div>
        <div className="offer-steps"><h4>Como aproveitar</h4><ol>{offer.steps.map(step => <li key={step}>{step}</li>)}</ol></div>
        <div className="offer-sources">
          <p>Conferido em <time dateTime={offer.verifiedAt}>{dateLabel(offer.verifiedAt)}</time> · Condições podem mudar.</p>
          <ul aria-label={`Fontes de ${offer.title}`}>{offer.sources.map(item => <li key={item.url}><a href={item.url} target="_blank" rel="noopener noreferrer">{item.label}<Icon name="arrow-up-right" size={12} /></a></li>)}</ul>
        </div>
      </div>
    </div>
  );
}

export function Catalog({ onBack, initialCategory = 'todos', onReady, onAccount, savedState = EMPTY_COLLECTION, collection }) {
  useEffect(() => { onReady?.(); }, [onReady]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [modes, setModes] = useState(allModes);
  const [draftModes, setDraftModes] = useState(allModes);
  const favorites = savedState.favorites;
  const hasAccount = Boolean(savedState.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const searchRef = useRef(null);
  const filterRef = useRef(null);
  const favoritesRef = useRef(null);
  const aboutRef = useRef(null);
  const menuRef = useRef(null);
  useEffect(() => { if (!hasAccount) favoritesRef.current?.close(); }, [hasAccount]);
  const savedServices = SERVICES.filter(service => favorites.includes(service.id));
  const visible = filterServices({ category, query, modes });
  const planCount = visible.reduce((sum, service) => sum + service.offers.length, 0);
  const filterCount = Object.values(modes).filter(value => !value).length;

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 2500);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    if (!menuOpen) return;
    const pointer = event => { if (!menuRef.current?.contains(event.target)) setMenuOpen(false); };
    const keyboard = event => { if (event.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('pointerdown', pointer);
    document.addEventListener('keydown', keyboard);
    return () => { document.removeEventListener('pointerdown', pointer); document.removeEventListener('keydown', keyboard); };
  }, [menuOpen]);

  function openFavorites() {
    if (!hasAccount) { onAccount?.('save'); return; }
    favoritesRef.current.showModal();
  }
  async function toggleFavorite(service) {
    if (!hasAccount) { onAccount?.('save'); return; }
    const saved = favorites.includes(service.id);
    try {
      await collection.toggleFavorite(service.id);
      setNotice(`${service.name} ${saved ? 'removido dos' : 'salvo nos'} favoritos.`);
    } catch (error) { setNotice(accountErrorMessage(error)); }
  }
  function favoriteButton(service) {
    const saved = favorites.includes(service.id);
    return <button type="button" disabled={hasAccount && (savedState.busy || savedState.status !== 'ready')} className={`icon-button bookmark-button ${saved ? 'is-saved' : ''}`} aria-pressed={saved} aria-label={hasAccount ? `${saved ? 'Remover' : 'Salvar'} ${service.name} ${saved ? 'dos' : 'nos'} favoritos` : `Criar conta para salvar ${service.name}`} onClick={() => toggleFavorite(service)}><Icon name={saved ? 'bookmark-solid' : 'bookmark-simple'} size={23} /></button>;
  }
  function clearFilters() { setQuery(''); setCategory('todos'); setModes(allModes()); setDraftModes(allModes()); }

  return (
    <>
      <div className="catalog-return"><button type="button" className="text-button" onClick={onBack}>Voltar à apresentação da Alba</button></div>
      <a className="skip-link" href="#descobertas">Pular para os benefícios</a>
      <div className="newspaper real-catalog" id="inicio">
        <header className="masthead">
          <a href="#inicio" className="brand" aria-label="Alba — início"><span className="brand-name">Alba</span><span className="brand-description">Hub de Benefícios Estudantis</span></a>
          <div className="header-actions">
            {onAccount && <button type="button" className="text-button catalog-account-link" onClick={() => onAccount()}>{hasAccount ? 'Minha conta' : 'Entrar'}</button>}
            <button type="button" className="favorites-link" aria-label="Favoritos" onClick={openFavorites}><Icon name={savedServices.length ? 'bookmark-solid' : 'bookmark-simple'} size={25} /><span>Favoritos</span>{savedServices.length > 0 && <span className="favorite-count" aria-label={`${savedServices.length} salvos`}>{savedServices.length}</span>}</button>
            <div className="mobile-menu" ref={menuRef}>
              <button type="button" className="icon-button" aria-label="Abrir menu" aria-expanded={menuOpen} aria-controls="main-menu" onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'x' : 'list'} size={25} /></button>
              {menuOpen && <nav className="menu-panel" id="main-menu" aria-label="Navegação do catálogo"><button type="button" onClick={onBack}>A Alba</button><button type="button" onClick={() => { setMenuOpen(false); openFavorites(); }}>Meus favoritos</button><button type="button" onClick={() => { setMenuOpen(false); aboutRef.current.showModal(); }}>Sobre o catálogo</button></nav>}
            </div>
          </div>
        </header>
        <main>
          <div className="catalog-mark"><h1 className="sr-only">Catálogo de benefícios</h1><img src="/assets/sol-e-livro-logo.png" width="170" height="96" alt="Livro aberto diante do sol, símbolo da Alba" fetchPriority="high" /></div>
          <section className="discoveries" id="descobertas" aria-label="Descobrir benefícios">
            <form className="search" role="search" onSubmit={event => event.preventDefault()}>
              <Icon name="magnifying-glass" size={25} /><label className="sr-only" htmlFor="benefit-search">Buscar serviço ou plano</label>
              <input ref={searchRef} id="benefit-search" name="search" type="search" placeholder="Buscar serviço ou plano" autoComplete="off" value={query} onChange={event => setQuery(event.target.value)} />
              {query && <button type="button" className="icon-button clear-search" aria-label="Limpar busca" onClick={() => { setQuery(''); searchRef.current.focus(); }}><Icon name="x" size={19} /></button>}
            </form>
            <div className="catalog-toolbar">
              <div className="category-tabs" role="group" aria-label="Categorias de benefícios">{CATEGORIES.map(item => <button type="button" key={item.id} className={category === item.id ? 'category active' : 'category'} aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.label}</button>)}</div>
              <button type="button" className={`button button-outline filter-button ${filterCount ? 'has-filters' : ''}`} aria-haspopup="dialog" onClick={() => { setDraftModes({ ...modes }); filterRef.current.showModal(); }}><Icon name="funnel-simple" size={20} /><span>Filtrar</span>{filterCount > 0 && <span className="filter-count">{filterCount}</span>}</button>
            </div>
            <div className="catalog-intro-line"><p role="status" aria-live="polite">{visible.length} {visible.length === 1 ? 'serviço' : 'serviços'} · {planCount} {planCount === 1 ? 'opção de acesso' : 'opções de acesso'}</p><p>Abra um item para comparar as condições.</p></div>
            {visible.length ? (
              <div className="service-grid">
                {visible.map(service => (
                  <article className="catalog-service" key={service.id}>
                    <details name="catalog-services">
                      <summary className="service-summary">
                        <span className="service-summary-heading">
                          <BrandMark service={service} />
                          <span className="service-summary-copy"><span className="service-name">{service.name}</span><span className="service-subtitle">{service.subtitle}</span></span>
                        </span>
                        <span className="service-summary-modalities">{[...new Set(service.offers.map(offer => offerStatus(offer) === 'expired' ? 'Resgate encerrado' : OFFER_KINDS[offer.kind].label))].map(label => <span key={label}>{label}</span>)}</span>
                        <span className="service-summary-footer">
                          <span className="service-plan-count">{service.offers.length} {service.offers.length === 1 ? 'opção de acesso' : 'opções de acesso'}</span>
                          <span className="service-expand-label"><span className="when-collapsed">Ver detalhes</span><span className="when-expanded">Recolher detalhes</span><span className="service-expand-icon" aria-hidden="true"><Icon name="nav-arrow-down" size={17} /></span></span>
                        </span>
                      </summary>
                      <OfferDetails service={service} />
                    </details>
                    {favoriteButton(service)}
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state"><Icon name="magnifying-glass" size={35} /><h2>Nenhuma descoberta por aqui. Ainda.</h2><p>Tente outro termo ou ajuste os filtros.</p><button type="button" className="button button-primary" onClick={clearFilters}>Limpar busca e filtros</button></div>
            )}
          </section>
        </main>
        <footer className="footer catalog-footer"><p>Fontes oficiais · Última revisão em <time dateTime={VERIFIED_AT}>{dateLabel(VERIFIED_AT)}</time></p><nav className="catalog-info-links" aria-label="Sobre a Alba"><a href="/quem-somos.html">Quem somos</a><a href="/privacidade.html">Privacidade e LGPD</a><button type="button" className="text-button" onClick={() => aboutRef.current.showModal()}>Sobre o catálogo</button></nav></footer>
      </div>
      <Dialog dialogRef={filterRef} title="Do seu jeito" className="filter-dialog">
        <p className="dialog-intro">Escolha as modalidades que quer comparar.</p>
        <fieldset className="filter-options"><legend>Modalidade</legend>{Object.entries(OFFER_KINDS).map(([kind, item]) => <label key={kind}><span><strong>{item.label}</strong><small>{item.hint}</small></span><input type="checkbox" checked={draftModes[kind]} onChange={event => setDraftModes({ ...draftModes, [kind]: event.target.checked })} /></label>)}</fieldset>
        <div className="dialog-actions"><button type="button" className="text-button" onClick={() => setDraftModes(allModes())}>Limpar filtros</button><button type="button" className="button button-primary" onClick={() => { setModes({ ...draftModes }); filterRef.current.close(); }}>Ver benefícios</button></div>
      </Dialog>
      <Dialog dialogRef={favoritesRef} title="Suas boas descobertas" className="favorites-dialog">
        <p className="dialog-intro">Serviços guardados na sua conta, para acompanhar você.</p>
        {savedState.status === 'loading' ? <p role="status">Buscando suas descobertas…</p> : savedState.status === 'error' ? <div className="collection-feedback"><p role="status">Não foi possível carregar seus favoritos.</p><button type="button" className="text-button" onClick={() => collection?.reload()}>Tentar novamente</button></div> : savedServices.length ? <div className="saved-list">{savedServices.map(service => <article className="saved-benefit" key={service.id}><BrandMark service={service} /><div><h3>{service.name}</h3><p>{service.offers.length} {service.offers.length === 1 ? 'opção' : 'opções'} de acesso</p></div>{favoriteButton(service)}</article>)}</div> : <div className="saved-empty"><Icon name="bookmark-simple" size={40} /><h3>Guarde a primeira descoberta.</h3><p>Use o marcador de um serviço para encontrá-lo aqui.</p><button type="button" className="button button-primary" onClick={() => favoritesRef.current.close()}>Explorar benefícios</button></div>}
      </Dialog>
      <Dialog dialogRef={aboutRef} title="Informação antes da assinatura." className="about-dialog">
        <p className="dialog-intro">Cada opção tem fonte oficial, requisitos e data de conferência. A aprovação e a contratação acontecem no fornecedor.</p>
        <p>As opções são para acesso pelo próprio estudante. Testes têm prazo e podem gerar cobrança depois. O teste do Canva Pro é uma promoção geral, também utilizável por universitários elegíveis. Não enviamos documentos nem ativamos assinaturas por você.</p>
        <button type="button" className="button button-primary dialog-done" onClick={() => aboutRef.current.close()}>Voltar às descobertas</button>
      </Dialog>
      <div className={`toast ${notice ? 'visible' : ''}`} role="status" aria-live="polite"><Icon name="check" size={19} /><span>{notice}</span></div>
    </>
  );
}
