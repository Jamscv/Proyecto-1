
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://evrsdukermndlanghwik.supabase.co';
const supabaseKey = 'sb_publishable_a9ns6tpKyxi0E1XorHjv0A_FlOFtBuu';

export const supabase = createClient(supabaseUrl, supabaseKey);
