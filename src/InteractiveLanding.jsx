import { useEffect, useRef, useState } from 'react';
import { PATHS_KEY, readPaths, togglePath, writePaths } from './saved-paths.js';
import './interactive.css';
import { Icon } from './Icon.jsx';

const CHAPTERS = [
  { id: 'a-revista', label: 'A Alba' },
  { id: 'possibilidades', label: 'Caminhos' },
  { id: 'como-funciona', label: 'Como funciona' },
  { id: 'duvidas', label: 'Dúvidas' }
];
const MOODS = {
  estudo: { icon: 'book', action: 'Aprender algo novo', note: 'Da curiosidade ao próximo projeto.', detail: 'Um idioma que abre portas. Uma habilidade que vira ideia. Encontre oportunidades para continuar aprendendo, dentro e fora da sala de aula.' },
  criatividade: { icon: 'palette', action: 'Tirar uma ideia do papel', note: 'Um espaço para experimentar.', detail: 'Do primeiro rascunho ao trabalho pronto, descubra ferramentas que podem acompanhar suas ideias. O próximo projeto começa com espaço para criar.' },
  'bem-estar': { icon: 'coffee-cup', action: 'Encontrar meu ritmo', note: 'Uma pausa também faz parte.', detail: 'Entre prazos, aulas e planos, vale abrir espaço para você. Explore possibilidades para organizar o dia, concentrar a atenção e respirar um pouco.' }
};
const QUESTIONS = [
  ['Preciso criar uma conta para explorar?', 'Pode chegar sem cadastro. A apresentação e o catálogo são livres para explorar. Os botões de login e cadastro mostram uma prévia das futuras contas; nenhum dado do formulário é enviado ou guardado.'],
  ['Como sei se posso usar um benefício?', 'Confira os requisitos, as condições e a fonte oficial de cada oferta. Alguns fornecedores podem exigir vínculo estudantil. Os exemplos deste protótipo são ilustrativos e não representam ofertas verificadas.'],
  ['O que acontece quando guardo um caminho?', 'Você marca um tema para revisitar na Alba. A seleção fica apenas neste navegador, sem conta ou sincronização. Limpar os dados do navegador remove os caminhos guardados. Se o armazenamento estiver indisponível, a seleção dura somente esta visita.'],
  ['A Alba ativa os benefícios por mim?', 'A Alba ajuda você a descobrir e entender as possibilidades. A ativação acontece no site oficial do fornecedor. Não há pagamento nem envio de documentos por esta prévia.']
];

export function EditorialIcon({ name, size = 22 }) {
  return <Icon name={name} size={size} />;
}

