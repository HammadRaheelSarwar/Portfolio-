import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useSettings() {
    const [settings, setSettings] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchSettings = async () => {
        if (!supabase) {
            // When Supabase not configured, return demo settings
            setSettings({
                name: 'Hammad Raheel Sarwar',
                title: 'Full-Stack Developer & CS Student',
                bio: 'I am a passionate Computer Science student and full-stack developer with a love for building modern web applications.',
                career_objective: 'Seeking opportunities to leverage my technical skills in web development.',
                github: 'https://github.com',
                linkedin: 'https://linkedin.com',
                email: 'email@example.com',
                location: 'Pakistan',
                profile_image_url: '',
                cv_url: '',
            })
            setLoading(false)
            return
        }
        setLoading(true)
        const { data, error } = await supabase.from('settings').select('*')
        if (error) {
            setError(error.message)
        } else {
            const obj = {}
                ; (data || []).forEach(({ key, value }) => { obj[key] = value })
            setSettings(obj)
        }
        setLoading(false)
    }

    useEffect(() => { fetchSettings() }, [])
    return { settings, loading, error, refetch: fetchSettings }
}
