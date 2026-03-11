import { useState } from 'react'
import { Plus, Pencil, Trash2, GraduationCap } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { toast } from 'react-hot-toast'
import { useEducation } from '../../hooks/useEducation'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Loader from '../../components/ui/Loader'

const EMPTY = { degree: '', institution: '', start_year: '', end_year: '', gpa: '', description: '', sort_order: 0 }

export default function ManageEducation() {
    const { education, loading, refetch } = useEducation()
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [editId, setEditId] = useState(null)
    const [saving, setSaving] = useState(false)
    const [deleteId, setDeleteId] = useState(null)

    const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true) }
    const openEdit = (row) => {
        setForm({
            degree: row.degree, institution: row.institution, start_year: row.start_year || '',
            end_year: row.end_year || '', gpa: row.gpa || '', description: row.description || '', sort_order: row.sort_order || 0
        })
        setEditId(row.id); setModal(true)
    }
    const close = () => setModal(false)
    const change = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

    const save = async () => {
        if (!form.degree.trim() || !form.institution.trim()) { toast.error('Degree and Institution required.'); return }
        setSaving(true)
        const payload = { ...form, sort_order: parseInt(form.sort_order) || 0 }
        const { error } = editId
            ? await supabase.from('education').update(payload).eq('id', editId)
            : await supabase.from('education').insert([payload])
        if (error) toast.error(error.message)
        else { toast.success(editId ? 'Updated!' : 'Added!'); close(); refetch() }
        setSaving(false)
    }

    const remove = async (id) => {
        const { error } = await supabase.from('education').delete().eq('id', id)
        if (error) toast.error(error.message)
        else { toast.success('Deleted.'); setDeleteId(null); refetch() }
    }

    if (loading) return <Loader />

    const fields = [
        { name: 'degree', label: 'Degree', placeholder: 'BS Computer Science' },
        { name: 'institution', label: 'Institution', placeholder: 'FAST-NUCES' },
        { name: 'start_year', label: 'Start Year', placeholder: '2022' },
        { name: 'end_year', label: 'End Year', placeholder: '2026 (blank for Present)' },
        { name: 'gpa', label: 'GPA (optional)', placeholder: '3.8 / 4.0' },
    ]

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Education</h1>
                    <p className="text-gray-400 text-sm mt-1">{education.length} entr{education.length !== 1 ? 'ies' : 'y'}</p>
                </div>
                <Button variant="primary" onClick={openAdd}><Plus size={16} /> Add Entry</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {education.length === 0 ? (
                    <p className="col-span-full text-center text-gray-500 py-16">No education entries yet.</p>
                ) : education.map(edu => (
                    <div key={edu.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shrink-0">
                                    <GraduationCap size={18} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">{edu.degree}</h3>
                                    <p className="text-indigo-400 text-sm">{edu.institution}</p>
                                    <p className="text-gray-400 text-xs mt-0.5">
                                        {edu.start_year} — {edu.end_year || 'Present'}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => openEdit(edu)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"><Pencil size={15} /></button>
                                <button onClick={() => setDeleteId(edu.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={15} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal open={modal} onClose={close} title={editId ? 'Edit Education' : 'Add Education'}>
                <div className="space-y-4">
                    {fields.map(({ name, label, placeholder }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
                            <input type="text" name={name} value={form[name]} onChange={change} placeholder={placeholder}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all" />
                        </div>
                    ))}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Description (optional)</label>
                        <textarea name="description" value={form.description} onChange={change} rows={3} placeholder="Relevant coursework, achievements..."
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

            <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Education">
                <p className="text-gray-300 mb-6">Delete this education entry?</p>
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
                    <Button variant="danger" onClick={() => remove(deleteId)}>Delete</Button>
                </div>
            </Modal>
        </div>
    )
}