export function useSavedPaths() {
  const [saved, setSaved] = useState([]);
  const [temporary, setTemporary] = useState(false);
  const savedRef = useRef([]);
  useEffect(() => {
    let paths = [];
    try { paths = readPaths(window.localStorage); } catch { setTemporary(true); }
    savedRef.current = paths;
    setSaved(paths);
    const sync = event => {
      if (event.key && event.key !== PATHS_KEY) return;
      try {
        const next = readPaths(window.localStorage);
        savedRef.current = next;
        setSaved(next);
      } catch { setTemporary(true); }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  function toggle(id) {
    const next = togglePath(savedRef.current, id);
    savedRef.current = next;
    setSaved(next);
    try { setTemporary(!writePaths(window.localStorage, next)); } catch { setTemporary(true); }
  }
  return { saved, temporary, toggle };
}

export function ChapterBar({ count, onOpenSaved }) {
  const [active, setActive] = useState('a-revista');
  const progressRef = useRef(null);
  const barRef = useRef(null);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      let chapter = CHAPTERS[0].id;
      for (const item of CHAPTERS) {
        const element = document.getElementById(item.id);
        if (element && element.getBoundingClientRect().top <= window.innerHeight * .4) chapter = item.id;
      }
      setActive(chapter);
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      const progress = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const updateHeight = () => {
      if (barRef.current) document.documentElement.style.setProperty('--chapter-height', `${barRef.current.getBoundingClientRect().height}px`);
      schedule();
    };
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(barRef.current);
    updateHeight();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);
  return <div className="chapter-bar" ref={barRef}>
    <nav aria-label="Capítulos da apresentação">{CHAPTERS.map(item => <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined}>{item.label}</a>)}</nav>
    <button className="chapter-saved" onClick={onOpenSaved} aria-haspopup="dialog" aria-label={`Abrir meus caminhos, ${count} guardados`}><EditorialIcon name="bookmark" size={18} /><span>Meus caminhos</span><span className="saved-path-count">{count}</span></button>
    <span className="chapter-progress" aria-hidden="true"><span ref={progressRef} /></span>
  </div>;
}

export function DiscoveryStudio({ topics, paths, onExplore, onOpenSaved, initialTopic = 'estudo' }) {
  const [selected, setSelected] = useState(initialTopic);
  const [message, setMessage] = useState('');
  const topic = topics.find(item => item.id === selected) || topics[0];
  const mood = MOODS[topic.id];
  const saved = paths.saved.includes(topic.id);
  function save() {
    paths.toggle(topic.id);
    setMessage(saved ? `${topic.name} removido dos seus caminhos.` : `${topic.name} guardado nos seus caminhos.`);
  }
  return <section className="possibilities section-padding discovery-studio" id="possibilidades" aria-labelledby="possibilities-title">
    <div className="section-heading"><div><p className="eyebrow">Um campus de possibilidades</p><h2 id="possibilities-title">O que combina com<br />o seu momento?</h2></div><p>Escolha um caminho.<br />As próximas páginas são suas.</p></div>
    <fieldset className="interest-selector"><legend>Hoje, eu quero…</legend><div className="interest-options">{topics.map(item => <label key={item.id} className={`interest-option ${selected === item.id ? 'is-selected' : ''}`}><input type="radio" name="discovery-interest" value={item.id} checked={selected === item.id} onChange={() => { setSelected(item.id); setMessage(''); }} /><EditorialIcon name={MOODS[item.id].icon} /><span>{MOODS[item.id].action}</span><span className="interest-check" aria-hidden="true"><EditorialIcon name="check" size={16} /></span></label>)}</div></fieldset>
    <div className="discovery-spread">
      <div className="discovery-art">{topics.map(item => <img key={item.id} className={selected === item.id ? 'is-visible' : ''} src={`/assets/${item.image}`} alt={selected === item.id ? item.alt : ''} aria-hidden={selected !== item.id} width="1536" height="1024" loading="lazy" />)}<span className="discovery-page-note" aria-hidden="true">{mood.note}</span></div>
      <div className="discovery-copy"><div className="discovery-category"><p className="eyebrow">{topic.name}</p></div><div className="discovery-text" aria-live="polite" aria-atomic="true"><h3>{topic.title}</h3><p>{mood.detail}</p></div><div className="discovery-actions"><button className="button button-primary tactile-button" onClick={() => onExplore(topic.id)}>Explorar {topic.name.toLowerCase()}<EditorialIcon name="nav-arrow-right" size={18} /></button><button className={`save-path-button ${saved ? 'is-saved' : ''}`} aria-pressed={saved} aria-label={`${saved ? 'Remover' : 'Guardar'} caminho de ${topic.name}`} onClick={save}><EditorialIcon name={saved ? 'check' : 'bookmark'} size={20} /><span>{saved ? 'Guardado' : 'Guardar caminho'}</span></button></div></div>
    </div>
    <div className="discovery-bottom"><p>{paths.temporary ? 'Seus caminhos ficam guardados somente durante esta visita.' : 'Guarde um caminho para voltar depois. Só neste navegador.'}</p><button className="text-button" onClick={onOpenSaved} aria-haspopup="dialog">Ver meus caminhos ({paths.saved.length})<EditorialIcon name="nav-arrow-right" size={16} /></button></div>
    <p className="discovery-status" role="status">{message}</p>
  </section>;
}

export function SavedPathsDialog({ dialogRef, topics, paths, onExplore }) {
  const [removed, setRemoved] = useState(null);
  const [notice, setNotice] = useState('');
  function remove(id) {
    const index = paths.saved.indexOf(id);
    const remaining = paths.saved.filter(item => item !== id);
    const nextId = remaining[Math.min(index, remaining.length - 1)];
    paths.toggle(id);
    setRemoved(id);
    setNotice(`${topics.find(topic => topic.id === id).name} removido dos seus caminhos.`);
    requestAnimationFrame(() => {
      const next = nextId && dialogRef.current?.querySelector(`[data-remove-path="${nextId}"]`);
      (next || dialogRef.current?.querySelector('[data-close-paths]'))?.focus();
    });
  }
  function undo() {
    const restoredId = removed;
    if (removed && !paths.saved.includes(removed)) paths.toggle(removed);
    setNotice('Caminho guardado novamente.');
    setRemoved(null);
    requestAnimationFrame(() => dialogRef.current?.querySelector(`[data-remove-path="${restoredId}"]`)?.focus());
  }
  return <dialog ref={dialogRef} className="dialog saved-paths-dialog" aria-labelledby="saved-paths-title" onClose={() => { setRemoved(null); setNotice(''); }} onClick={event => { if (event.target === event.currentTarget) dialogRef.current.close(); }}><div className="dialog-inner"><div className="dialog-heading"><div><p className="eyebrow">Para o seu próximo momento</p><h2 id="saved-paths-title">Meus caminhos.</h2></div><button className="icon-button" data-close-paths onClick={() => dialogRef.current.close()} aria-label="Fechar meus caminhos"><EditorialIcon name="xmark" /></button></div><p className="saved-paths-intro">{paths.temporary ? 'Sua seleção dura esta visita.' : 'Uma pequena seleção sua, guardada neste navegador.'}</p>{paths.saved.length ? <ul className="saved-path-list">{paths.saved.map(id => {
    const topic = topics.find(item => item.id === id);
    return <li key={id}><img src={`/assets/${topic.image}`} alt="" width="108" height="80" /><div><h3>{topic.name}</h3><button className="text-button" onClick={() => { dialogRef.current.close(); onExplore(id); }}>Explorar caminho<EditorialIcon name="nav-arrow-right" size={16} /></button></div><button className="icon-button" data-remove-path={id} aria-label={`Remover caminho de ${topic.name}`} onClick={() => remove(id)}><EditorialIcon name="xmark" size={18} /></button></li>;
  })}</ul> : <div className="saved-paths-empty"><EditorialIcon name="bookmark" size={36} /><h3>Um espaço para suas curiosidades.</h3><p>Escolha um tema e toque em “Guardar caminho”. Você pode mudar de ideia quando quiser.</p><button className="button button-primary tactile-button" onClick={() => { dialogRef.current.close(); window.location.hash = 'possibilidades'; }}>Escolher meu primeiro caminho</button></div>}<div className="saved-paths-feedback"><p role="status">{notice}</p>{removed && !paths.saved.includes(removed) && <button className="text-button" onClick={undo}>Desfazer remoção</button>}</div><p className="saved-paths-footnote">Temas de interesse, sem ativação de ofertas ou criação de conta.</p></div></dialog>;
}

export function Questions() {
  return <section className="questions section-padding" id="duvidas" aria-labelledby="questions-title"><div className="questions-heading"><p className="eyebrow">Antes de virar a página</p><h2 id="questions-title">Pode perguntar.</h2><p>Alguns detalhes para você<br />se sentir em casa.</p></div><div className="question-list">{QUESTIONS.map(([question, answer]) => <details key={question} name="revista-questions"><summary>{question}<EditorialIcon name="nav-arrow-down" size={21} /></summary><p>{answer}</p></details>)}</div></section>;
}
