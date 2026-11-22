import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { validateAppConfig } from '../public/assets/account-service.js';

export function deploymentConfig(env, fallback = {}) {
  const url = env.ALBA_SUPABASE_URL;
  const key = env.ALBA_SUPABASE_PUBLISHABLE_KEY;
  if (url || key) {
    const config = validateAppConfig({ supabaseUrl: url, supabasePublishableKey: key });
    if (!config.authEnabled) throw new Error('Provide both a valid ALBA_SUPABASE_URL and a publishable ALBA_SUPABASE_PUBLISHABLE_KEY. Secret keys must never be used in client configuration.');
    return { supabaseUrl: config.supabaseUrl, supabasePublishableKey: config.supabasePublishableKey };
  }
  const config = validateAppConfig(fallback);
  return { supabaseUrl: config.supabaseUrl, supabasePublishableKey: config.supabasePublishableKey };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const output = new URL('../public/app-config.json', import.meta.url);
  const fallback = existsSync(output) ? JSON.parse(readFileSync(output, 'utf8')) : {};
  const config = deploymentConfig(process.env, fallback);
  writeFileSync(output, JSON.stringify(config, null, 2) + '\n');
  console.log(config.supabasePublishableKey ? 'Public account configuration prepared.' : 'Catalog prepared; account connection remains unconfigured.');
}
