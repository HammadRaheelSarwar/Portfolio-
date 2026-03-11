export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) {
    const base =
        'inline-flex items-center gap-2.5 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer'

    const variants = {
        primary:
            'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 hover:shadow-glow active:scale-[0.97] shadow-lg shadow-indigo-500/20',
        secondary:
            'bg-white/[0.04] text-white border border-white/10 hover:bg-white/[0.08] hover:border-white/20 backdrop-blur-sm active:scale-[0.97]',
        outline:
            'border border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 hover:border-indigo-400',
        ghost:
            'text-gray-400 hover:text-white hover:bg-white/[0.06]',
        danger:
            'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 active:scale-[0.97] shadow-lg shadow-red-500/20',
    }

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-8 py-3.5 text-base',
    }

    return (
        <button
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}
