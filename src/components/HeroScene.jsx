import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

// ─── Angle bracket shape (<) or (>) ────────────────
function BracketShape({ position, scale = 1, color = '#6366f1', flip = false, speed = 0.5 }) {
    const ref = useRef()
    const geom = useMemo(() => {
        const shape = new THREE.Shape()
        if (flip) {
            shape.moveTo(0, 0)
            shape.lineTo(0.5, 0.4)
            shape.lineTo(0, 0.8)
            shape.lineTo(0.08, 0.8)
            shape.lineTo(0.58, 0.4)
            shape.lineTo(0.08, 0)
        } else {
            shape.moveTo(0.5, 0)
            shape.lineTo(0, 0.4)
            shape.lineTo(0.5, 0.8)
            shape.lineTo(0.42, 0.8)
            shape.lineTo(-0.08, 0.4)
            shape.lineTo(0.42, 0)
        }
        return new THREE.ShapeGeometry(shape)
    }, [flip])

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.z = Math.sin(state.clock.elapsedTime * speed) * 0.15
            ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.7) * 0.3
        }
    })

    return (
        <Float speed={speed} rotationIntensity={0.3} floatIntensity={0.8}>
            <mesh ref={ref} position={position} scale={scale} geometry={geom}>
                <meshBasicMaterial color={color} transparent opacity={0.25} side={THREE.DoubleSide} />
            </mesh>
        </Float>
    )
}

// ─── Curly brace shape { ────────────────────────────
function CurlyBrace({ position, scale = 1, color = '#a855f7', speed = 0.4 }) {
    const ref = useRef()

    const geom = useMemo(() => {
        const curve = new THREE.CurvePath()
        // Top half of {
        curve.add(new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0.3, 1, 0),
            new THREE.Vector3(0.15, 1, 0),
            new THREE.Vector3(0.15, 0.7, 0)
        ))
        curve.add(new THREE.LineCurve3(
            new THREE.Vector3(0.15, 0.7, 0),
            new THREE.Vector3(0.15, 0.55, 0)
        ))
        curve.add(new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0.15, 0.55, 0),
            new THREE.Vector3(0.15, 0.5, 0),
            new THREE.Vector3(0, 0.5, 0)
        ))
        // Bottom half of {
        curve.add(new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0, 0.5, 0),
            new THREE.Vector3(0.15, 0.5, 0),
            new THREE.Vector3(0.15, 0.45, 0)
        ))
        curve.add(new THREE.LineCurve3(
            new THREE.Vector3(0.15, 0.45, 0),
            new THREE.Vector3(0.15, 0.3, 0)
        ))
        curve.add(new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0.15, 0.3, 0),
            new THREE.Vector3(0.15, 0, 0),
            new THREE.Vector3(0.3, 0, 0)
        ))

        const pts = curve.getPoints(60)
        const g = new THREE.BufferGeometry().setFromPoints(pts)
        return g
    }, [])

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.elapsedTime * speed * 0.5
            ref.current.rotation.z = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.1
        }
    })

    return (
        <Float speed={speed} rotationIntensity={0.2} floatIntensity={1}>
            <group ref={ref} position={position} scale={scale}>
                <line geometry={geom}>
                    <lineBasicMaterial color={color} transparent opacity={0.35} />
                </line>
            </group>
        </Float>
    )
}

// ─── Slash character / ──────────────────────────────
function SlashShape({ position, scale = 1, color = '#22d3ee', speed = 0.6 }) {
    const ref = useRef()
    const geom = useMemo(() => {
        const shape = new THREE.Shape()
        shape.moveTo(0, 0)
        shape.lineTo(0.06, 0)
        shape.lineTo(0.36, 0.8)
        shape.lineTo(0.3, 0.8)
        return new THREE.ShapeGeometry(shape)
    }, [])

    useFrame((state) => {
        if (ref.current) {
            ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + position[0]) * 0.4
        }
    })

    return (
        <Float speed={speed} rotationIntensity={0.2} floatIntensity={0.6}>
            <mesh ref={ref} position={position} scale={scale} geometry={geom}>
                <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>
        </Float>
    )
}

