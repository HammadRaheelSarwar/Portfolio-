import { useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Briefcase, MapPin, Calendar, ChevronDown } from 'lucide-react'
import { useExperience } from '../hooks/useExperience'
import SectionTitle from '../components/ui/SectionTitle'
import Loader from '../components/ui/Loader'
import { useRef } from 'react'

export default function Experience() {
    const { experience, loading, error } = useExperience()
    const [expandedId, setExpandedId] = useState(null)
    const containerRef = useRef(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start']
    })

    const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader size="lg" />
        </div>
    )

    return (
        <div className="min-h-screen bg-surface pt-24 pb-16 relative">
            {/* Background decoration */}
            <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px]" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <SectionTitle
                    title="Experience"
                    subtitle="My professional journey"
                />

                {error && <p className="text-center text-red-400 mb-8">{error}</p>}

                {experience.length === 0 ? (
                    <p className="text-center text-gray-500 py-20">No experience entries yet.</p>
                ) : (
                    <div className="relative" ref={containerRef}>
                        {/* Animated vertical line that fills on scroll */}
                        <div className="absolute left-6 top-0 bottom-0 w-px hidden sm:block">
                            {/* Background track */}
                            <div className="w-full h-full bg-white/[0.06]" />
                            {/* Animated fill */}
                            <motion.div
                                className="absolute top-0 left-0 w-full bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500"
                                style={{ height: lineHeight }}
                            />
                        </div>

                        <div className="space-y-6">
                            {experience.map((exp, i) => {
                                const isExpanded = expandedId === exp.id
                                const isCurrent = !exp.end_date

                                return (
                                    <motion.div
                                        key={exp.id}
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="relative sm:pl-20"
                                    >
                                        {/* Timeline dot */}
                                        <div className="absolute left-3 top-7 hidden sm:block">
                                            <div className={`w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-surface flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.5)] ${isCurrent ? 'pulse-ring' : ''}`}>
                                                <Briefcase size={8} className="text-white" />
                                            </div>
                                        </div>

                                        {/* Card */}
                                        <motion.div
                                            className="glass-card p-6 rounded-2xl cursor-pointer"
                                            onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                                            whileHover={{ scale: 1.01 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="text-xl font-display font-bold text-white">{exp.role}</h3>
                                                        {isCurrent && (
                                                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold animate-pulse">
                                                                Current
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="gradient-text-alt font-semibold">{exp.company}</p>
                                                </div>
                                                <div className="flex flex-col gap-1 text-sm text-gray-400 shrink-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={13} className="text-gray-500" />
                                                        <span className="font-mono text-xs">
                                                            {exp.start_date} — {exp.end_date || 'Present'}
                                                        </span>
                                                    </div>
                                                    {exp.location && (
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin size={13} className="text-gray-500" />
                                                            <span>{exp.location}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Expand/Collapse indicator */}
                                            {exp.description && (
                                                <div className="flex items-center gap-2 mt-2">
                                                    <motion.div
                                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <ChevronDown size={16} className="text-gray-500" />
                                                    </motion.div>
                                                    <span className="text-xs text-gray-500">
                                                        {isExpanded ? 'Click to collapse' : 'Click to read more'}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Expandable description */}
                                            <AnimatePresence>
                                                {isExpanded && exp.description && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                                        className="overflow-hidden"
                                                    >
                                                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line mt-4 pt-4 border-t border-white/[0.06]">
                                                            {exp.description}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
