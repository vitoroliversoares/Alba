import test from 'node:test';
import assert from 'node:assert/strict';
import { deploymentConfig } from '../scripts/prepare-public-config.mjs';

test('a clean deployment keeps the catalog available without an account connection', () => {
  assert.deepEqual(deploymentConfig({}), { supabaseUrl: null, supabasePublishableKey: null });
});

test('deployment exports only validated public settings, preserving local settings when no environment is provided', () => {
  const settings = { supabaseUrl: 'https://exampleproject.supabase.co', supabasePublishableKey: 'sb_publishable_test_only' };
  assert.deepEqual(deploymentConfig({}, { ...settings, privateSetting: 'must-not-be-exported' }), settings);
  assert.deepEqual(deploymentConfig({ ALBA_SUPABASE_URL: settings.supabaseUrl, ALBA_SUPABASE_PUBLISHABLE_KEY: settings.supabasePublishableKey, RESEND_API_KEY: 'must-not-be-exported' }), settings);
});

test('invalid or incomplete deployment credentials fail instead of exposing secrets or silently disabling accounts', () => {
  const url = 'https://exampleproject.supabase.co';
  assert.throws(() => deploymentConfig({ ALBA_SUPABASE_URL: url }));
  assert.throws(() => deploymentConfig({ ALBA_SUPABASE_URL: url, ALBA_SUPABASE_PUBLISHABLE_KEY: 'sb_secret_test_only' }));
  assert.throws(() => deploymentConfig({ ALBA_SUPABASE_URL: 'https://exampleproject.supabase.co.attacker.test', ALBA_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test_only' }));
});
