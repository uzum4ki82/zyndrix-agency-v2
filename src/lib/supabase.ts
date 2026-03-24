import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vrvfftftnlspajplqjye.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_04ivizRHZPLg2eH6YkQUtw_MJG7DXfE';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Check .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
