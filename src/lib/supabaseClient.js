import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const hasCredentials = !!(supabaseUrl && supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20)

if (!hasCredentials) {
    console.warn(
        '%c[Portfolio] Supabase credentials not configured.\n' +
        'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.\n' +
        'Pages will show demo data until Supabase is connected.',
        'color: #f59e0b; font-weight: bold'
    )
}

export const supabase = hasCredentials
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export { hasCredentials }
