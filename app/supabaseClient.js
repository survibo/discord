import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mvodnekhxfhxfkpfvpyn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12b2RuZWtoeGZoeGZrcGZ2cHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMzI2MjYsImV4cCI6MjA3MTYwODYyNn0.hcZDEtXTuvsS6_6ZcUUrhP3shZ-vpofFkeSqDq_lT8o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)