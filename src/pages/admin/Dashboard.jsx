import { useEffect, useState } from 'react'
import { Cpu, FolderKanban, Briefcase, GraduationCap, Mail } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { motion } from 'framer-motion'

export default function Dashboard() {
    const [counts, setCounts] = useState({ skills: 0, projects: 0, experience: 0, education: 0, achievements: 0, messages: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCounts = async () => {
            const tables = ['skills', 'projects', 'experience', 'education', 'achievements', 'messages']
            const results = await Promise.all(
                tables.map(t => supabase.from(t).select('id', { count: 'exact', head: true }))
            )
            const [skills, projects, experience, education, achievements, messages] = results
            setCounts({
                skills: skills.count || 0,
                projects: projects.count || 0,
                experience: experience.count || 0,
                education: education.count || 0,
                achievements: achievements.count || 0,
                messages: messages.count || 0,
            })
            setLoading(false)
        }
        fetchCounts()
    }, [])

    const stats = [
        { icon: Cpu, label: 'Skills', value: counts.skills, color: 'from-pink-500 to-rose-500', link: '/admin/skills' },
        { icon: FolderKanban, label: 'Projects', value: counts.projects, color: 'from-indigo-500 to-blue-500', link: '/admin/projects' },
        { icon: Briefcase, label: 'Experience', value: counts.experience, color: 'from-green-500 to-emerald-500', link: '/admin/experience' },
        { icon: GraduationCap, label: 'Education', value: counts.education, color: 'from-orange-500 to-amber-500', link: '/admin/education' },
        { icon: Cpu, label: 'Achievements', value: counts.achievements, color: 'from-blue-500 to-cyan-500', link: '/admin/achievements' },
        { icon: Mail, label: 'Today Best Quote', value: counts.messages, color: 'from-purple-500 to-violet-500', link: '/admin/messages' },
    ]

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400 mb-8">Welcome back, Admin! Here's an overview of your portfolio.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                {stats.map(({ icon: Icon, label, value, color }, i) => (
                    <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.07 }}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all duration-300"
                    >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                            <Icon size={22} className="text-white" />
                        </div>
                        <p className="text-4xl font-extrabold text-white mb-1">
                            {loading ? '—' : value}
                        </p>
                        <p className="text-gray-400 text-sm">{label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20">
                <h2 className="text-white font-semibold text-lg mb-2">Getting Started</h2>
                <ul className="text-gray-300 text-sm space-y-2">
                    <li>• Go to <strong>Settings</strong> to update your name, bio, and upload your profile picture and CV.</li>
                    <li>• Use <strong>Skills</strong> to add your technical skills with proficiency levels.</li>
                    <li>• Add your work under <strong>Projects</strong>, <strong>Experience</strong>, and <strong>Education</strong>.</li>
                    <li>• Check <strong>Today Best Quote</strong> to get daily inspiration and read form submissions.</li>
                </ul>
            </div>
        </div>
    )
}
