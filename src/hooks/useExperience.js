import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const DEMO_EXPERIENCE = [
    {
        id: 1,
        role: 'Full-Stack Developer',
        company: 'Freelance',
        start_date: 'Jan 2024',
        end_date: null,
        location: 'Remote',
        description: '• Building custom web applications for clients using React, Node.js, and modern frameworks\n• Designing and implementing responsive user interfaces with attention to UX\n• Managing databases and server infrastructure using Supabase and PostgreSQL\n• Collaborating with designers and stakeholders to deliver production-ready solutions',
        sort_order: 1,
    },
    {
        id: 2,
        role: 'Frontend Developer Intern',
        company: 'Tech Startup',
        start_date: 'Jun 2023',
        end_date: 'Dec 2023',
        location: 'Pakistan',
        description: '• Developed reusable React components that reduced development time by 30%\n• Implemented responsive designs following Figma mockups pixel-perfectly\n• Optimized web performance achieving 90+ Lighthouse scores\n• Participated in daily standups and code reviews with the development team',
        sort_order: 2,
    },
    {
        id: 3,
        role: 'Web Development Lead',
        company: 'University Tech Club',
        start_date: 'Sep 2022',
        end_date: 'May 2023',
        location: 'University Campus',
        description: '• Led a team of 5 developers building web projects for university events\n• Organized workshops on HTML, CSS, JavaScript, and React fundamentals\n• Mentored junior developers and conducted code reviews\n• Built the official club website used by 500+ students',
        sort_order: 3,
    },
]

export function useExperience() {
    const [experience, setExperience] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchExperience = async () => {
        if (!supabase) {
            setExperience(DEMO_EXPERIENCE)
            setLoading(false)
            return
        }
        setLoading(true)
        const { data, error } = await supabase
            .from('experience').select('*').order('sort_order').order('created_at', { ascending: false })
        if (error) setError(error.message)
        else setExperience(data?.length ? data : DEMO_EXPERIENCE)
        setLoading(false)
    }

    useEffect(() => { fetchExperience() }, [])
    return { experience, loading, error, refetch: fetchExperience }
}
