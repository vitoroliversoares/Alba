import { useEffect, useRef, useState } from 'react';
import { Iconoir } from './IconoirIcons.jsx';
import { accountErrorMessage, getAccountService } from '../../public/assets/account-service.js';

export function AccountDialog({ dialogRef, mode, reason, onModeChange, onExplore, onUserChange }) {
  const [service, setService] = useState(null);
  const [user, setUser] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [providers, setProviders] = useState(null);
  const [providersError, setProvidersError] = useState(false);
  const formRef = useRef(null);
  const signup = mode === 'signup';
  const recovery = mode === 'recovery';

  useEffect(() => {
    let active = true;
    let unsubscribe;
    getAccountService().then(client => {
      if (!active) return;
      setService(client);
      const update = value => { if (active) { setUser(value); onUserChange?.(value); } };
      update(client.getUser());
      unsubscribe = client.subscribe(update);
      client.getProviders().then(value => { if (active) setProviders(value); }).catch(() => { if (active) setProvidersError(true); });
    });
    return () => { active = false; unsubscribe?.(); };
  }, [onUserChange]);

  useEffect(() => { setMessage(''); setSuccess(false); formRef.current?.reset(); }, [mode]);
  useEffect(() => {
    const restore = event => { if (event.persisted) { setBusy(false); formRef.current?.reset(); } };
    window.addEventListener('pageshow', restore);
    return () => window.removeEventListener('pageshow', restore);
  }, []);

  async function submit(event) {
    event.preventDefault();
    if (busy || !service?.enabled) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setBusy(true); setMessage(''); setSuccess(false);
    try {
      const email = String(fields.get('email') || '');
      const password = String(fields.get('password') || '');
      const redirectTo = new URL('/auth-callback.html', window.location.origin).href;
      if (recovery) {
        await service.recover({ email, redirectTo });
        setMessage('Se houver uma conta para esse e-mail, você receberá as instruções para redefinir a senha.');
      } else if (signup) {
        const result = await service.signUp({ email, password, name: String(fields.get('name') || ''), redirectTo });
        setMessage(result.signedIn ? 'Sua conta está pronta.' : 'Confira sua caixa de entrada para confirmar o cadastro. Se você já tem conta, pode entrar.');
      } else {
        await service.signIn({ email, password });
        setMessage('Você entrou na Alba.');
      }
      setSuccess(true);
      form.reset();
    } catch (error) { setMessage(accountErrorMessage(error)); }
    finally {
      const passwordInput = form.elements.namedItem('password');
      if (passwordInput) passwordInput.value = '';
      setBusy(false);
    }
  }

  async function signOut() {
    if (busy) return;
    setBusy(true); setMessage('');
    try { await service.signOut(); setMessage('Você saiu da Alba.'); }
    catch { setMessage('Você saiu desta aba. Não foi possível confirmar o encerramento da sessão no servidor; ela expirará conforme o prazo do serviço.'); }
    finally { setBusy(false); setSuccess(false); }
  }

  async function socialSignIn(provider) {
    if (busy || !service?.enabled) return;
    setBusy(true); setMessage(''); setSuccess(false);
    formRef.current?.reset();
    try {
      const origin = window.location.origin;
      const url = await service.getOAuthUrl(provider, { origin, redirectTo: new URL('/', origin).href });
      window.location.assign(url);
    } catch (error) { setMessage(accountErrorMessage(error)); setBusy(false); }
  }

  async function refreshProviders() {
    setProvidersError(false); setProviders(null);
    try { setProviders(await service.getProviders()); }
    catch { setProvidersError(true); }
  }

  const title = user ? 'Seu espaço na Alba.' : recovery ? 'Um novo acesso começa aqui.' : reason === 'save' ? 'Guarde suas boas descobertas.' : signup ? 'Seu próximo capítulo começa aqui.' : 'Que bom ter você por aqui.';
  return (
    <dialog ref={dialogRef} className="dialog account-dialog" aria-labelledby="account-title" onClose={() => { setMessage(''); setSuccess(false); formRef.current?.reset(); }} onFocusCapture={() => { if (service) { const current = service.getUser(); setUser(current); onUserChange?.(current); } }} onClick={event => { if (event.target === event.currentTarget) dialogRef.current.close(); }}>
      <div className="dialog-inner">
        <div className="dialog-heading"><h2 id="account-title">{title}</h2><button type="button" className="icon-button" aria-label="Fechar" onClick={() => dialogRef.current.close()}><Iconoir name="xmark" size={20} /></button></div>
        {user ? (
          <div className="account-feedback">
            <p>Olá, {user.user_metadata?.display_name || user.user_metadata?.full_name || user.user_metadata?.name || 'estudante'}.</p>
            <p>{user.email}</p>
            <p className="account-fine-print">Favoritos e editorias ficam vinculados à sua conta. Entre em outro aparelho para reencontrar suas escolhas. Ao recarregar ou encerrar esta página, será necessário entrar novamente.</p>
            <button type="button" className="button button-primary" onClick={() => { dialogRef.current.close(); onExplore(); }}>Explorar benefícios</button>
            <button type="button" className="text-button account-secondary" disabled={busy} onClick={signOut}>Sair da conta</button>
          </div>
        ) : (
          <>
            <p className="account-intro">{recovery ? 'Informe seu e-mail para receber as instruções.' : reason === 'save' ? 'Crie uma conta gratuita ou entre para guardar favoritos e editorias. Você pode continuar explorando o catálogo sem cadastro.' : signup ? 'Um espaço para guardar o que combina com seu semestre. O catálogo continua aberto para todo mundo.' : 'Entre com o e-mail e a senha da sua conta.'}</p>
            {!service?.enabled && <p className="prototype-caption" role="status">{service ? 'O cadastro está em preparação. Você já pode explorar os benefícios sem conta.' : 'Verificando disponibilidade do cadastro…'}</p>}
            {!recovery && !(success && signup) && <>
              <div className="account-social-options" aria-label="Outras formas de acessar sua conta">
                <button type="button" className="account-social-button" disabled={busy || !service?.enabled || !providers?.google} onClick={() => socialSignIn('google')} aria-describedby="social-google-status"><img src="/assets/brands/google.svg" alt="" width="20" height="20" /><span>Continuar com Google</span><small id="social-google-status">{providers?.google ? '' : providersError ? 'Indisponível' : providers ? 'Em configuração' : 'Verificando…'}</small></button>
              </div>
              {providersError && <p className="account-fine-print" role="status">Não foi possível consultar as opções de acesso. <button type="button" className="text-button" onClick={refreshProviders}>Tentar novamente</button></p>}
              <p className="account-divider"><span>ou use seu e-mail</span></p>
            </>}
            {!(success && (signup || recovery)) && <form ref={formRef} key={mode} className="account-form" onSubmit={submit} aria-busy={busy}>
              <fieldset className="account-fields" disabled={busy || !service?.enabled}>
                {signup && <label>Como podemos chamar você?<input name="name" placeholder="Seu nome" autoComplete="given-name" required minLength={2} maxLength={80} /></label>}
                <label>E-mail<input name="email" type="email" placeholder="voce@exemplo.com" autoComplete="email" required maxLength={254} /></label>
                {!recovery && <label>Senha<input name="password" type="password" placeholder={signup ? 'Pelo menos 8 caracteres' : 'Sua senha'} autoComplete={signup ? 'new-password' : 'current-password'} required minLength={signup ? 8 : 1} maxLength={128} /></label>}
                {signup && <p className="account-fine-print">Nome e e-mail serão usados para sua conta. Conheça nosso <a href="/privacidade.html" target="_blank" rel="noopener noreferrer">aviso de privacidade (abre em nova aba)</a>. Nenhum documento acadêmico é solicitado.</p>}
                <button type="submit" className="button button-primary account-submit">{busy ? 'Aguarde…' : recovery ? 'Enviar instruções' : signup ? 'Criar conta' : 'Entrar'}</button>
              </fieldset>
            </form>}
            <p className="account-switch">{signup || recovery ? 'Já tem uma conta?' : 'Primeira visita?'}{' '}<button type="button" className="text-button" disabled={busy} onClick={() => onModeChange(signup || recovery ? 'login' : 'signup')}>{signup || recovery ? 'Entrar' : 'Criar conta'}</button></p>
            {!signup && !recovery && <button type="button" className="text-button account-secondary" disabled={busy} onClick={() => onModeChange('recovery')}>Esqueci minha senha</button>}
            <button type="button" className="text-button account-secondary" onClick={() => { dialogRef.current.close(); onExplore(); }}>Explorar sem conta →</button>
          </>
        )}
        <p className="account-message" role="status" aria-live="polite">{message}</p>
      </div>
    </dialog>
  );
}