// ─── Circuit nodes + lines ──────────────────────────
function CircuitNetwork() {
    const groupRef = useRef()

    const { linePositions, nodePositions } = useMemo(() => {
        const nodes = []
        const linePos = []

        for (let i = 0; i < 50; i++) {
            nodes.push(new THREE.Vector3(
                (Math.random() - 0.5) * 18,
                (Math.random() - 0.5) * 14,
                (Math.random() - 0.5) * 8 - 4
            ))
        }

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dist = nodes[i].distanceTo(nodes[j])
                if (dist < 4.5) {
                    linePos.push(
                        nodes[i].x, nodes[i].y, nodes[i].z,
                        nodes[j].x, nodes[j].y, nodes[j].z
                    )
                }
            }
        }

        const nodePosArr = new Float32Array(nodes.length * 3)
        nodes.forEach((n, i) => {
            nodePosArr[i * 3] = n.x
            nodePosArr[i * 3 + 1] = n.y
            nodePosArr[i * 3 + 2] = n.z
        })

        return {
            linePositions: new Float32Array(linePos),
            nodePositions: nodePosArr,
        }
    }, [])

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.04) * 0.08
            groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.03) * 0.04
        }
    })

    return (
        <group ref={groupRef}>
            <lineSegments>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
                </bufferGeometry>
                <lineBasicMaterial color="#6366f1" transparent opacity={0.05} />
            </lineSegments>
            <points>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={nodePositions.length / 3} array={nodePositions} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial size={0.04} color="#818cf8" transparent opacity={0.4} sizeAttenuation />
            </points>
        </group>
    )
}

// ─── Falling data particles ─────────────────────────
function DataRain() {
    const ref = useRef()
    const count = 150

    const { positions, speeds } = useMemo(() => {
        const pos = new Float32Array(count * 3)
        const spd = new Float32Array(count)
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 22
            pos[i * 3 + 1] = (Math.random() - 0.5) * 16
            pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5
            spd[i] = 0.15 + Math.random() * 0.4
        }
        return { positions: pos, speeds: spd }
    }, [])

    useFrame(() => {
        if (!ref.current) return
        const arr = ref.current.geometry.attributes.position.array
        for (let i = 0; i < count; i++) {
            arr[i * 3 + 1] -= speeds[i] * 0.015
            if (arr[i * 3 + 1] < -8) arr[i * 3 + 1] = 8
        }
        ref.current.geometry.attributes.position.needsUpdate = true
    })

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.02} color="#22d3ee" transparent opacity={0.3} sizeAttenuation />
        </points>
    )
}

// ─── Equals sign shape = ────────────────────────────
function EqualsSign({ position, scale = 1, color = '#34d399', speed = 0.5 }) {
    const ref = useRef()

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.z = Math.sin(state.clock.elapsedTime * speed) * 0.2
            ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.5 + 1) * 0.3
        }
    })

    return (
        <Float speed={speed * 0.5} rotationIntensity={0.15} floatIntensity={0.5}>
            <group ref={ref} position={position} scale={scale}>
                <mesh position={[0, 0.12, 0]}>
                    <planeGeometry args={[0.4, 0.06]} />
                    <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[0, -0.02, 0]}>
                    <planeGeometry args={[0.4, 0.06]} />
                    <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
                </mesh>
            </group>
        </Float>
    )
}

// ─── Semicolon ; ────────────────────────────────────
function Semicolon({ position, scale = 1, color = '#ec4899', speed = 0.3 }) {
    const ref = useRef()

    useFrame((state) => {
        if (ref.current) {
            ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + 2) * 0.25
        }
    })

    return (
        <Float speed={speed * 0.5} rotationIntensity={0.1} floatIntensity={0.4}>
            <group ref={ref} position={position} scale={scale}>
                <mesh position={[0, 0.15, 0]}>
                    <circleGeometry args={[0.06, 16]} />
                    <meshBasicMaterial color={color} transparent opacity={0.3} />
                </mesh>
                <mesh position={[0, -0.05, 0]}>
                    <circleGeometry args={[0.06, 16]} />
                    <meshBasicMaterial color={color} transparent opacity={0.3} />
                </mesh>
                <mesh position={[-0.02, -0.12, 0]}>
                    <planeGeometry args={[0.04, 0.1]} />
                    <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
                </mesh>
            </group>
        </Float>
    )
}

