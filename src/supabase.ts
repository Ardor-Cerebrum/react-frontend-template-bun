import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isConfigured = !!(
  supabaseUrl && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'your-anon-key'
);

if (!isConfigured) {
  console.warn(
    '⚠️ Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Ardor service variables.'
  );
}

// Use placeholders if not configured to prevent client initialization crash
const finalUrl = isConfigured ? supabaseUrl : 'https://placeholder.supabase.co';
const finalKey = isConfigured ? supabaseAnonKey : 'placeholder';

export const supabase = createClient(finalUrl, finalKey);
export { isConfigured };
