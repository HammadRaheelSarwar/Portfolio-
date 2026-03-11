import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Code2, Command, Quote as QuoteIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Modal from './ui/Modal'
import { useQuotes } from '../hooks/useQuotes'
import { useSettings } from '../hooks/useSettings'

const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Skills', to: '/skills' },
    { label: 'Projects', to: '/projects' },
    { label: 'Experience', to: '/experience' },
    { label: 'Education', to: '/education' },
    { label: 'Achievements', to: '/achievements' },
    { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [quoteModalOpen, setQuoteModalOpen] = useState(false)
    const location = useLocation()
    const { currentQuote, loading: quotesLoading } = useQuotes()
    const { settings } = useSettings()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => { setMenuOpen(false) }, [location])

    const isActive = (to) =>
        to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'bg-surface/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
                    : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link
                            to="/"
                            className="flex items-center gap-3 group"
                        >
                            {settings?.profile_image_url ? (
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-white/5 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow duration-300 p-0.5 shrink-0">
                                    <img 
                                        src={settings.profile_image_url} 
                                        alt="Profile" 
                                        className="w-full h-full rounded-[10px] object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow duration-300 shrink-0">
                                    <Code2 size={16} className="text-white" />
                                </div>
                            )}
                            <div className="flex flex-col justify-center">
                                <span className="font-display font-bold text-lg gradient-text group-hover:opacity-80 transition-opacity duration-300 leading-tight">
                                    {settings?.name ? settings.name.split(' ')[0] : 'Hammad'}
                                </span>
                                <span className="text-[11px] font-semibold text-indigo-400 tracking-wider uppercase leading-tight mt-0.5">
                                    CS Student
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-0.5">
                            {navLinks.map(({ label, to }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive(to)
                                        ? 'text-white'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {label}
                                    {isActive(to) && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            ))}
                            {/* Today Best Quote button */}
                            <button
                                onClick={() => setQuoteModalOpen(true)}
                                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 text-gray-400 hover:text-white flex items-center gap-2`}
                            >
                                <QuoteIcon size={14} className="text-indigo-400" />
                                <span>Today's Quote</span>
                            </button>
                            {/* Command Palette hint */}
                            <button
                                onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
                                className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-gray-500 hover:text-white hover:bg-white/[0.08] transition-all duration-200 text-xs font-mono"
                                title="Search (Ctrl+K)"
                            >
                                <Command size={12} />
                                <span>K</span>
                            </button>
                        </nav>

                        {/* Mobile menu toggle */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setMenuOpen(v => !v)}
                                className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                                aria-label="Toggle menu"
                            >
                                {menuOpen ? <X size={18} /> : <Menu size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-x-0 top-16 z-40 bg-surface/95 backdrop-blur-2xl border-b border-white/[0.06] md:hidden"
                    >
                        <nav className="flex flex-col gap-1 p-4">
                            {navLinks.map(({ label, to }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(to)
                                        ? 'text-white bg-indigo-600/10 border border-indigo-500/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
                                        }`}
                                >
                                    {label}
                                </Link>
                            ))}
                            <button
                                onClick={() => {
                                    setMenuOpen(false)
                                    setQuoteModalOpen(true)
                                }}
                                className="px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left text-gray-400 hover:text-white hover:bg-white/[0.06] flex items-center gap-2"
                            >
                                <QuoteIcon size={16} className="text-indigo-400" />
                                <span>Today's Quote</span>
                            </button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quote Modal */}
            <Modal open={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} title="Today's Best Quote">
                <div className="py-4 text-center">
                    {quotesLoading ? (
                        <div className="flex flex-col items-center justify-center space-y-3 py-8">
                            <div className="w-8 h-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                            <p className="text-gray-400 text-sm">Finding inspiration...</p>
                        </div>
                    ) : currentQuote ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-8 rounded-2xl border border-indigo-500/10 relative overflow-hidden"
                        >
                            <QuoteIcon size={40} className="text-indigo-400/20 absolute top-4 left-4" />
                            <blockquote className="relative z-10 px-4">
                                <p className="text-2xl font-serif text-white tracking-wide leading-relaxed italic mb-6">
                                    "{currentQuote.text}"
                                </p>
                                <footer className="text-indigo-400 font-medium tracking-widest uppercase text-sm">
                                    — {currentQuote.author || 'Unknown'}
                                </footer>
                            </blockquote>
                        </motion.div>
                    ) : (
                        <p className="text-gray-400">No quote available right now. Please try again later.</p>
                    )}
                </div>
            </Modal>
        </>
    )
}
