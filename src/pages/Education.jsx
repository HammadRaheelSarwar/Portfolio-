import { motion } from 'framer-motion'
import { GraduationCap, Calendar, Award } from 'lucide-react'
import { useEducation } from '../hooks/useEducation'
import SectionTitle from '../components/ui/SectionTitle'
import Loader from '../components/ui/Loader'

export default function Education() {
    const { education, loading, error } = useEducation()

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader size="lg" />
        </div>
    )

    return (
        <div className="min-h-screen bg-surface pt-24 pb-16 relative">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-indigo-600/5 rounded-full blur-[120px]" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <SectionTitle
                    title="Education"
                    subtitle="My academic background"
                />

                {error && <p className="text-center text-red-400 mb-8">{error}</p>}

                {education.length === 0 ? (
                    <p className="text-center text-gray-500 py-20">No education entries yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {education.map((edu, i) => (
                            <motion.div
                                key={edu.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                                className="glass-card p-6 rounded-2xl relative overflow-hidden group"
                            >
                                {/* Left gradient accent */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-cyan-500 rounded-full" />

                                {/* Icon */}
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/20 group-hover:animate-float ml-3">
                                    <GraduationCap size={22} className="text-white" />
                                </div>

                                <div className="pl-3">
                                    <h3 className="text-xl font-display font-bold text-white mb-1">{edu.degree}</h3>
                                    <p className="gradient-text-alt font-semibold mb-4">{edu.institution}</p>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={13} className="text-gray-500" />
                                            <span className="font-mono text-xs">
                                                {edu.start_year} {edu.end_year ? `— ${edu.end_year}` : '— Present'}
                                            </span>
                                        </div>
                                        {edu.gpa && (
                                            <div className="flex items-center gap-1.5">
                                                <Award size={13} className="text-amber-400" />
                                                <span className="font-semibold text-amber-300">GPA: {edu.gpa}</span>
                                            </div>
                                        )}
                                    </div>

                                    {edu.description && (
                                        <p className="text-gray-300 text-sm leading-relaxed">{edu.description}</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
