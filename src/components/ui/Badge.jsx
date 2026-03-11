export default function Badge({ children, color = 'indigo' }) {
    const colors = {
        indigo: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
        purple: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
        pink: 'bg-pink-500/10 text-pink-300 border-pink-500/20',
        green: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
        blue: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
        gray: 'bg-white/5 text-gray-300 border-white/10',
    }
    return (
        <span
            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg border backdrop-blur-sm ${colors[color] || colors.gray}`}
        >
            {children}
        </span>
    )
}
