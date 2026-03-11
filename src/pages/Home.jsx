import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Github, Linkedin, Mail, Download, ChevronDown, ArrowRight, Sparkles, Terminal } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSettings } from '../hooks/useSettings'
import Button from '../components/ui/Button'
import Loader from '../components/ui/Loader'

const KaggleIcon = ({ size = 20, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.281.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.075.312z" />
    </svg>
)

const roles = ['Full-Stack Developer', 'CS Student', 'UI/UX Enthusiast', 'Problem Solver']

function TypewriterText({ texts }) {
    const [index, setIndex] = useState(0)
    const [text, setText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const current = texts[index]
        const speed = isDeleting ? 40 : 80

        if (!isDeleting && text === current) {
            setTimeout(() => setIsDeleting(true), 2000)
            return
        }
        if (isDeleting && text === '') {
            setIsDeleting(false)
            setIndex((prev) => (prev + 1) % texts.length)
            return
        }

        const timeout = setTimeout(() => {
            setText(isDeleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1))
        }, speed)

        return () => clearTimeout(timeout)
    }, [text, isDeleting, index, texts])

    return (
        <span>
            {text}
            <span className="inline-block w-[2px] h-[1em] bg-indigo-400 ml-1 animate-pulse align-middle" />
        </span>
    )
}

