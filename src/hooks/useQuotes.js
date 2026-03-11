import { useState, useEffect, useCallback } from 'react'
import { supabase, hasCredentials } from '../lib/supabaseClient'

// Using API Ninjas Quotes API (v2 endpoint)
const QUOTES_API = 'https://api.api-ninjas.com/v2/quotes?categories=success%2Cwisdom'
const API_NINJAS_KEY = 'oDewyrOa1m0xUe7RPxyixcyaIDas2DKKTa6WqrQR'
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000

// Fallback quotes if API and Supabase both fail
const FALLBACK_QUOTES = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", id: 'fb-1' },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", id: 'fb-2' },
    { text: "Make it work, make it right, make it fast.", author: "Kent Beck", id: 'fb-3' },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson", id: 'fb-4' },
    { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House", id: 'fb-5' },
    { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman", id: 'fb-6' },
]

/**
 * Hook to manage motivational quotes stored in Supabase.
 * - Fetches from ZenQuotes API
 * - Stores in Supabase `quotes` table
 * - Auto-cleans quotes older than 24 hours
 * - Refreshes quotes if oldest is older than 12 hours
 * - Reports Supabase connection status
 */
export function useQuotes() {
    const [quotes, setQuotes] = useState([])
    const [currentQuote, setCurrentQuote] = useState(null)
    const [loading, setLoading] = useState(true)
    const [supabaseStatus, setSupabaseStatus] = useState('checking') // 'active' | 'inactive' | 'checking'
    const [lastChecked, setLastChecked] = useState(null)

    // Check Supabase connection status
    const checkSupabaseStatus = useCallback(async () => {
        if (!hasCredentials || !supabase) {
            setSupabaseStatus('inactive')
            return false
        }
        try {
            const { error } = await supabase.from('messages').select('id', { count: 'exact', head: true })
            if (error) throw error
            setSupabaseStatus('active')
            setLastChecked(new Date())
            return true
        } catch {
            setSupabaseStatus('inactive')
            return false
        }
    }, [])

    // Clean up quotes older than 24 hours
    const cleanupOldQuotes = useCallback(async () => {
        if (!supabase) return
        const cutoff = new Date(Date.now() - TWENTY_FOUR_HOURS_MS).toISOString()
        const { error } = await supabase.from('quotes').delete().lt('fetched_at', cutoff)
        if (error) {
            console.error('[Quotes] Supabase delete error:', error.message)
        }
    }, [])

    // Fetch quotes from API and store in Supabase
    const fetchAndStoreQuotes = useCallback(async () => {
        try {
            const res = await fetch(QUOTES_API, {
                headers: {
                    'X-Api-Key': API_NINJAS_KEY
                }
            })
            if (!res.ok) throw new Error('API fetch failed')

            const data = await res.json()

            // API Ninjas returns array of objects: { quote: "text", author: "name", category: "cat" }
            const validQuotes = data
                .filter(q => q.quote && q.author)
                .map(q => ({
                    text: q.quote,
                    author: q.author,
                }))

            if (validQuotes.length === 0) return []

            // We only want 1 quote every 12 hours
            const singleQuote = validQuotes[0]

            // Store in Supabase if connected
            if (supabase) {
                const toInsert = {
                    text: singleQuote.text,
                    author: singleQuote.author,
                    fetched_at: new Date().toISOString(),
                }
                const { error } = await supabase.from('quotes').insert([toInsert])
                if (error) {
                    console.error('[Quotes] Supabase insert error:', error.message)
                }
            }

            return [singleQuote]
        } catch (err) {
            console.warn('[Quotes] Failed to fetch from API, falling back to local:', err.message)
            return [] // Return empty to trigger fallback logic
        }
    }, [])

    // Load quotes from Supabase or fetch new ones
    const loadQuotes = useCallback(async () => {
        setLoading(true)

        // First cleanup old quotes
        await cleanupOldQuotes()

        let storedQuotes = []
        let needsRefresh = true

        // Try to get existing quotes from Supabase
        if (supabase) {
            // Get quotes from the last 24 hours
            const cutoff24 = new Date(Date.now() - TWENTY_FOUR_HOURS_MS).toISOString()
            const { data, error } = await supabase
                .from('quotes')
                .select('*')
                .gte('fetched_at', cutoff24)
                .order('fetched_at', { ascending: false })

            if (error) {
                console.error('[Quotes] Supabase select error:', error.message)
            }

            storedQuotes = data || []

            // If we have quotes, check if the newest one is older than 12 hours
            if (storedQuotes.length > 0) {
                const newestQuoteDate = new Date(storedQuotes[0].fetched_at)
                const twelveHoursAgo = new Date(Date.now() - TWELVE_HOURS_MS)

                // If the newest quote was fetched less than 12 hours ago, no refresh needed
                if (newestQuoteDate > twelveHoursAgo) {
                    needsRefresh = false
                }
            }
        }

        // If no stored quotes, OR if it's been more than 12 hours since last fetch, fetch new ones
        if (needsRefresh) {
            const fresh = await fetchAndStoreQuotes()

            if (fresh.length > 0) {
                // Prepend fresh quotes to stored stack
                const freshFormatted = fresh.map((q, i) => ({
                    id: `temp-${i}`,
                    text: q.text,
                    author: q.author,
                    fetched_at: new Date().toISOString(),
                }))
                storedQuotes = [...freshFormatted, ...storedQuotes]
            } else if (storedQuotes.length === 0) {
                // Total failure (API down + DB empty/unconnected) -> Use a single fallback quote
                const todayBackup = FALLBACK_QUOTES[new Date().getDay() % FALLBACK_QUOTES.length]
                storedQuotes = [todayBackup]
            }
        }

        setQuotes(storedQuotes)

        // Set the most recent quote as the current quote (no random rotation across the whole day)
        if (storedQuotes.length > 0) {
            setCurrentQuote(storedQuotes[0]) // Index 0 is the newest due to order('fetched_at', { ascending: false })
        }

        setLoading(false)
    }, [cleanupOldQuotes, fetchAndStoreQuotes])

    // Manual rotation triggers a new fetch if requested, but normally we just show the 12h one
    const nextQuote = useCallback(() => {
        // If user manually clicks "next", we can fetch a fresh one from the API immediately
        loadQuotes()
    }, [loadQuotes])

    // Initialize
    useEffect(() => {
        checkSupabaseStatus()
        loadQuotes()

        // Re-check Supabase status every 5 minutes
        const statusInterval = setInterval(checkSupabaseStatus, 5 * 60 * 1000)

        // Check for new 12h interval every minute (re-runs loadQuotes which checks the timestamp)
        const refreshInterval = setInterval(loadQuotes, 60 * 1000)

        // Cleanup old quotes (24h+) every hour
        const cleanupInterval = setInterval(cleanupOldQuotes, 60 * 60 * 1000)

        return () => {
            clearInterval(statusInterval)
            clearInterval(refreshInterval)
            clearInterval(cleanupInterval)
        }
    }, [checkSupabaseStatus, loadQuotes, cleanupOldQuotes])

    return {
        quotes,
        currentQuote,
        nextQuote,
        loading,
        supabaseStatus,
        lastChecked,
        refreshQuotes: loadQuotes,
        recheckStatus: checkSupabaseStatus,
        quoteCount: quotes.length,
    }
}
