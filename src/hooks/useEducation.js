import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const DEMO_EDUCATION = [
    {
        id: 1,
        degree: 'BS Computer Science',
        institution: 'University of Engineering & Technology',
        start_year: '2022',
        end_year: '2026',
        gpa: '3.5/4.0',
        description: 'Focused on software engineering, data structures, algorithms, web development, and database systems. Active member of programming and tech clubs.',
        sort_order: 1,
    },
    {
        id: 2,
        degree: 'Intermediate (Pre-Engineering)',
        institution: 'Punjab College',
        start_year: '2020',
        end_year: '2022',
        gpa: '92%',
        description: 'Studied mathematics, physics, and computer science. Developed strong analytical and problem-solving skills.',
        sort_order: 2,
    },
]

export function useEducation() {
    const [education, setEducation] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchEducation = async () => {
        if (!supabase) {
            setEducation(DEMO_EDUCATION)
            setLoading(false)
            return
        }
        setLoading(true)
        const { data, error } = await supabase
            .from('education').select('*').order('sort_order').order('created_at', { ascending: false })
        if (error) setError(error.message)
        else setEducation(data?.length ? data : DEMO_EDUCATION)
        setLoading(false)
    }

    useEffect(() => { fetchEducation() }, [])
    return { education, loading, error, refetch: fetchEducation }
}
