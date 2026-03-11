export default function Loader({ size = 'md', text = '' }) {
    const sizes = {
        sm: 'w-5 h-5',
        md: 'w-10 h-10',
        lg: 'w-14 h-14',
    }
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
            <div className="relative">
                <div
                    className={`${sizes[size]} rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin`}
                />
                <div
                    className={`${sizes[size]} rounded-full border-2 border-purple-500/20 border-b-purple-500 animate-spin absolute inset-0`}
                    style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                />
            </div>
            {text && <p className="text-sm text-gray-400 animate-pulse">{text}</p>}
        </div>
    )
}
