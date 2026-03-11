import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { toast } from 'react-hot-toast'
import { useSkills } from '../../hooks/useSkills'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Loader from '../../components/ui/Loader'

const EMPTY = { name: '', category: 'Frontend', percentage: 80, icon: '' }
const CATEGORIES = ['Frontend', 'Backend', 'Database', 'Tools']

export default function ManageSkills() {
    const { skills, loading, refetch } = useSkills()
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [editId, setEditId] = useState(null)
    const [saving, setSaving] = useState(false)
    const [deleteId, setDeleteId] = useState(null)

    const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true) }
    const openEdit = (row) => { setForm({ name: row.name, category: row.category, percentage: row.percentage, icon: row.icon || '' }); setEditId(row.id); setModal(true) }
    const close = () => setModal(false)
    const change = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

    const save = async () => {
        if (!form.name.trim()) { toast.error('Name required.'); return }
        setSaving(true)
        const payload = { ...form, percentage: parseInt(form.percentage) }
        const { error } = editId
            ? await supabase.from('skills').update(payload).eq('id', editId)
            : await supabase.from('skills').insert([payload])
        if (error) toast.error(error.message)
        else { toast.success(editId ? 'Skill updated!' : 'Skill added!'); close(); refetch() }
        setSaving(false)
    }

    const remove = async (id) => {
        const { error } = await supabase.from('skills').delete().eq('id', id)
        if (error) toast.error(error.message)
        else { toast.success('Skill deleted.'); setDeleteId(null); refetch() }
    }

    if (loading) return <Loader />

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Skills</h1>
                    <p className="text-gray-400 text-sm mt-1">{skills.length} skill{skills.length !== 1 ? 's' : ''}</p>
                </div>
                <Button variant="primary" onClick={openAdd}><Plus size={16} /> Add Skill</Button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/10 text-left">
                            {['Name', 'Category', 'Level', 'Actions'].map(h => (
                                <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {skills.length === 0 ? (
                            <tr><td colSpan={4} className="px-5 py-12 text-center text-gray-500">No skills yet. Click "Add Skill" to begin.</td></tr>
                        ) : skills.map((s, i) => (
                            <tr key={s.id} className={`${i % 2 === 0 ? 'bg-white/[0.02]' : ''} border-b border-white/5 hover:bg-white/5 transition-colors`}>
                                <td className="px-5 py-3 text-white font-medium">{s.name}</td>
                                <td className="px-5 py-3"><span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{s.category}</span></td>
                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-[80px]">
                                            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${s.percentage}%` }} />
                                        </div>
                                        <span className="text-xs text-gray-400">{s.percentage}%</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3">
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"><Pencil size={15} /></button>
                                        <button onClick={() => setDeleteId(s.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={15} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add / Edit Modal */}
            <Modal open={modal} onClose={close} title={editId ? 'Edit Skill' : 'Add Skill'}>
                <div className="space-y-4">
                    {[
                        { name: 'name', label: 'Skill Name', type: 'text', placeholder: 'e.g. React' },
                    ].map(({ name, label, type, placeholder }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
                            <input type={type} name={name} value={form[name]} onChange={change} placeholder={placeholder}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all" />
                        </div>
                    ))}

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
                        <select name="category" value={form.category} onChange={change}
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-white/10 text-white focus:outline-none focus:border-indigo-500 transition-all">
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Proficiency: <span className="text-indigo-400">{form.percentage}%</span></label>
                        <input type="range" name="percentage" min={0} max={100} value={form.percentage} onChange={change}
                            className="w-full accent-indigo-500" />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="ghost" onClick={close}>Cancel</Button>
                        <Button variant="primary" onClick={save} disabled={saving}>
                            {saving ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : 'Save'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirm Modal */}
            <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Skill">
                <p className="text-gray-300 mb-6">Are you sure you want to delete this skill? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
                    <Button variant="danger" onClick={() => remove(deleteId)}>Delete</Button>
                </div>
            </Modal>
        </div>
    )
}