// ─── Hash sign # ────────────────────────────────────
function HashSign({ position, scale = 1, color = '#f59e0b', speed = 0.4 }) {
    const ref = useRef()

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.z = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.1
            ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + 3) * 0.35
        }
    })

    return (
        <Float speed={speed * 0.4} rotationIntensity={0.2} floatIntensity={0.6}>
            <group ref={ref} position={position} scale={scale}>
                {/* Horizontal lines */}
                <mesh position={[0, 0.1, 0]}>
                    <planeGeometry args={[0.5, 0.04]} />
                    <meshBasicMaterial color={color} transparent opacity={0.25} side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[0, -0.1, 0]}>
                    <planeGeometry args={[0.5, 0.04]} />
                    <meshBasicMaterial color={color} transparent opacity={0.25} side={THREE.DoubleSide} />
                </mesh>
                {/* Vertical lines */}
                <mesh position={[-0.1, 0, 0]} rotation={[0, 0, 0.15]}>
                    <planeGeometry args={[0.04, 0.5]} />
                    <meshBasicMaterial color={color} transparent opacity={0.25} side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[0.1, 0, 0]} rotation={[0, 0, 0.15]}>
                    <planeGeometry args={[0.04, 0.5]} />
                    <meshBasicMaterial color={color} transparent opacity={0.25} side={THREE.DoubleSide} />
                </mesh>
            </group>
        </Float>
    )
}


// ─── Main Tech Scene ────────────────────────────────
export default function TechScene() {
    return (
        <div className="absolute inset-0 z-0" style={{ position: 'fixed', pointerEvents: 'none' }}>
            <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.15} />
                <pointLight position={[5, 5, 5]} intensity={0.2} color="#6366f1" />
                <pointLight position={[-5, -3, 5]} intensity={0.15} color="#22d3ee" />

                {/* Code bracket shapes < > */}
                <BracketShape position={[-5, 2.5, -3]} scale={1.5} color="#6366f1" speed={0.4} />
                <BracketShape position={[5.5, -1.5, -4]} scale={1.2} color="#6366f1" flip speed={0.5} />
                <BracketShape position={[-3, -3, -2]} scale={0.8} color="#818cf8" speed={0.6} />
                <BracketShape position={[3.5, 3, -5]} scale={1} color="#22d3ee" flip speed={0.35} />

                {/* Curly braces { } */}
                <CurlyBrace position={[-6, 0, -3]} scale={2} color="#a855f7" speed={0.3} />
                <CurlyBrace position={[6, 2, -4]} scale={1.5} color="#c084fc" speed={0.45} />
                <CurlyBrace position={[0, -3.5, -2]} scale={1} color="#a855f7" speed={0.35} />

                {/* Slash characters / */}
                <SlashShape position={[-2, 3.5, -3]} scale={1.5} color="#22d3ee" speed={0.5} />
                <SlashShape position={[2, -2, -2]} scale={1.2} color="#06b6d4" speed={0.65} />
                <SlashShape position={[4.5, 0.5, -5]} scale={0.9} color="#22d3ee" speed={0.4} />

                {/* Equals signs = */}
                <EqualsSign position={[-4, -1.5, -2]} scale={1.5} color="#34d399" speed={0.4} />
                <EqualsSign position={[1, 4, -4]} scale={1} color="#34d399" speed={0.55} />

                {/* Semicolons ; */}
                <Semicolon position={[5, 1.5, -3]} scale={2} color="#ec4899" speed={0.3} />
                <Semicolon position={[-3, 1, -4]} scale={1.5} color="#f472b6" speed={0.45} />

                {/* Hash signs # */}
                <HashSign position={[-5.5, -2.5, -5]} scale={1.5} color="#f59e0b" speed={0.35} />
                <HashSign position={[2, 2.5, -3]} scale={1.2} color="#fbbf24" speed={0.5} />

                {/* Circuit network background */}
                <CircuitNetwork />

                {/* Falling data particles */}
                <DataRain />
            </Canvas>
        </div>
    )
}
