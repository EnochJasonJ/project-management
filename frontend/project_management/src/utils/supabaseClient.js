import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ryjsvtgsktzurehnkkcw.supabase.co'
const supabaseKey = 'sb_publishable_eyckXs4xQE6-u8tyIxCEQg_7xmjjUo9'

export const supabase = createClient(supabaseUrl, supabaseKey)
