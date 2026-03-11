import { motion } from 'framer-motion'

export default function SectionTitle({ title, subtitle, className = '' }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`text-center mb-20 ${className}`}
        >
            <motion.h2
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                {title}
            </motion.h2>
            {subtitle && (
                <motion.p
                    className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {subtitle}
                </motion.p>
            )}
            <motion.div
                className="mt-6 flex items-center justify-center gap-1.5"
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <span className="h-1 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                <span className="h-1 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                <span className="h-1 w-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500" />
            </motion.div>
        </motion.div>
    )
}
