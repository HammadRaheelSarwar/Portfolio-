import { useState, useRef, useEffect } from 'react'
import { Upload, Save, User, Image, FileText } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { toast } from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Loader from '../../components/ui/Loader'

const SETTINGS_KEYS = ['name', 'title', 'bio', 'career_objective', 'location', 'email', 'github', 'linkedin']

export default function AdminSettings() {
    const [settings, setSettings] = useState({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadingAvatar, setUploadingAvatar] = useState(false)
    const [uploadingCv, setUploadingCv] = useState(false)
    const avatarRef = useRef()
    const cvRef = useRef()

    useEffect(() => {
        const fetch = async () => {
            const { data } = await supabase.from('settings').select('*')
            const obj = {}
                ; (data || []).forEach(({ key, value }) => { obj[key] = value || '' })
            setSettings(obj)
            setLoading(false)
        }
        fetch()
    }, [])

    const change = (key, value) => setSettings(p => ({ ...p, [key]: value }))

    const save = async () => {
        setSaving(true)
        const upserts = Object.entries(settings).map(([key, value]) => ({ key, value: value || '', updated_at: new Date().toISOString() }))
        const { error } = await supabase.from('settings').upsert(upserts, { onConflict: 'key' })
        if (error) toast.error(error.message)
        else toast.success('Settings saved!')
        setSaving(false)
    }

    const uploadFile = async (file, bucket, settingKey, setUploading) => {
        setUploading(true)
        const ext = file.name.split('.').pop()
        const path = `${settingKey}-${Date.now()}.${ext}`
        const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
        if (error) { toast.error(`Upload failed: ${error.message}`); setUploading(false); return }
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
        const publicUrl = urlData.publicUrl

        // Save to settings table
        await supabase.from('settings').upsert({ key: settingKey, value: publicUrl, updated_at: new Date().toISOString() }, { onConflict: 'key' })
        setSettings(p => ({ ...p, [settingKey]: publicUrl }))
        toast.success('File uploaded and saved!')
        setUploading(false)
    }

    if (loading) return <Loader />

    const FIELD_META = {
        name: { label: 'Full Name', placeholder: 'Hammad Raheel Sarwar', rows: 1 },
        title: { label: 'Professional Title', placeholder: 'Full-Stack Developer & CS Student', rows: 1 },
        email: { label: 'Email Address', placeholder: 'your@email.com', rows: 1 },
        location: { label: 'Location', placeholder: 'Pakistan', rows: 1 },
        github: { label: 'GitHub URL', placeholder: 'https://github.com/...', rows: 1 },
        linkedin: { label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...', rows: 1 },
        bio: { label: 'Bio', placeholder: 'Tell visitors about yourself...', rows: 4 },
        career_objective: { label: 'Career Objective', placeholder: 'Seeking opportunities to...', rows: 3 },
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Settings</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage profile information, bio, and files</p>
                </div>
                <Button variant="primary" onClick={save} disabled={saving}>
                    {saving ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <><Save size={16} /> Save Changes</>}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Info */}
                <div className="space-y-5">
                    <h2 className="text-white font-semibold text-lg flex items-center gap-2"><User size={18} className="text-indigo-400" />Profile Info</h2>
                    {SETTINGS_KEYS.map(key => {
                        const { label, placeholder, rows } = FIELD_META[key] || { label: key, placeholder: '', rows: 1 }
                        return (
                            <div key={key}>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
                                {rows > 1 ? (
                                    <textarea value={settings[key] || ''} onChange={e => change(key, e.target.value)} rows={rows} placeholder={placeholder}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all resize-none" />
                                ) : (
                                    <input type="text" value={settings[key] || ''} onChange={e => change(key, e.target.value)} placeholder={placeholder}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all" />
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Files */}
                <div className="space-y-7">
                    <h2 className="text-white font-semibold text-lg flex items-center gap-2"><Upload size={18} className="text-indigo-400" />Files</h2>

                    {/* Profile Image */}
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 mb-4">
                            <Image size={16} className="text-indigo-400" />
                            <h3 className="text-white font-medium">Profile Image</h3>
                        </div>
                        {settings.profile_image_url ? (
                            <img src={settings.profile_image_url} alt="Profile" className="w-24 h-24 rounded-2xl object-cover mb-3 border-2 border-indigo-500/30" />
                        ) : (
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center mb-3">
                                <span className="text-white text-3xl font-bold">{(settings.name || 'H')[0]}</span>
                            </div>
                        )}
                        <div className="flex flex-col gap-3">
                            <input 
                                type="url" 
                                value={settings.profile_image_url || ''} 
                                onChange={e => change('profile_image_url', e.target.value)} 
                                placeholder="Paste image URL here..."
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all text-sm"
                            />
                            <div className="flex items-center gap-3">
                                <span className="text-gray-500 text-sm">Or</span>
                                <input type="file" ref={avatarRef} accept="image/*" className="hidden"
                                    onChange={e => e.target.files[0] && uploadFile(e.target.files[0], 'avatars', 'profile_image_url', setUploadingAvatar)} />
                                <Button variant="secondary" size="sm" onClick={() => avatarRef.current.click()} disabled={uploadingAvatar}>
                                    {uploadingAvatar ? 'Uploading...' : <><Upload size={14} /> Upload File</>}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* CV */}
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText size={16} className="text-indigo-400" />
                            <h3 className="text-white font-medium">CV / Resume</h3>
                        </div>
                        {settings.cv_url ? (
                            <div className="mb-3 p-3 rounded-lg bg-white/5 border border-indigo-500/20 inline-block max-w-full">
                                <a href={settings.cv_url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-2 transition-colors truncate">
                                    <FileText size={16} className="shrink-0" />
                                    <span className="truncate">{settings.cv_url}</span>
                                </a>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm mb-3">No CV uploaded yet.</p>
                        )}
                        <div className="flex flex-col gap-3">
                            <input 
                                type="url" 
                                value={settings.cv_url || ''} 
                                onChange={e => change('cv_url', e.target.value)} 
                                placeholder="Paste CV URL here (e.g., Google Drive link)..."
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all text-sm"
                            />
                            <div className="flex items-center gap-3">
                                <span className="text-gray-500 text-sm">Or</span>
                                <input type="file" ref={cvRef} accept=".pdf,.doc,.docx" className="hidden"
                                    onChange={e => e.target.files[0] && uploadFile(e.target.files[0], 'cv', 'cv_url', setUploadingCv)} />
                                <Button variant="secondary" size="sm" onClick={() => cvRef.current.click()} disabled={uploadingCv}>
                                    {uploadingCv ? 'Uploading...' : <><Upload size={14} /> Upload File</>}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
