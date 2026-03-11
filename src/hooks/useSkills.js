import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const DEMO_SKILLS = [
    { id: 1, name: 'React', category: 'Frontend', percentage: 90 },
    { id: 2, name: 'JavaScript', category: 'Frontend', percentage: 92 },
    { id: 3, name: 'TypeScript', category: 'Frontend', percentage: 80 },
    { id: 4, name: 'HTML/CSS', category: 'Frontend', percentage: 95 },
    { id: 5, name: 'Tailwind CSS', category: 'Frontend', percentage: 88 },
    { id: 6, name: 'Node.js', category: 'Backend', percentage: 85 },
    { id: 7, name: 'Express.js', category: 'Backend', percentage: 82 },
    { id: 8, name: 'Python', category: 'Backend', percentage: 78 },
    { id: 9, name: 'REST APIs', category: 'Backend', percentage: 88 },
    { id: 10, name: 'PostgreSQL', category: 'Database', percentage: 80 },
    { id: 11, name: 'MongoDB', category: 'Database', percentage: 75 },
    { id: 12, name: 'Supabase', category: 'Database', percentage: 82 },
    { id: 13, name: 'Git & GitHub', category: 'Tools', percentage: 90 },
    { id: 14, name: 'VS Code', category: 'Tools', percentage: 92 },
    { id: 15, name: 'Figma', category: 'Tools', percentage: 70 },
    { id: 16, name: 'Docker', category: 'Tools', percentage: 65 },
]

export function useSkills() {
    const [skills, setSkills] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchSkills = async () => {
        if (!supabase) {
            setSkills(DEMO_SKILLS)
            setLoading(false)
            return
        }
        setLoading(true)
        const { data, error } = await supabase
            .from('skills').select('*').order('category').order('name')
        if (error) setError(error.message)
        else setSkills(data?.length ? data : DEMO_SKILLS)
        setLoading(false)
    }

    useEffect(() => { fetchSkills() }, [])
    return { skills, loading, error, refetch: fetchSkills }
}
