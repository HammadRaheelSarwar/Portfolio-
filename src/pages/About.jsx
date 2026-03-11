import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, animate } from 'framer-motion'
import { MapPin, Mail, Github, Linkedin, Target, Code, Coffee, Layers, Clock, Globe, Database, Palette, Server, Zap } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import SectionTitle from '../components/ui/SectionTitle'
import Loader from '../components/ui/Loader'

const KaggleIcon = ({ size = 16, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.281.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.075.312z" />
    </svg>
)

// Animated counter component
function AnimatedCounter({ value, suffix = '' }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-50px' })
    const motionVal = useMotionValue(0)
    const [displayVal, setDisplayVal] = useState(0)

    useEffect(() => {
        if (isInView) {
            const numericVal = parseInt(value) || 0
            const controls = animate(motionVal, numericVal, {
                duration: 2,
                ease: [0.22, 1, 0.36, 1],
                onUpdate: (v) => setDisplayVal(Math.round(v)),
            })
            return controls.stop
        }
    }, [isInView, value])

    const isInfinity = value === '∞'

    return (
        <span ref={ref}>
            {isInfinity ? '∞' : displayVal}{suffix}
        </span>
    )
}

// Services data
const services = [
    {
        icon: Globe,
        title: 'Web Development',
        description: 'Building responsive, performant web apps using modern frameworks like React and Next.js',
        gradient: 'from-indigo-500 to-blue-500',
    },
    {
        icon: Server,
        title: 'Backend & API',
        description: 'Designing RESTful APIs and server-side logic using Node.js, Express, and databases',
        gradient: 'from-purple-500 to-pink-500',
    },
    {
        icon: Palette,
        title: 'UI/UX Design',
        description: 'Crafting beautiful, intuitive interfaces with focus on user experience and accessibility',
        gradient: 'from-cyan-500 to-teal-500',
    },
    {
        icon: Database,
        title: 'Database Design',
        description: 'Structuring efficient databases with PostgreSQL, MongoDB, and Supabase',
        gradient: 'from-amber-500 to-orange-500',
    },
]

// Floating tech icons for orbit
const techIcons = ['⚛️', '🟨', '🟢', '🐍', '🎨', '⚡', '🔷', '🍃']

function TechOrbit() {
    return (
        <div className="absolute inset-0 pointer-events-none">
            {techIcons.map((icon, i) => {
                const angle = (i / techIcons.length) * 360
                const radius = 180
                return (
                    <motion.div
                        key={i}
                        className="absolute left-1/2 top-1/2 text-xl"
                        animate={{
                            rotate: [angle, angle + 360],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        style={{
                            transformOrigin: `0px 0px`,
                        }}
                    >
                        <motion.span
                            className="block"
                            style={{
                                transform: `translateX(${radius}px) translateX(-50%) translateY(-50%)`,
                            }}
                            animate={{ rotate: [0, -360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        >
                            {icon}
                        </motion.span>
                    </motion.div>
                )
            })}
        </div>
    )
}

export default function About() {
    const { settings, loading } = useSettings()

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader size="lg" />
        </div>
    )

    const formatUrl = (url, fallback) => {
        if (!url || url.trim() === '') return fallback;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return `https://${url}`;
        }
        return url;
    }

    const stats = [
        { label: 'Projects Completed', value: '20', suffix: '+', icon: Layers, gradient: 'from-indigo-500 to-blue-500' },
        { label: 'Technologies Used', value: '15', suffix: '+', icon: Code, gradient: 'from-purple-500 to-pink-500' },
        { label: 'Years of Learning', value: '3', suffix: '+', icon: Clock, gradient: 'from-cyan-500 to-teal-500' },
        { label: 'Cups of Coffee', value: '∞', suffix: '', icon: Coffee, gradient: 'from-amber-500 to-orange-500' },
    ]

    return (
        <div className="min-h-screen bg-surface pt-24 pb-16 relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <SectionTitle
                    title="About Me"
                    subtitle="Get to know the person behind the code"
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Profile image with tech orbit */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="flex justify-center"
                    >
                        <div className="relative">
                            {/* Tech orbit ring */}
                            <TechOrbit />

                            {/* Animated gradient ring */}
                            <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-xl animate-glow-pulse" />
                            <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-60" />
                            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-2xl overflow-hidden bg-surface-100">
                                {settings.profile_image_url ? (
                                    <img
                                        src={settings.profile_image_url}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                                        <span className="text-white text-8xl font-display font-bold">
                                            {(settings.name || 'H')[0]}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="font-display text-3xl font-bold text-white mb-2">
                                {settings.name || 'Hammad Raheel Sarwar'}
                            </h3>
                            <p className="gradient-text-alt font-semibold text-lg">{settings.title || 'Full-Stack Developer'}</p>
                        </div>

                        <p className="text-gray-300 leading-relaxed text-lg">
                            {settings.bio || 'I am a passionate Computer Science student and full-stack developer with a love for building modern, scalable web applications.'}
                        </p>

                        {/* Info chips */}
                        <div className="flex flex-wrap gap-3">
                            {settings.location && (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-gray-300 text-sm">
                                    <MapPin size={14} className="text-indigo-400" />
                                    {settings.location}
                                </div>
                            )}
                            {settings.email && (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-gray-300 text-sm">
                                    <Mail size={14} className="text-indigo-400" />
                                    {settings.email}
                                </div>
                            )}
                        </div>

                        {/* Career Objective */}
                        {settings.career_objective && (
                            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] relative overflow-hidden">
                                {/* Left accent */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                                <div className="pl-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Target size={16} className="text-indigo-400" />
                                        <h4 className="text-white font-semibold text-sm">Career Objective</h4>
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {settings.career_objective}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Social links */}
                        <div className="flex flex-wrap gap-3">
                            {settings.github && (
                                <a
                                    href={formatUrl(settings.github, 'https://github.com/HammadRaheelSarwar')}
                                    target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-gray-300 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300 text-sm font-medium"
                                >
                                    <Github size={16} /> GitHub
                                </a>
                            )}
                            {settings.linkedin && (
                                <a
                                    href={formatUrl(settings.linkedin, 'https://www.linkedin.com/in/hammad-raheel-sarwar-884745317')}
                                    target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-gray-300 hover:text-white hover:bg-blue-600/10 hover:border-blue-500/30 transition-all duration-300 text-sm font-medium"
                                >
                                    <Linkedin size={16} /> LinkedIn
                                </a>
                            )}
                            <a
                                href="https://www.kaggle.com/hammadraheelsarwar"
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-gray-300 hover:text-white hover:bg-cyan-600/10 hover:border-cyan-500/30 transition-all duration-300 text-sm font-medium"
                            >
                                <KaggleIcon size={16} /> Kaggle
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Stats with animated counters */}
                <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-5">
                    {stats.map(({ label, value, suffix, icon: Icon, gradient }, i) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="glass-card p-6 rounded-2xl text-center group"
                        >
                            <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <Icon size={22} className="text-white" />
                            </div>
                            <p className="text-3xl font-display font-extrabold text-white mb-1">
                                <AnimatedCounter value={value} suffix={suffix} />
                            </p>
                            <p className="text-gray-400 text-sm">{label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* What I Do - Services */}
                <div className="mt-24">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center font-display text-3xl font-bold text-white mb-4"
                    >
                        What I Do
                    </motion.h3>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center text-gray-400 mb-12 max-w-lg mx-auto"
                    >
                        Specialized services I offer to bring ideas to life
                    </motion.p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {services.map((service, i) => {
                            const Icon = service.icon
                            return (
                                <motion.div
                                    key={service.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                >
                                    <div className="flip-card h-48">
                                        <div className="flip-card-inner relative w-full h-full">
                                            {/* Front */}
                                            <div className="flip-card-front absolute inset-0 glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                                                    <Icon size={24} className="text-white" />
                                                </div>
                                                <h4 className="font-display font-bold text-white text-lg">{service.title}</h4>
                                            </div>
                                            {/* Back */}
                                            <div className="flip-card-back absolute inset-0 glass-card rounded-2xl p-6 flex items-center justify-center text-center">
                                                <p className="text-gray-300 text-sm leading-relaxed">
                                                    {service.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
