
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// В приоритете берем переменные окружения, если они заданы в системе
const supabaseUrl = (process.env as any).SUPABASE_URL || 'https://rspycgljzlzqqcnnijch.supabase.co';
const supabaseAnonKey = (process.env as any).SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzcHljZ2xqemx6cXFjbm5pamNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTUxNzUsImV4cCI6MjA4NDQ3MTE3NX0.HVMDh-b_zDPoNxXU9B9MuYsZ26OBMWCWuLF8T_FcO-Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
