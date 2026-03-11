import { motion, AnimatePresence } from 'framer-motion'
import { Award, ExternalLink } from 'lucide-react'
import { useAchievements } from '../hooks/useAchievements'
import SectionTitle from '../components/ui/SectionTitle'
import Loader from '../components/ui/Loader'
import TiltCard from '../components/ui/TiltCard'

export default function Achievements() {
    const { achievements, loading, error } = useAchievements()

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader size="lg" />
        </div>
    )

    return (
        <div className="min-h-screen bg-surface pt-24 pb-16 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <SectionTitle
                    title="Achievements"
                    subtitle="Milestones, awards, and certifications I'm proud of"
                />

                {error && <p className="text-center text-red-400 mb-8">{error}</p>}

                {achievements.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20 bg-white/[0.02] border border-white/10 rounded-3xl"
                    >
                        <Award size={48} className="mx-auto text-indigo-500/30 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No achievements listed yet</h3>
                        <p className="text-gray-400">Check back soon for updates on milestones and awards.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {achievements.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                >
                                    <TiltCard className="h-full" glareColor="rgba(99, 102, 241, 0.15)">
                                        <div className="group h-full p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden flex flex-col">
                                            {/* Hover Highlight Gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            
                                            <div className="relative z-10 flex items-start gap-4 mb-6">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center shrink-0 shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-500">
                                                    <Award size={24} className="text-indigo-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors duration-300 leading-tight mb-1">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-indigo-400 font-medium text-sm">
                                                        {item.issuer}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="relative z-10 flex-1 flex flex-col justify-between">
                                                {item.description && (
                                                    <p className="text-gray-400 text-sm leading-relaxed mb-6 group-hover:text-gray-300 transition-colors">
                                                        {item.description}
                                                    </p>
                                                )}
                                                
                                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                                                    <span className="text-sm font-medium text-gray-500 group-hover:text-gray-400">
                                                        {item.date || 'Ongoing'}
                                                    </span>
                                                    
                                                    {item.link && (
                                                        <a 
                                                            href={item.link} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-all"
                                                        >
                                                            View Credential <ExternalLink size={12} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </TiltCard>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    )
}
