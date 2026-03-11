import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search, Home, User, Code, FolderGit2, Briefcase, GraduationCap, Mail,
    Command, ArrowUp, ArrowDown, CornerDownLeft, X
} from 'lucide-react'

const pages = [
    { name: 'Home', path: '/', icon: Home, keywords: ['home', 'landing', 'main'] },
    { name: 'About Me', path: '/about', icon: User, keywords: ['about', 'bio', 'profile', 'info'] },
    { name: 'Skills', path: '/skills', icon: Code, keywords: ['skills', 'technologies', 'tech', 'stack'] },
    { name: 'Projects', path: '/projects', icon: FolderGit2, keywords: ['projects', 'work', 'portfolio'] },
    { name: 'Experience', path: '/experience', icon: Briefcase, keywords: ['experience', 'work', 'career', 'jobs'] },
    { name: 'Education', path: '/education', icon: GraduationCap, keywords: ['education', 'school', 'degree', 'university'] },
    { name: 'Contact', path: '/contact', icon: Mail, keywords: ['contact', 'message', 'email', 'reach'] },
]

export default function CommandPalette() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const inputRef = useRef(null)
    const listRef = useRef(null)
    const navigate = useNavigate()

    const filtered = useMemo(() => {
        if (!query.trim()) return pages
        const q = query.toLowerCase()
        return pages.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.keywords.some(k => k.includes(q))
        )
    }, [query])

    useEffect(() => {
        setSelectedIndex(0)
    }, [query])

    const handleOpen = useCallback(() => {
        setOpen(true)
        setQuery('')
        setSelectedIndex(0)
    }, [])

    const handleClose = useCallback(() => {
        setOpen(false)
        setQuery('')
    }, [])

    const handleSelect = useCallback((path) => {
        navigate(path)
        handleClose()
    }, [navigate, handleClose])

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Open with Ctrl+K or Cmd+K
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                if (open) handleClose()
                else handleOpen()
            }
            // Close with Escape
            if (e.key === 'Escape' && open) {
                handleClose()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [open, handleOpen, handleClose])

    // Focus input when opened
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 50)
        }
    }, [open])

    // Handle navigation inside the palette
    const handleInputKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex(i => Math.min(i + 1, filtered.length - 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex(i => Math.max(i - 1, 0))
        } else if (e.key === 'Enter' && filtered[selectedIndex]) {
            e.preventDefault()
            handleSelect(filtered[selectedIndex].path)
        }
    }

    // Scroll selected item into view
    useEffect(() => {
        const listEl = listRef.current
        if (!listEl) return
        const selectedEl = listEl.children[selectedIndex]
        if (selectedEl) {
            selectedEl.scrollIntoView({ block: 'nearest' })
        }
    }, [selectedIndex])

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-[101]"
                    >
                        <div className="mx-4 rounded-2xl bg-surface-100/95 backdrop-blur-2xl border border-white/[0.08] shadow-2xl shadow-black/50 overflow-hidden">
                            {/* Search input */}
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
                                <Search size={18} className="text-gray-500 shrink-0" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    onKeyDown={handleInputKeyDown}
                                    placeholder="Search pages..."
                                    className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 outline-none"
                                />
                                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.06] text-gray-500 text-xs font-mono">
                                    ESC
                                </kbd>
                            </div>

                            {/* Results */}
                            <div ref={listRef} className="max-h-[300px] overflow-y-auto py-2 px-2">
                                {filtered.length === 0 ? (
                                    <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                        No results found for "{query}"
                                    </div>
                                ) : (
                                    filtered.map((page, i) => {
                                        const Icon = page.icon
                                        const isSelected = i === selectedIndex
                                        return (
                                            <button
                                                key={page.path}
                                                onClick={() => handleSelect(page.path)}
                                                onMouseEnter={() => setSelectedIndex(i)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-150 ${isSelected
                                                        ? 'bg-indigo-600/15 text-white'
                                                        : 'text-gray-400 hover:text-white'
                                                    }`}
                                            >
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-150 ${isSelected
                                                        ? 'bg-indigo-600/20 text-indigo-400'
                                                        : 'bg-white/[0.04] text-gray-500'
                                                    }`}>
                                                    <Icon size={16} />
                                                </div>
                                                <span className="font-medium">{page.name}</span>
                                                {isSelected && (
                                                    <CornerDownLeft size={14} className="ml-auto text-gray-500" />
                                                )}
                                            </button>
                                        )
                                    })
                                )}
                            </div>

                            {/* Footer hints */}
                            <div className="px-5 py-3 border-t border-white/[0.06] flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <ArrowUp size={10} />
                                    <ArrowDown size={10} />
                                    navigate
                                </span>
                                <span className="flex items-center gap-1">
                                    <CornerDownLeft size={10} />
                                    select
                                </span>
                                <span className="flex items-center gap-1">
                                    ESC close
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
