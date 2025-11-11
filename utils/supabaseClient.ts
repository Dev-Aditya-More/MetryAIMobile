// import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@env';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto'; // Needed for React Native
import type { Database } from '../types/database';

// Use Babel inline env since process.env isn’t available in RN
const supabaseUrl = "https://axfvlvbujyosoenpzjgt.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4ZnZsdmJ1anlvc29lbnB6amd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDIyMTA5MSwiZXhwIjoyMDY1Nzk3MDkxfQ.eixlgCs21DeSsJJQgBS-DSq3loWQ38JQmkdMmCTF0iQ"

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
