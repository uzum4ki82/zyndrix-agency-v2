import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { count, error } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.log('Error: Table probably does not exist or unauthorized.');
  } else {
    console.log(`REAL_SUPABASE_COUNT: ${count}`);
  }
}

check();
