import { accountErrorMessage, getAccountService } from './account-service.js';

let token, type, hasError;
{
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  token = fragment.get('access_token');
  type = fragment.get('type');
  hasError = fragment.has('error') || fragment.has('error_code');
}
// Remove credentials from the address bar before doing anything else.
window.history.replaceState(null, '', window.location.pathname);
const title = document.getElementById('callback-title');
const status = document.getElementById('callback-status');
const form = document.getElementById('reset-password-form');
const button = form.querySelector('button');

async function start() {
  if (hasError || !token || !['signup', 'recovery', 'email_change'].includes(type)) {
    status.textContent = 'Este link está inválido ou expirou. Volte à Alba para entrar ou solicitar novas instruções.';
    token = null;
    return;
  }
  const client = await getAccountService();
  if (!client.enabled) { status.textContent = 'O acesso às contas ainda está em preparação. Seu link poderá precisar ser solicitado novamente.'; token = null; return; }
  await client.verifyCallback(token);
  if (type !== 'recovery') {
    // Supabase has already consumed the confirmation link before redirecting here.
    title.textContent = 'Agora é só entrar.';
    status.textContent = 'O link de confirmação foi processado pelo serviço de contas. Volte à Alba e entre com seu e-mail e senha.';
    token = null;
    return;
  }
  title.textContent = 'Uma nova senha para sua conta.';
  status.textContent = 'Escolha uma senha que você não use em outros serviços.';
  form.hidden = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled) return;
    const data = new FormData(form);
    const password = String(data.get('password'));
    if (password !== data.get('confirmPassword')) { status.textContent = 'As senhas precisam ser iguais.'; return; }
    button.disabled = true;
    try {
      await client.resetPassword({ token, password });
      token = null;
      form.reset(); form.hidden = true;
      title.textContent = 'Sua senha foi atualizada.';
      status.textContent = 'Volte à Alba e entre com a nova senha.';
    } catch (error) { status.textContent = accountErrorMessage(error); form.reset(); }
    finally { button.disabled = false; }
  });
}
start().catch(() => { status.textContent = 'Não foi possível concluir. Volte à Alba e solicite novas instruções.'; token = null; });
window.addEventListener('pagehide', () => { token = null; form.reset(); form.hidden = true; });
window.addEventListener('pageshow', event => { if (event.persisted) status.textContent = 'Volte à Alba para entrar ou solicitar um novo link.'; });
