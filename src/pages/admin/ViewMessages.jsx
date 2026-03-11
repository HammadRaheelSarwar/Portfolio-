import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, User, MessageSquare, Clock, CheckCircle, Quote, RefreshCw, Wifi, WifiOff, Sparkles, ChevronRight, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { toast } from 'react-hot-toast'
import Loader from '../../components/ui/Loader'
import { useQuotes } from '../../hooks/useQuotes'

export default function ViewMessages() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)

    const {
        currentQuote,
        nextQuote,
        loading: quotesLoading,
        supabaseStatus,
        lastChecked,
        refreshQuotes,
        recheckStatus,
        quoteCount,
    } = useQuotes()

    const fetchMessages = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false })
        if (error) toast.error(error.message)
        else setMessages(data || [])
        setLoading(false)
    }

    useEffect(() => { fetchMessages() }, [])

    const markRead = async (id) => {
        await supabase.from('messages').update({ read: true }).eq('id', id)
        setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
    }

    const deleteMessage = async (id) => {
        const { error } = await supabase.from('messages').delete().eq('id', id)
        if (error) {
            toast.error('Failed to delete message')
        } else {
            setMessages(prev => prev.filter(m => m.id !== id))
            toast.success('Message deleted')
        }
    }

    const formatDate = (ts) => new Date(ts).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })

    const timeSince = (date) => {
        if (!date) return ''
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
        if (seconds < 60) return 'just now'
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
        return `${Math.floor(seconds / 3600)}h ago`
    }

    if (loading) return <Loader />

    const unread = messages.filter(m => !m.read).length

    return (
        <div className="space-y-6">
            {/* Header row with Supabase status */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Today Best Quote</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {messages.length} total messages {unread > 0 && <span className="text-indigo-400">· {unread} unread</span>}
                    </p>
                </div>

                {/* Supabase connection status */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={recheckStatus}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm transition-all hover:bg-white/[0.08]"
                    >
                        {supabaseStatus === 'active' ? (
                            <>
                                <div className="relative">
                                    <Wifi size={14} className="text-emerald-400" />
                                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                </div>
                                <span className="text-emerald-400 font-medium">Supabase Active</span>
                            </>
                        ) : supabaseStatus === 'checking' ? (
                            <>
                                <RefreshCw size={14} className="text-amber-400 animate-spin" />
                                <span className="text-amber-400 font-medium">Checking...</span>
                            </>
                        ) : (
                            <>
                                <WifiOff size={14} className="text-red-400" />
                                <span className="text-red-400 font-medium">Disconnected</span>
                            </>
                        )}
                    </button>
                    {lastChecked && (
                        <span className="text-gray-600 text-xs hidden sm:inline">
                            Checked {timeSince(lastChecked)}
                        </span>
                    )}
                </div>
            </div>

            {/* Motivational Quote Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 border border-indigo-500/20 p-6"
            >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />

                <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                                <Sparkles size={14} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-white text-sm font-semibold">Daily Inspiration</h3>
                                <p className="text-gray-500 text-[10px]">
                                    {quoteCount} quotes · Auto-refreshes every 12h
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                nextQuote()
                                refreshQuotes()
                            }}
                            disabled={quotesLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06] transition-all"
                        >
                            <RefreshCw size={12} className={quotesLoading ? 'animate-spin' : ''} />
                            New Quote
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {currentQuote ? (
                            <motion.div
                                key={currentQuote.text?.slice(0, 20)}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex gap-3">
                                    <Quote size={24} className="text-indigo-400/40 shrink-0 mt-1" />
                                    <blockquote>
                                        <p className="text-gray-200 text-lg leading-relaxed font-medium italic">
                                            "{currentQuote.text}"
                                        </p>
                                        <footer className="mt-3 text-sm text-indigo-300 font-medium">
                                            — {currentQuote.author || 'Unknown'}
                                        </footer>
                                    </blockquote>
                                </div>
                            </motion.div>
                        ) : quotesLoading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-3 text-gray-500"
                            >
                                <RefreshCw size={16} className="animate-spin" />
                                <span className="text-sm">Loading inspiration...</span>
                            </motion.div>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                No quotes available. Click "New Quote" to fetch.
                            </p>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Messages List */}
            {messages.length === 0 ? (
                <div className="text-center py-20">
                    <Mail size={48} className="text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">No messages yet. Contact form submissions appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.map(msg => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-5 rounded-2xl border transition-all duration-300 ${msg.read
                                ? 'bg-white/[0.02] border-white/[0.06]'
                                : 'bg-indigo-500/5 border-indigo-500/20'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <div className="flex items-center gap-2">
                                            <User size={14} className="text-indigo-400" />
                                            <span className="text-white font-semibold">{msg.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className="text-gray-500" />
                                            <a href={`mailto:${msg.email}`} className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">{msg.email}</a>
                                        </div>
                                        {!msg.read && (
                                            <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white text-xs font-medium">New</span>
                                        )}
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{msg.message}</p>
                                    <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500">
                                        <Clock size={12} />
                                        {formatDate(msg.created_at)}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {!msg.read && (
                                        <button
                                            onClick={() => markRead(msg.id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-green-400 hover:bg-green-500/10 border border-white/10 hover:border-green-500/20 transition-all"
                                        >
                                            <CheckCircle size={13} />
                                            Mark Read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteMessage(msg.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 transition-all"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
