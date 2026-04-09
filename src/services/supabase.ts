import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vbnvbyyffohwcwibxxjr.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_GvaKnESnTWo1RBCH9AOZLQ_AfbuL6NT'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
