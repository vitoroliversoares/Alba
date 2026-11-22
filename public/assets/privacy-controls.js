// Remove only Alba preferences, preserving any unrelated data on this origin.
export const ALBA_PREFERENCE_KEYS = [
  'revista-campus:prototype:favorites:v1',
  'revista-campus:prototype:paths:v1',
  'revista-campus:prototype:moments:v1',
];

export function clearAlbaPreferences(storage) {
  try {
    const target = storage ?? globalThis.localStorage;
    for (const key of ALBA_PREFERENCE_KEYS) target.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

if (typeof document !== 'undefined') {
  const button = document.getElementById('clear-alba-data');
  const feedback = document.getElementById('privacy-feedback');
  if (button && feedback) {
    button.hidden = false;
    button.addEventListener('click', () => {
      feedback.textContent = clearAlbaPreferences()
        ? 'Suas escolhas da Alba foram apagadas deste navegador.'
        : 'Não foi possível apagar todas as escolhas. Tente remover os dados deste site nas configurações do navegador.';
    });
  }
}
