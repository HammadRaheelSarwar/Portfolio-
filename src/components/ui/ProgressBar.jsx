import { motion } from 'framer-motion'

export default function ProgressBar({ label, percentage }) {
    return (
        <div className="mb-5 group">
            <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">{label}</span>
                <motion.span
                    className="text-sm font-semibold font-mono text-indigo-400"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    {percentage}%
                </motion.span>
            </div>
            <div className="w-full h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative"
                >
                    {/* Glowing tip */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/80 shadow-[0_0_10px_rgba(99,102,241,0.8)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
            </div>
        </div>
    )
}
