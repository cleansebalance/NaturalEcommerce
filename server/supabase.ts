import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { log } from './vite';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  log('Error: Supabase credentials missing. Please make sure SUPABASE_URL and SUPABASE_KEY are set in your environment.', 'supabase');
  throw new Error('Supabase credentials missing');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

log('Supabase client initialized', 'supabase');