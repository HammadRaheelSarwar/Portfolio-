import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const DEMO_ACHIEVEMENTS = [
    {
        id: 1,
        title: 'Top 1% in Web Development',
        issuer: 'Freelance Platform',
        date: '2025',
        description: 'Recognized for excellent client satisfaction and delivering high-quality web applications on time.',
        link: '',
        sort_order: 1,
    },
    {
        id: 2,
        title: 'Hackathon Winner - Best UI/UX',
        issuer: 'National Tech Fest',
        date: '2024',
        description: 'Won first place out of 50 teams for designing and building an accessible AI communication tool.',
        link: 'https://example.com/certificate',
        sort_order: 2,
    },
    {
        id: 3,
        title: 'Open Source Contributor',
        issuer: 'React Foundation',
        date: '2023',
        description: 'Successfully merged multiple pull requests to improve the documentation and fix minor bugs.',
        link: 'https://github.com',
        sort_order: 3,
    },
]

export function useAchievements() {
    const [achievements, setAchievements] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchAchievements = async () => {
        if (!supabase) {
            setAchievements(DEMO_ACHIEVEMENTS)
            setLoading(false)
            return
        }
        setLoading(true)
        const { data, error } = await supabase
            .from('achievements')
            .select('*')
            .order('sort_order')
            .order('created_at', { ascending: false })
            
        if (error) setError(error.message)
        else setAchievements(data?.length ? data : DEMO_ACHIEVEMENTS)
        setLoading(false)
    }

    useEffect(() => { fetchAchievements() }, [])
    return { achievements, loading, error, refetch: fetchAchievements }
}
