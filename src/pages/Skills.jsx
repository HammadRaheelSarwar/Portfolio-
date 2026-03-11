import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSkills } from '../hooks/useSkills'
import SectionTitle from '../components/ui/SectionTitle'
import ProgressBar from '../components/ui/ProgressBar'
import Loader from '../components/ui/Loader'
import TiltCard from '../components/ui/TiltCard'
import { LayoutGrid, Radar } from 'lucide-react'

const CATEGORY_ICONS = {
    Frontend: { emoji: '🎨', color: 'from-pink-500 to-rose-500', glow: 'rgba(236, 72, 153, 0.12)' },
    Backend: { emoji: '⚙️', color: 'from-blue-500 to-cyan-500', glow: 'rgba(59, 130, 246, 0.12)' },
    Database: { emoji: '🗃️', color: 'from-emerald-500 to-teal-500', glow: 'rgba(52, 211, 153, 0.12)' },
    Tools: { emoji: '🔧', color: 'from-amber-500 to-orange-500', glow: 'rgba(245, 158, 11, 0.12)' },
}

// SVG-based radar chart component
function RadarChart({ grouped }) {
    const categories = Object.keys(grouped)
    const numAxes = categories.length
    if (numAxes === 0) return null

    const size = 300
    const center = size / 2
    const maxRadius = 120
    const levels = 5

    const angleStep = (2 * Math.PI) / numAxes

    // Calculate average percentage per category
    const categoryAvg = categories.map(cat => {
        const skills = grouped[cat]
        const avg = skills.reduce((sum, s) => sum + (s.percentage || 0), 0) / skills.length
        return avg
    })

    const getPoint = (index, value) => {
        const angle = angleStep * index - Math.PI / 2
        const r = (value / 100) * maxRadius
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle),
        }
    }

    // Grid levels
    const gridPolygons = Array.from({ length: levels }, (_, level) => {
        const r = ((level + 1) / levels) * maxRadius
        const points = categories.map((_, i) => {
            const angle = angleStep * i - Math.PI / 2
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`
        })
        return points.join(' ')
    })

    // Data polygon
    const dataPoints = categoryAvg.map((avg, i) => {
        const p = getPoint(i, avg)
        return `${p.x},${p.y}`
    }).join(' ')

    // Axis labels
    const labelPositions = categories.map((cat, i) => {
        const angle = angleStep * i - Math.PI / 2
        const r = maxRadius + 30
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle),
            label: cat,
            avg: Math.round(categoryAvg[i]),
        }
    })

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex justify-center"
        >
            <svg width={size + 80} height={size + 80} viewBox={`-40 -40 ${size + 80} ${size + 80}`} className="max-w-full">
                {/* Grid levels */}
                {gridPolygons.map((points, i) => (
                    <polygon
                        key={i}
                        points={points}
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="1"
                    />
                ))}

                {/* Axis lines */}
                {categories.map((_, i) => {
                    const p = getPoint(i, 100)
                    return (
                        <line
                            key={i}
                            x1={center} y1={center}
                            x2={p.x} y2={p.y}
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="1"
                        />
                    )
                })}

                {/* Data polygon */}
                <motion.polygon
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    points={dataPoints}
                    fill="rgba(99, 102, 241, 0.15)"
                    stroke="rgba(99, 102, 241, 0.8)"
                    strokeWidth="2"
                    className="radar-polygon"
                />

                {/* Data points */}
                {categoryAvg.map((avg, i) => {
                    const p = getPoint(i, avg)
                    return (
                        <motion.circle
                            key={i}
                            initial={{ r: 0 }}
                            animate={{ r: 4 }}
                            transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                            cx={p.x}
                            cy={p.y}
                            fill="#6366f1"
                            stroke="#fff"
                            strokeWidth="2"
                        />
                    )
                })}

                {/* Labels */}
                {labelPositions.map((pos, i) => (
                    <g key={i}>
                        <text
                            x={pos.x}
                            y={pos.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="rgba(255,255,255,0.7)"
                            fontSize="12"
                            fontFamily="Inter, system-ui, sans-serif"
                            fontWeight="600"
                        >
                            {pos.label}
                        </text>
                        <text
                            x={pos.x}
                            y={pos.y + 16}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="rgba(99, 102, 241, 0.8)"
                            fontSize="11"
                            fontFamily="Inter, system-ui, sans-serif"
                            fontWeight="700"
                        >
                            {pos.avg}%
                        </text>
                    </g>
                ))}
            </svg>
        </motion.div>
    )
}

export default function Skills() {
    const { skills, loading, error } = useSkills()
    const [view, setView] = useState('cards') // 'cards' or 'radar'

    const grouped = useMemo(() => {
        return (skills || []).reduce((acc, skill) => {
            if (!acc[skill.category]) acc[skill.category] = []
            acc[skill.category].push(skill)
            return acc
        }, {})
    }, [skills])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader size="lg" />
        </div>
    )

    return (
        <div className="min-h-screen bg-surface pt-24 pb-16 relative">
            {/* Background decoration */}
            <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-indigo-600/5 rounded-full blur-[120px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <SectionTitle
                    title="My Skills"
                    subtitle="Technologies and tools I work with"
                />

                {error && (
                    <p className="text-center text-red-400 mb-8">{error}</p>
                )}

                {/* View toggle */}
                <div className="flex justify-center mb-10">
                    <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                        <button
                            onClick={() => setView('cards')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${view === 'cards'
                                    ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <LayoutGrid size={14} />
                            Cards
                        </button>
                        <button
                            onClick={() => setView('radar')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${view === 'radar'
                                    ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <Radar size={14} />
                            Radar
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {view === 'cards' ? (
                        <motion.div
                            key="cards"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {Object.entries(grouped).map(([category, catSkills], i) => {
                                const meta = CATEGORY_ICONS[category] || { emoji: '💡', color: 'from-indigo-500 to-purple-500', glow: 'rgba(99, 102, 241, 0.12)' }
                                return (
                                    <motion.div
                                        key={category}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                    >
                                        <TiltCard glareColor={meta.glow}>
                                            <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all duration-400 relative overflow-hidden">
                                                {/* Top gradient accent */}
                                                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${meta.color} opacity-60`} />

                                                {/* Category header */}
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                        {meta.emoji}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-display font-bold text-white">{category}</h3>
                                                        <p className="text-xs text-gray-500">{catSkills.length} skills</p>
                                                    </div>
                                                </div>

                                                {/* Progress bars */}
                                                <div>
                                                    {catSkills.map(skill => (
                                                        <ProgressBar
                                                            key={skill.id}
                                                            label={skill.name}
                                                            percentage={skill.percentage}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </TiltCard>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="radar"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="glass-card rounded-2xl p-8 max-w-2xl mx-auto">
                                <RadarChart grouped={grouped} />

                                {/* Skill details below radar */}
                                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {Object.entries(grouped).map(([category, catSkills]) => {
                                        const meta = CATEGORY_ICONS[category] || { emoji: '💡', color: 'from-indigo-500 to-purple-500' }
                                        return (
                                            <div key={category} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-sm">{meta.emoji}</span>
                                                    <span className="text-white font-semibold text-sm">{category}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {catSkills.map(skill => (
                                                        <span
                                                            key={skill.id}
                                                            className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-gray-300 text-xs"
                                                        >
                                                            {skill.name} · {skill.percentage}%
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
