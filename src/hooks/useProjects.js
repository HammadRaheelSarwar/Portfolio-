import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const DEMO_PROJECTS = [
    {
        id: 1,
        title: 'E-Commerce Platform',
        description: 'A full-stack e-commerce application with real-time inventory, secure payments via Stripe, and an admin dashboard for managing products, orders, and customers.',
        tech_stack: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
        github_url: 'https://github.com',
        demo_url: 'https://example.com',
        image_url: '',
        featured: true,
        sort_order: 1,
    },
    {
        id: 2,
        title: 'AI Chat Application',
        description: 'An intelligent chatbot platform built with OpenAI API integration, featuring conversation history, memory management, and a sleek modern UI.',
        tech_stack: ['Next.js', 'OpenAI API', 'Supabase', 'Framer Motion'],
        github_url: 'https://github.com',
        demo_url: 'https://example.com',
        image_url: '',
        featured: true,
        sort_order: 2,
    },
    {
        id: 3,
        title: 'Task Management App',
        description: 'A collaborative project management tool with real-time updates, drag-and-drop boards, task assignments, and team workspace features.',
        tech_stack: ['React', 'Express.js', 'MongoDB', 'Socket.io'],
        github_url: 'https://github.com',
        demo_url: '',
        image_url: '',
        featured: false,
        sort_order: 3,
    },
    {
        id: 4,
        title: 'Developer Portfolio',
        description: 'A premium personal portfolio website with 3D animations, glassmorphism design, CMS-powered content management, and smooth page transitions.',
        tech_stack: ['React', 'Three.js', 'Supabase', 'Tailwind CSS'],
        github_url: 'https://github.com',
        demo_url: 'https://example.com',
        image_url: '',
        featured: false,
        sort_order: 4,
    },
    {
        id: 5,
        title: 'Weather Dashboard',
        description: 'A beautiful weather application featuring real-time data, interactive maps, 7-day forecasts, and location-based automated updates.',
        tech_stack: ['React', 'OpenWeather API', 'Chart.js', 'CSS3'],
        github_url: 'https://github.com',
        demo_url: '',
        image_url: '',
        featured: false,
        sort_order: 5,
    },
    {
        id: 6,
        title: 'Blog Platform',
        description: 'A modern blog platform with markdown editor, SEO optimization, comments system, and responsive reading experience.',
        tech_stack: ['Next.js', 'Prisma', 'PostgreSQL', 'MDX'],
        github_url: 'https://github.com',
        demo_url: 'https://example.com',
        image_url: '',
        featured: false,
        sort_order: 6,
    },
]

export function useProjects() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchProjects = async () => {
        if (!supabase) {
            setProjects(DEMO_PROJECTS)
            setLoading(false)
            return
        }
        setLoading(true)
        const { data, error } = await supabase
            .from('projects').select('*').order('sort_order').order('created_at', { ascending: false })
        if (error) setError(error.message)
        else setProjects(data?.length ? data : DEMO_PROJECTS)
        setLoading(false)
    }

    useEffect(() => { fetchProjects() }, [])
    return { projects, loading, error, refetch: fetchProjects }
}
