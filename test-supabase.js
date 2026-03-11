import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ypakvicbrwqxlnenjuwm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwYWt2aWNicndxeGxuZW5qdXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4ODk2MTQsImV4cCI6MjA4ODQ2NTYxNH0.k1OB4YoR8il6LHe0sYzjGCMrSKk_3CLhAMCCAyDIhOQ'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
    try {
        const toInsert = {
            text: 'Test quote',
            author: 'Test author',
            fetched_at: new Date().toISOString()
        }
        const { data, error } = await supabase.from('quotes').insert([toInsert]).select();
        console.log('Insert Error:', error);
        console.log('Insert Data:', JSON.stringify(data, null, 2));
    } catch(e) { console.error('Exception', e) }
}
test();
