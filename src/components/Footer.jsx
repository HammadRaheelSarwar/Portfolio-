import { Link } from 'react-router-dom'
import { Github, Linkedin, Mail, Code2, Heart, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSettings } from '../hooks/useSettings'

const KaggleIcon = ({ size = 17, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.281.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.075.312z" />
    </svg>
)

export default function Footer() {
    const { settings } = useSettings()
    const year = new Date().getFullYear()

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

    const links = [
        { label: 'Home', to: '/' },
        { label: 'About', to: '/about' },
        { label: 'Skills', to: '/skills' },
        { label: 'Projects', to: '/projects' },
        { label: 'Experience', to: '/experience' },
        { label: 'Education', to: '/education' },
        { label: 'Achievements', to: '/achievements' },
        { label: 'Contact', to: '/contact' },
    ]

    return (
        <footer className="relative border-t border-white/[0.06] bg-surface/80 backdrop-blur-sm">
            {/* Gradient line separator */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link to="/" className="flex items-center gap-3 mb-4 group">
                            {settings?.profile_image_url ? (
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-white/5 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow duration-300 p-0.5 shrink-0">
                                    <img 
                                        src={settings.profile_image_url} 
                                        alt="Profile" 
                                        className="w-full h-full rounded-[10px] object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow duration-300 shrink-0">
                                    <Code2 size={16} className="text-white" />
                                </div>
                            )}
                            <div className="flex flex-col justify-center">
                                <span className="font-display font-bold text-lg gradient-text group-hover:opacity-80 transition-opacity duration-300 leading-tight">
                                    {settings?.name ? settings.name.split(' ')[0] : 'Hammad Raheel'}
                                </span>
                                <span className="text-[11px] font-semibold text-indigo-400 tracking-wider uppercase leading-tight mt-0.5">
                                    CS Student
                                </span>
                            </div>
                        </Link>
                        {settings.title && (
                            <p className="text-indigo-400 text-sm font-medium mb-3">
                                {settings.title}
                            </p>
                        )}
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs line-clamp-3">
                            {settings.bio || 'Full-Stack Developer passionate about building modern, scalable web applications.'}
                        </p>
                    </motion.div>

                    {/* Navigation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h4 className="font-display font-semibold text-white mb-5 text-sm uppercase tracking-wider">
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {links.map(({ label, to }) => (
                                <li key={to}>
                                    <Link
                                        to={to}
                                        className="group flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors duration-300"
                                    >
                                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Social */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h4 className="font-display font-semibold text-white mb-5 text-sm uppercase tracking-wider">
                            Connect
                        </h4>
                        <div className="flex gap-3">
                            {socials.map(({ icon: Icon, href, label }) => (
                                href && (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-br hover:from-indigo-600 hover:to-purple-600 hover:border-transparent hover:shadow-glow transition-all duration-300"
                                    >
                                        <Icon size={17} />
                                    </a>
                                )
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
                    <p>© {year} {settings.name || 'Hammad'}. All rights reserved.</p>
                    <p className="flex items-center gap-1.5">
                        Built with <Heart size={12} className="text-red-500 fill-red-500" /> using React & Supabase
                    </p>
                </div>
            </div>
        </footer>
    )
}
