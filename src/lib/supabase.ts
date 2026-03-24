import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // If we are in production and missing keys, we must fail gracefully to avoid crashes,
  // but we should NEVER hardcode them here.
  if (typeof window !== 'undefined') {
    console.error('CRITICAL: Supabase credentials missing. CRM functions will not work.');
  }
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
