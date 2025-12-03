import { createClient } from '@supabase/supabase-js/dist/module';
import 'react-native-url-polyfill/auto'; // Needed for React Native
import type { Database } from '../types/database';

// Use Babel inline env since process.env isn’t available in RN
const supabaseUrl = "https://yezcbbljwyhnxyaqkgsb.supabase.co"
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllemNiYmxqd3lobnh5YXFrZ3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNTExMDIsImV4cCI6MjA3ODcyNzEwMn0.PJL9nHBrbcaVeGCl9jwNjGbOVoOWTDGcF74UKOQMSeQ"

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);
