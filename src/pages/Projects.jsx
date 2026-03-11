import { useState, useMemo } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Github, ExternalLink, Code, Star } from 'lucide-react'
import { useProjects } from '../hooks/useProjects'
import SectionTitle from '../components/ui/SectionTitle'
import Badge from '../components/ui/Badge'
import Loader from '../components/ui/Loader'
import TiltCard from '../components/ui/TiltCard'

const FILTER_TABS = ['All', 'Frontend', 'Backend', 'Full-Stack']

export default function Projects() {
    const { projects, loading, error } = useProjects()
    const [activeFilter, setActiveFilter] = useState('All')

    const filtered = useMemo(() => {
        if (activeFilter === 'All') return projects
        return projects.filter(p => {
            const stack = (p.tech_stack || []).map(t => t.toLowerCase())
            const desc = (p.description || '').toLowerCase()
            const title = (p.title || '').toLowerCase()

            if (activeFilter === 'Frontend') {
                return stack.some(t => ['react', 'vue', 'angular', 'next.js', 'html', 'css', 'tailwind', 'javascript', 'typescript', 'svelte'].includes(t)) ||
                    desc.includes('frontend') || title.includes('frontend')
            }
            if (activeFilter === 'Backend') {
                return stack.some(t => ['node.js', 'express', 'django', 'flask', 'python', 'java', 'spring', 'fastapi', 'mongodb', 'postgresql'].includes(t)) ||
                    desc.includes('backend') || desc.includes('api') || title.includes('backend')
            }
            if (activeFilter === 'Full-Stack') {
                return stack.some(t => ['react', 'vue', 'next.js'].includes(t)) &&
                    stack.some(t => ['node.js', 'express', 'django', 'supabase', 'firebase', 'mongodb', 'postgresql'].includes(t)) ||
                    desc.includes('full-stack') || desc.includes('fullstack') || title.includes('full-stack')
            }
            return true
        })
    }, [projects, activeFilter])

    // Count projects per category
    const getCounts = (filter) => {
        if (filter === 'All') return projects.length
        return projects.filter(p => {
            const stack = (p.tech_stack || []).map(t => t.toLowerCase())
            const desc = (p.description || '').toLowerCase()
            if (filter === 'Frontend') return stack.some(t => ['react', 'vue', 'angular', 'next.js', 'html', 'css', 'tailwind', 'javascript', 'typescript'].includes(t)) || desc.includes('frontend')
            if (filter === 'Backend') return stack.some(t => ['node.js', 'express', 'django', 'flask', 'python', 'mongodb', 'postgresql'].includes(t)) || desc.includes('backend') || desc.includes('api')
            if (filter === 'Full-Stack') return (stack.some(t => ['react', 'vue', 'next.js'].includes(t)) && stack.some(t => ['node.js', 'express', 'supabase', 'firebase', 'mongodb'].includes(t))) || desc.includes('full-stack')
            return true
        }).length
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader size="lg" />
        </div>
    )

    return (
        <div className="min-h-screen bg-surface pt-24 pb-16 relative">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <SectionTitle
                    title="My Projects"
                    subtitle="A collection of things I've built"
                />

                {error && <p className="text-center text-red-400 mb-8">{error}</p>}

                {/* Filter Tabs */}
                <div className="flex justify-center mb-10">
                    <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] relative">
                        {FILTER_TABS.map(tab => {
                            const isActive = activeFilter === tab
                            const count = getCounts(tab)
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveFilter(tab)}
                                    className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive
                                            ? 'text-white'
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="project-filter-bg"
                                            className="absolute inset-0 bg-indigo-600/20 border border-indigo-500/30 rounded-lg"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{tab}</span>
                                    <span className={`relative z-10 text-xs px-1.5 py-0.5 rounded-md ${isActive ? 'bg-indigo-500/30 text-indigo-300' : 'bg-white/[0.06] text-gray-500'
                                        }`}>
                                        {count}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-gray-500 py-20"
                    >
                        No projects match this filter. Check back soon!
                    </motion.p>
                ) : (
                    <LayoutGroup>
                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filtered.map((project, i) => (
                                    <motion.div
                                        key={project.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4, delay: i * 0.05 }}
                                    >
                                        <TiltCard className="h-full" glareColor="rgba(99, 102, 241, 0.12)">
                                            <div className="group rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-400 flex flex-col h-full">
                                                {/* Project Image */}
                                                <div className="relative h-52 bg-gradient-to-br from-surface-300 to-surface-200 overflow-hidden">
                                                    {project.image_url ? (
                                                        <img
                                                            src={project.image_url}
                                                            alt={project.title}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-950/50 to-purple-950/50">
                                                            <Code size={40} className="text-indigo-500/30" />
                                                        </div>
                                                    )}

                                                    {/* Hover overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-start p-5">
                                                        <div className="flex gap-3">
                                                            {project.github_url && (
                                                                <a
                                                                    href={project.github_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-1.5"
                                                                >
                                                                    <Github size={14} /> Code
                                                                </a>
                                                            )}
                                                            {project.demo_url && (
                                                                <a
                                                                    href={project.demo_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="px-4 py-2 rounded-lg bg-indigo-600/80 backdrop-blur-sm text-white text-sm font-medium hover:bg-indigo-500 transition-colors flex items-center gap-1.5"
                                                                >
                                                                    <ExternalLink size={14} /> Live Demo
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Featured badge */}
                                                    {project.featured && (
                                                        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-lg">
                                                            <Star size={11} className="fill-white" />
                                                            Featured
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="p-6 flex flex-col flex-1">
                                                    <h3 className="text-lg font-display font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">
                                                        {project.title}
                                                    </h3>
                                                    <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1 line-clamp-3">
                                                        {project.description}
                                                    </p>

                                                    {/* Tech Stack */}
                                                    {project.tech_stack?.length > 0 && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {project.tech_stack.map(tech => (
                                                                <Badge key={tech}>{tech}</Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </TiltCard>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </LayoutGroup>
                )}
            </div>
        </div>
    )
}
