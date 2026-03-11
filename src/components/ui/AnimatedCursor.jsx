import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function AnimatedCursor() {
    const [visible, setVisible] = useState(false)
    const [clicked, setClicked] = useState(false)
    const [hovering, setHovering] = useState(false)
    const [isTouch, setIsTouch] = useState(false)

    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)

    const springConfig = { damping: 25, stiffness: 250, mass: 0.5 }
    const ringX = useSpring(cursorX, springConfig)
    const ringY = useSpring(cursorY, springConfig)

    // Trail dots with varying spring configs
    const t1x = useSpring(cursorX, { damping: 18, stiffness: 130, mass: 0.6 })
    const t1y = useSpring(cursorY, { damping: 18, stiffness: 130, mass: 0.6 })
    const t2x = useSpring(cursorX, { damping: 16, stiffness: 110, mass: 0.7 })
    const t2y = useSpring(cursorY, { damping: 16, stiffness: 110, mass: 0.7 })
    const t3x = useSpring(cursorX, { damping: 14, stiffness: 90, mass: 0.8 })
    const t3y = useSpring(cursorY, { damping: 14, stiffness: 90, mass: 0.8 })

    const trails = [
        { x: t1x, y: t1y, size: 3.5, opacity: 0.25, blur: 0.5 },
        { x: t2x, y: t2y, size: 3, opacity: 0.2, blur: 1 },
        { x: t3x, y: t3y, size: 2.5, opacity: 0.15, blur: 1.5 },
    ]

    useEffect(() => {
        const checkTouch = () => {
            setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
        }
        checkTouch()

        if (isTouch) return

        const moveCursor = (e) => {
            cursorX.set(e.clientX)
            cursorY.set(e.clientY)
            if (!visible) setVisible(true)
        }

        const handleMouseDown = () => setClicked(true)
        const handleMouseUp = () => setClicked(false)
        const handleMouseLeave = () => setVisible(false)
        const handleMouseEnter = () => setVisible(true)

        const attachHoverListeners = () => {
            document.querySelectorAll(
                'a, button, [role="button"], input, textarea, select, [data-cursor-hover]'
            ).forEach(el => {
                if (!el.dataset.cursorAttached) {
                    el.dataset.cursorAttached = 'true'
                    el.addEventListener('mouseenter', () => setHovering(true))
                    el.addEventListener('mouseleave', () => setHovering(false))
                }
            })
        }

        window.addEventListener('mousemove', moveCursor)
        window.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mouseup', handleMouseUp)
        document.addEventListener('mouseleave', handleMouseLeave)
        document.addEventListener('mouseenter', handleMouseEnter)

        attachHoverListeners()
        const observer = new MutationObserver(attachHoverListeners)
        observer.observe(document.body, { childList: true, subtree: true })

        return () => {
            window.removeEventListener('mousemove', moveCursor)
            window.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('mouseleave', handleMouseLeave)
            document.removeEventListener('mouseenter', handleMouseEnter)
            observer.disconnect()
        }
    }, [isTouch, visible])

    if (isTouch) return null

    const ringSize = hovering ? 50 : clicked ? 24 : 36

    return (
        <div className="pointer-events-none fixed inset-0" style={{ zIndex: 99999 }}>
            <style>{`
                @media (hover: hover) { * { cursor: none !important; } }
            `}</style>

            {/* Trail dots */}
            {trails.map((t, i) => (
                <motion.div
                    key={i}
                    className="fixed top-0 left-0"
                    style={{
                        x: t.x,
                        y: t.y,
                        translateX: '-50%',
                        translateY: '-50%',
                    }}
                >
                    <div
                        className="rounded-full"
                        style={{
                            width: `${t.size}px`,
                            height: `${t.size}px`,
                            background: `rgba(99, 102, 241, ${t.opacity})`,
                            filter: `blur(${t.blur}px)`,
                        }}
                    />
                </motion.div>
            ))}

            {/* Outer ring */}
            <motion.div
                className="fixed top-0 left-0 rounded-full border border-indigo-400/40"
                animate={{
                    width: ringSize,
                    height: ringSize,
                    opacity: visible ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                style={{
                    x: ringX,
                    y: ringY,
                    translateX: '-50%',
                    translateY: '-50%',
                    boxShadow: hovering
                        ? '0 0 20px rgba(99, 102, 241, 0.3), 0 0 40px rgba(99, 102, 241, 0.1)'
                        : '0 0 10px rgba(99, 102, 241, 0.15)',
                }}
            />

            {/* Inner dot */}
            <motion.div
                className="fixed top-0 left-0 rounded-full bg-indigo-400"
                animate={{
                    width: clicked ? 4 : 6,
                    height: clicked ? 4 : 6,
                    opacity: visible ? 1 : 0,
                }}
                transition={{ duration: 0.15 }}
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                    boxShadow: '0 0 8px rgba(99, 102, 241, 0.6)',
                }}
            />
        </div>
    )
}
