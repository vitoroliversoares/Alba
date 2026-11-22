import { loadAppConfig } from './account-service.js';
const config = await loadAppConfig();
if (config.supportUrl) {
  const link = document.getElementById('support-payment-link');
  link.href = config.supportUrl;
  link.hidden = false;
  document.getElementById('support-pending-button')?.setAttribute('hidden', '');
  document.getElementById('support-payment-note').hidden = false;
  document.getElementById('support-status').textContent = 'Seu apoio é voluntário e um incentivo para continuarmos.';
}
