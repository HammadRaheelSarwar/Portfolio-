import { useState, useRef } from 'react'
import { Plus, Pencil, Trash2, Github, ExternalLink, Image } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { toast } from 'react-hot-toast'
import { useProjects } from '../../hooks/useProjects'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Loader from '../../components/ui/Loader'

const EMPTY = { title: '', description: '', tech_stack: '', github_url: '', demo_url: '', image_url: '', featured: false, sort_order: 0 }

export default function ManageProjects() {
    const { projects, loading, refetch } = useProjects()
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [editId, setEditId] = useState(null)
    const [saving, setSaving] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [uploading, setUploading] = useState(false)
    const fileRef = useRef()

    const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true) }
    const openEdit = (row) => {
        if (typeof row.id === 'number') {
            toast.error('Demo projects cannot be edited. Please add a new project instead.')
            return
        }
        setForm({
            title: row.title, description: row.description || '', tech_stack: (row.tech_stack || []).join(', '),
            github_url: row.github_url || '', demo_url: row.demo_url || '', image_url: row.image_url || '',
            featured: row.featured || false, sort_order: row.sort_order || 0
        })
        setEditId(row.id); setModal(true)
    }
    const close = () => setModal(false)
    const change = (e) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setForm(p => ({ ...p, [e.target.name]: val }))
    }

    const uploadImage = async (file) => {
        setUploading(true)
        const ext = file.name.split('.').pop()
        const path = `project-${Date.now()}.${ext}`
        const { data, error } = await supabase.storage.from('projects').upload(path, file, { upsert: true })
        if (error) { toast.error('Image upload failed.'); setUploading(false); return }
        const { data: urlData } = supabase.storage.from('projects').getPublicUrl(path)
        setForm(p => ({ ...p, image_url: urlData.publicUrl }))
        setUploading(false)
        toast.success('Image uploaded!')
    }

    const save = async () => {
        if (!form.title.trim()) { toast.error('Title required.'); return }
        
        // Block saving if the ID is a mock ID (number)
        if (editId && typeof editId === 'number') {
            toast.error('Demo projects cannot be edited. Please add a new project instead.');
            return
        }

        setSaving(true)
        const payload = {
            title: form.title, description: form.description, github_url: form.github_url, demo_url: form.demo_url,
            image_url: form.image_url, featured: form.featured, sort_order: parseInt(form.sort_order) || 0,
            tech_stack: form.tech_stack ? form.tech_stack.split(',').map(t => t.trim()).filter(Boolean) : [],
        }
        const { error } = editId
            ? await supabase.from('projects').update(payload).eq('id', editId)
            : await supabase.from('projects').insert([payload])
        if (error) toast.error(error.message)
        else { toast.success(editId ? 'Project updated!' : 'Project added!'); close(); refetch() }
        setSaving(false)
    }

    const remove = async (id) => {
        if (typeof id === 'number') {
            toast.error('Demo projects cannot be deleted.')
            setDeleteId(null)
            return
        }

        const { error } = await supabase.from('projects').delete().eq('id', id)
        if (error) toast.error(error.message)
        else { toast.success('Deleted.'); setDeleteId(null); refetch() }
    }

    if (loading) return <Loader />

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Projects</h1>
                    <p className="text-gray-400 text-sm mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
                </div>
                <Button variant="primary" onClick={openAdd}><Plus size={16} /> Add Project</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {projects.length === 0 ? (
                    <p className="col-span-full text-center text-gray-500 py-16">No projects yet. Click "Add Project" to begin.</p>
                ) : projects.map(p => (
                    <div key={p.id} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-indigo-500/30 transition-all">
                        {p.image_url ? (
                            <img src={p.image_url} alt={p.title} className="w-full h-36 object-cover" />
                        ) : (
                            <div className="w-full h-36 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 flex items-center justify-center">
                                <Image size={32} className="text-gray-600" />
                            </div>
                        )}
                        <div className="p-4">
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className="text-white font-semibold truncate">{p.title}</h3>
                                {p.featured && <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-indigo-500 text-white">Featured</span>}
                            </div>
                            <p className="text-gray-400 text-xs line-clamp-2 mb-3">{p.description}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors"><Github size={15} /></a>}
                                    {p.demo_url && <a href={p.demo_url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors"><ExternalLink size={15} /></a>}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all" title="Edit"><Pencil size={14} /></button>
                                    <button onClick={() => typeof p.id === 'string' ? setDeleteId(p.id) : toast.error('Demo projects cannot be deleted.')} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal open={modal} onClose={close} title={editId ? 'Edit Project' : 'Add Project'}>
                <div className="space-y-4">
                    {[
                        { name: 'title', label: 'Title', type: 'text', placeholder: 'My Awesome Project' },
                        { name: 'github_url', label: 'GitHub URL', type: 'url', placeholder: 'https://github.com/...' },
                        { name: 'demo_url', label: 'Demo URL', type: 'url', placeholder: 'https://...' },
                    ].map(({ name, label, type, placeholder }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
                            <input type={type} name={name} value={form[name]} onChange={change} placeholder={placeholder}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all" />
                        </div>
                    ))}

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                        <textarea name="description" value={form.description} onChange={change} rows={3} placeholder="Brief project description..."
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all resize-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Tech Stack <span className="text-gray-500">(comma separated)</span></label>
                        <input type="text" name="tech_stack" value={form.tech_stack} onChange={change} placeholder="React, Node.js, PostgreSQL"
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all" />
                    </div>

                    {/* Image upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Project Image</label>
                        {form.image_url && <img src={form.image_url} alt="Preview" className="w-full h-28 object-cover rounded-xl mb-3" />}
                        <div className="flex gap-2">
                            <input type="url" name="image_url" value={form.image_url} onChange={change} placeholder="https://..."
                                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all text-sm" />
                            <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={e => e.target.files[0] && uploadImage(e.target.files[0])} />
                            <Button variant="secondary" onClick={() => fileRef.current.click()} disabled={uploading}>
                                {uploading ? '...' : <><Image size={14} /> Upload</>}
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="featured" id="featured" checked={form.featured} onChange={change} className="w-4 h-4 accent-indigo-500 rounded" />
                        <label htmlFor="featured" className="text-sm text-gray-300 cursor-pointer">Mark as Featured</label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="ghost" onClick={close}>Cancel</Button>
                        <Button variant="primary" onClick={save} disabled={saving || uploading}>
                            {saving ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : 'Save'}
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Project">
                <p className="text-gray-300 mb-6">Are you sure you want to delete this project?</p>
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
                    <Button variant="danger" onClick={() => remove(deleteId)}>Delete</Button>
                </div>
            </Modal>
        </div>
    )
}
