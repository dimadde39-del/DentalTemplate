import { createClient } from '@supabase/supabase-js';

// Мы прописываем данные напрямую, чтобы избежать проблем с .env файлами
const supabaseUrl = 'https://knbmutnhitqeqbejeqnd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuYm11dG5oaXRxZXFiZWplcW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNDEyMDMsImV4cCI6MjA4ODcxNzIwM30.i06wf21mqm6mqdmDxI_Kf7mr-c72GHjf8QxCMCv4tes';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);