// Floating code editor component
function FloatingCodeEditor() {
    const codeLines = [
        { text: 'const developer = {', color: 'text-purple-400' },
        { text: '  name: "Hammad",', color: 'text-cyan-300' },
        { text: '  role: "Full-Stack Dev",', color: 'text-cyan-300' },
        { text: '  skills: ["React", "Node"],', color: 'text-emerald-300' },
        { text: '  passion: "Building",', color: 'text-amber-300' },
        { text: '};', color: 'text-purple-400' },
    ]

    const [visibleLines, setVisibleLines] = useState(0)

    useEffect(() => {
        if (visibleLines < codeLines.length) {
            const timer = setTimeout(() => setVisibleLines(v => v + 1), 400)
            return () => clearTimeout(timer)
        }
    }, [visibleLines])

    return (
        <motion.div
            initial={{ opacity: 0, x: 60, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-[5%] code-editor-float"
            style={{ perspective: '1000px' }}
        >
            <div className="w-[320px] rounded-2xl overflow-hidden bg-surface-100/80 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-indigo-500/10">
                {/* Title bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
                    <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500/80" />
                        <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-gray-500 text-xs font-mono ml-2">developer.js</span>
                </div>
                {/* Code */}
                <div className="p-4 font-mono text-sm space-y-1">
                    {codeLines.map((line, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={i < visibleLines ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                            transition={{ duration: 0.3 }}
                            className="flex"
                        >
                            <span className="text-gray-600 w-6 text-right mr-4 select-none text-xs">
                                {i + 1}
                            </span>
                            <span className={line.color}>{line.text}</span>
                        </motion.div>
                    ))}
                    {/* Blinking cursor at the end */}
                    <div className="flex">
                        <span className="text-gray-600 w-6 text-right mr-4 select-none text-xs">
                            {codeLines.length + 1}
                        </span>
                        <span className="w-2 h-4 bg-indigo-400 animate-pulse" />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// Gradient Orb component
function GradientOrb({ className, delay = 0 }) {
    return (
        <motion.div
            className={`absolute rounded-full blur-[100px] opacity-20 ${className}`}
            animate={{
                scale: [1, 1.2, 1],
                x: [0, 30, -20, 0],
                y: [0, -30, 20, 0],
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                delay,
                ease: 'easeInOut',
            }}
        />
    )
}

// Magnetic button wrapper
function MagneticButton({ children, className }) {
    const ref = useRef(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const springX = useSpring(x, { stiffness: 150, damping: 15 })
    const springY = useSpring(y, { stiffness: 150, damping: 15 })

    const handleMouse = (e) => {
        const rect = ref.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        x.set((e.clientX - centerX) * 0.15)
        y.set((e.clientY - centerY) * 0.15)
    }

    const handleLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={handleLeave}
            style={{ x: springX, y: springY }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export default function Home() {
    const { settings, loading } = useSettings()

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader size="lg" text="Loading..." />
        </div>
    )

    const formatUrl = (url, fallback) => {
        if (!url || url.trim() === '') return fallback;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return `https://${url}`;
        }
        return url;
    }

    const socials = [
        { icon: Github, href: formatUrl(settings.github, 'https://github.com/HammadRaheelSarwar'), label: 'GitHub' },
        { icon: Linkedin, href: formatUrl(settings.linkedin, 'https://www.linkedin.com/in/hammad-raheel-sarwar-884745317'), label: 'LinkedIn' },
        { icon: KaggleIcon, href: 'https://www.kaggle.com/hammadraheelsarwar', label: 'Kaggle' },
        { icon: Mail, href: settings.email ? `mailto:${settings.email}` : undefined, label: 'Email' },
    ]

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden aurora-bg">

            {/* Animated gradient orbs */}
            <GradientOrb className="w-[500px] h-[500px] bg-indigo-600 top-[-10%] left-[-10%]" delay={0} />
            <GradientOrb className="w-[400px] h-[400px] bg-purple-600 bottom-[-10%] right-[-5%]" delay={2} />
            <GradientOrb className="w-[300px] h-[300px] bg-cyan-500 top-[50%] right-[20%]" delay={4} />
            <GradientOrb className="w-[350px] h-[350px] bg-pink-500 bottom-[20%] left-[10%]" delay={6} />

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 z-[1] opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left - Text content */}
                    <div className="text-center lg:text-left">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm font-medium mb-10 backdrop-blur-sm"
                        >
                            <Sparkles size={14} className="text-indigo-400" />
                            <span className="text-gray-300">Available for Opportunities</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                        </motion.div>

                        {/* Name */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[0.95]"
                        >
                            {settings.name || 'Hammad Raheel Sarwar'}
                        </motion.h1>

                        {/* Typewriter Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-2xl sm:text-3xl font-semibold gradient-text-alt mb-8 h-10"
                        >
                            <TypewriterText texts={settings.title ? [settings.title, ...roles.filter(r => r !== settings.title)] : roles} />
                        </motion.div>

                        {/* Bio */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-gray-400 text-lg max-w-xl leading-relaxed mb-12"
                        >
                            {settings.bio?.slice(0, 200) || 'Passionate about building modern, scalable web applications that make a difference.'}
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-14"
                        >
                            <MagneticButton>
                                {settings.cv_url ? (
                                    <a href={settings.cv_url} target="_blank" rel="noopener noreferrer">
                                        <Button variant="primary" size="lg">
                                            <Download size={18} />
                                            Download CV
                                        </Button>
                                    </a>
                                ) : (
                                    <Button variant="primary" size="lg" disabled>
                                        <Download size={18} />
                                        Download CV
                                    </Button>
                                )}
                            </MagneticButton>
                            <MagneticButton>
                                <Link to="/projects">
                                    <Button variant="secondary" size="lg">
                                        View My Work
                                        <ArrowRight size={18} />
                                    </Button>
                                </Link>
                            </MagneticButton>
                        </motion.div>

                        {/* Social Links */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="flex items-center justify-center lg:justify-start gap-3"
                        >
                            {socials.map(({ icon: Icon, href, label }) => (
                                href && (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-br hover:from-indigo-600 hover:to-purple-600 hover:border-transparent hover:shadow-glow hover:scale-110 transition-all duration-300 backdrop-blur-sm"
                                    >
                                        <Icon size={20} />
                                    </a>
                                )
                            ))}
                        </motion.div>
                    </div>

                    {/* Right - Floating code editor */}
                    <FloatingCodeEditor />
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-gray-500 text-xs tracking-wider uppercase">Scroll</span>
                    <ChevronDown size={16} className="text-gray-600" />
                </div>
            </motion.div>
        </div>
    )
}
