import { useState } from 'react'
import { Plus, Pencil, Trash2, Calendar, MapPin } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { toast } from 'react-hot-toast'
import { useExperience } from '../../hooks/useExperience'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Loader from '../../components/ui/Loader'

const EMPTY = { company: '', role: '', start_date: '', end_date: '', description: '', location: '', sort_order: 0 }

export default function ManageExperience() {
    const { experience, loading, refetch } = useExperience()
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [editId, setEditId] = useState(null)
    const [saving, setSaving] = useState(false)
    const [deleteId, setDeleteId] = useState(null)

    const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true) }
    const openEdit = (row) => {
        setForm({
            company: row.company, role: row.role, start_date: row.start_date, end_date: row.end_date || '',
            description: row.description || '', location: row.location || '', sort_order: row.sort_order || 0
        })
        setEditId(row.id); setModal(true)
    }
    const close = () => setModal(false)
    const change = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

    const save = async () => {
        if (!form.company.trim() || !form.role.trim()) { toast.error('Company and Role required.'); return }
        setSaving(true)
        const payload = { ...form, sort_order: parseInt(form.sort_order) || 0 }
        const { error } = editId
            ? await supabase.from('experience').update(payload).eq('id', editId)
            : await supabase.from('experience').insert([payload])
        if (error) toast.error(error.message)
        else { toast.success(editId ? 'Updated!' : 'Added!'); close(); refetch() }
        setSaving(false)
    }

    const remove = async (id) => {
        const { error } = await supabase.from('experience').delete().eq('id', id)
        if (error) toast.error(error.message)
        else { toast.success('Deleted.'); setDeleteId(null); refetch() }
    }

    if (loading) return <Loader />

    const fields = [
        { name: 'company', label: 'Company', type: 'text', placeholder: 'Google' },
        { name: 'role', label: 'Role / Title', type: 'text', placeholder: 'Frontend Engineer' },
        { name: 'start_date', label: 'Start Date', type: 'text', placeholder: 'Jan 2023' },
        { name: 'end_date', label: 'End Date', type: 'text', placeholder: 'Dec 2023 (leave blank for Present)' },
        { name: 'location', label: 'Location', type: 'text', placeholder: 'Remote / Karachi' },
    ]

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Experience</h1>
                    <p className="text-gray-400 text-sm mt-1">{experience.length} entr{experience.length !== 1 ? 'ies' : 'y'}</p>
                </div>
                <Button variant="primary" onClick={openAdd}><Plus size={16} /> Add Entry</Button>
            </div>

            <div className="space-y-4">
                {experience.length === 0 ? (
                    <p className="text-center text-gray-500 py-16">No experience entries yet.</p>
                ) : experience.map(exp => (
                    <div key={exp.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="text-white font-semibold">{exp.role}</h3>
                                <p className="text-indigo-400 text-sm">{exp.company}</p>
                                <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-400">
                                    <span className="flex items-center gap-1"><Calendar size={12} />{exp.start_date} — {exp.end_date || 'Present'}</span>
                                    {exp.location && <span className="flex items-center gap-1"><MapPin size={12} />{exp.location}</span>}
                                </div>
                                {exp.description && <p className="text-gray-300 text-sm mt-2 line-clamp-2">{exp.description}</p>}
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => openEdit(exp)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"><Pencil size={15} /></button>
                                <button onClick={() => setDeleteId(exp.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={15} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal open={modal} onClose={close} title={editId ? 'Edit Experience' : 'Add Experience'}>
                <div className="space-y-4">
                    {fields.map(({ name, label, type, placeholder }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
                            <input type={type} name={name} value={form[name]} onChange={change} placeholder={placeholder}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all" />
                        </div>
                    ))}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                        <textarea name="description" value={form.description} onChange={change} rows={4} placeholder="Describe your responsibilities and achievements..."
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all resize-none" />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="ghost" onClick={close}>Cancel</Button>
                        <Button variant="primary" onClick={save} disabled={saving}>
                            {saving ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : 'Save'}
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Experience">
                <p className="text-gray-300 mb-6">Delete this experience entry?</p>
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
                    <Button variant="danger" onClick={() => remove(deleteId)}>Delete</Button>
                </div>
            </Modal>
        </div>
    )
}
