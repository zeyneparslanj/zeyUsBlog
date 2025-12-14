
import { createClient } from '@supabase/supabase-js';

// GÜNCEL KİMLİK BİLGİLERİ
const SUPABASE_URL = 'https://ozciadxxjlfxeqkkmewx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96Y2lhZHh4amxmeGVxa2ttZXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMDA2MjEsImV4cCI6MjA4MDg3NjYyMX0.p0S6GEuXpoxaU_Objbu8FIBUwyD45OU1y5pr4WNtReM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
