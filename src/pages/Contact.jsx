import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, User, MessageSquare, Send, MapPin, Sparkles, Clock, Calendar, Phone } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'react-hot-toast'
import SectionTitle from '../components/ui/SectionTitle'
import Button from '../components/ui/Button'
import { useSettings } from '../hooks/useSettings'

const INITIAL = { name: '', email: '', message: '' }

// Confetti burst animation
function ConfettiBurst({ active }) {
    if (!active) return null

    const colors = ['#6366f1', '#a855f7', '#ec4899', '#22d3ee', '#f59e0b', '#34d399']
    const pieces = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        size: 4 + Math.random() * 8,
        rotation: Math.random() * 360,
    }))

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            {pieces.map(piece => (
                <motion.div
                    key={piece.id}
                    initial={{ y: -20, opacity: 1, rotate: 0 }}
                    animate={{ y: '100vh', opacity: 0, rotate: piece.rotation + 720 }}
                    transition={{ duration: 2.5 + Math.random(), delay: piece.delay, ease: 'easeIn' }}
                    style={{
                        position: 'fixed',
                        left: piece.left,
                        top: 0,
                        width: `${piece.size}px`,
                        height: `${piece.size}px`,
                        backgroundColor: piece.color,
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                    }}
                />
            ))}
        </div>
    )
}

// Floating label input
function FloatingInput({ label, icon: Icon, type = 'text', name, value, onChange }) {
    const [focused, setFocused] = useState(false)
    const hasValue = value && value.length > 0

    return (
        <div className="relative">
            <div className="relative">
                <Icon size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused ? 'text-indigo-400' : 'text-gray-500'
                    }`} />
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className="w-full pl-11 pr-4 py-4 rounded-xl glass-input text-white placeholder-transparent peer"
                    placeholder={label}
                />
                <label className={`absolute left-11 transition-all duration-300 pointer-events-none ${focused || hasValue
                        ? 'top-1 text-[10px] font-semibold text-indigo-400'
                        : 'top-1/2 -translate-y-1/2 text-sm text-gray-500'
                    }`}>
                    {label}
                </label>
            </div>
            {/* Focus glow line at bottom */}
            <motion.div
                className="absolute bottom-0 left-1/2 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                initial={{ width: 0, x: '-50%' }}
                animate={{
                    width: focused ? '100%' : '0%',
                    x: '-50%',
                }}
                transition={{ duration: 0.3 }}
            />
        </div>
    )
}

// Floating label textarea
function FloatingTextarea({ label, icon: Icon, name, value, onChange, rows = 6 }) {
    const [focused, setFocused] = useState(false)
    const hasValue = value && value.length > 0

    return (
        <div className="relative">
            <div className="relative">
                <Icon size={16} className={`absolute left-4 top-4 transition-colors duration-300 ${focused ? 'text-indigo-400' : 'text-gray-500'
                    }`} />
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    rows={rows}
                    className="w-full pl-11 pr-4 py-4 rounded-xl glass-input text-white placeholder-transparent resize-none"
                    placeholder={label}
                />
                <label className={`absolute left-11 transition-all duration-300 pointer-events-none ${focused || hasValue
                        ? 'top-1 text-[10px] font-semibold text-indigo-400'
                        : 'top-4 text-sm text-gray-500'
                    }`}>
                    {label}
                </label>
            </div>
            <motion.div
                className="absolute bottom-0 left-1/2 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                initial={{ width: 0, x: '-50%' }}
                animate={{
                    width: focused ? '100%' : '0%',
                    x: '-50%',
                }}
                transition={{ duration: 0.3 }}
            />
        </div>
    )
}

// Availability schedule widget
function AvailabilityWidget() {
    const schedule = [
        { day: 'Mon', available: true },
        { day: 'Tue', available: true },
        { day: 'Wed', available: true },
        { day: 'Thu', available: true },
        { day: 'Fri', available: true },
        { day: 'Sat', available: false },
        { day: 'Sun', available: false },
    ]

    return (
        <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-4">
                <Clock size={14} className="text-indigo-400" />
                <span className="text-white text-sm font-semibold">Typically Available</span>
            </div>
            <div className="flex gap-2">
                {schedule.map(({ day, available }) => (
                    <div key={day} className="flex flex-col items-center gap-1.5">
                        <span className="text-[10px] text-gray-500 uppercase">{day}</span>
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${available
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-white/[0.03] text-gray-600 border border-white/[0.04]'
                            }`}>
                            {available ? '✓' : '—'}
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-gray-500 text-xs mt-3">9:00 AM - 6:00 PM (PKT)</p>
        </div>
    )
}

export default function Contact() {
    const [form, setForm] = useState(INITIAL)
    const [submitting, setSubmitting] = useState(false)
    const [showConfetti, setShowConfetti] = useState(false)
    const { settings } = useSettings()

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name || !form.email || !form.message) {
            toast.error('Please fill in all fields.')
            return
        }
        setSubmitting(true)
        const { error } = await supabase.from('messages').insert([form])
        if (error) {
            toast.error('Failed to send message. Please try again.')
        } else {
            toast.success('Message sent! I\'ll get back to you soon.')
            setForm(INITIAL)
            // Trigger confetti
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 3000)
        }
        setSubmitting(false)
    }

    const contactInfo = [
        { icon: Mail, label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
        { 
            icon: Phone, 
            label: 'Phone / WhatsApp', 
            value: '+92 300 784 5661', 
            href: 'https://wa.me/923007845661' 
        },
        { icon: MapPin, label: 'Location', value: settings.location, href: null },
    ]

    return (
        <div className="min-h-screen bg-surface pt-24 pb-16 relative">
            {/* Confetti */}
            <ConfettiBurst active={showConfetti} />

            {/* Background decoration */}
            <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <SectionTitle
                    title="Get In Touch"
                    subtitle="Have a project in mind? Let's talk!"
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <p className="text-gray-300 text-lg leading-relaxed">
                            I'm currently open to new opportunities. Whether you have a question, a project proposal, or just want to say hi — feel free to reach out!
                        </p>

                        <div className="space-y-4">
                            {contactInfo.filter(c => c.value).map(({ icon: Icon, label, value, href }) => (
                                <div key={label} className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0">
                                        <Icon size={20} className="text-indigo-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{label}</p>
                                        {href ? (
                                            <a href={href} target={href.startsWith('http') ? "_blank" : "_self"} rel={href.startsWith('http') ? "noopener noreferrer" : ""} className="text-white hover:text-indigo-400 transition-colors font-medium truncate block">{value}</a>
                                        ) : (
                                            <p className="text-white font-medium truncate">{value}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Availability Widget */}
                        <AvailabilityWidget />

                        {/* CTA Card */}
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/10 relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles size={16} className="text-indigo-400" />
                                    <p className="text-white font-display font-semibold">Let's Build Something Amazing</p>
                                </div>
                                <p className="text-gray-400 text-sm">I usually respond within 24 hours.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <FloatingInput
                                label="Your Name"
                                icon={User}
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                            />
                            <FloatingInput
                                label="Email Address"
                                icon={Mail}
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                            />
                            <FloatingTextarea
                                label="Tell me about your project..."
                                icon={MessageSquare}
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                disabled={submitting}
                                className="w-full justify-center"
                            >
                                {submitting ? (
                                    <>
                                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Send Message
                                    </>
                                )}
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
