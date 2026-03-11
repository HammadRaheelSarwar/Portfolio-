import { useState } from 'react'
import { Plus, Pencil, Trash2, Award, ExternalLink } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { toast } from 'react-hot-toast'
import { useAchievements } from '../../hooks/useAchievements'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Loader from '../../components/ui/Loader'

const EMPTY = { title: '', issuer: '', date: '', description: '', link: '', sort_order: 0 }

export default function ManageAchievements() {
    const { achievements, loading, refetch } = useAchievements()
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [editId, setEditId] = useState(null)
    const [saving, setSaving] = useState(false)
    const [deleteId, setDeleteId] = useState(null)

    const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true) }
    const openEdit = (row) => {
        if (typeof row.id === 'number') {
            toast.error('Demo achievements cannot be edited. Please add a new achievement instead.')
            return
        }
        setForm({
            title: row.title, issuer: row.issuer, date: row.date || '',
            description: row.description || '', link: row.link || '', sort_order: row.sort_order || 0
        })
        setEditId(row.id); setModal(true)
    }
    const close = () => setModal(false)
    const change = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

    const save = async () => {
        if (!form.title.trim() || !form.issuer.trim()) { toast.error('Title and Issuer required.'); return }
        
        if (editId && typeof editId === 'number') {
            toast.error('Demo achievements cannot be edited. Please add a new one instead.')
            return
        }

        setSaving(true)
        const payload = {
            title: form.title, issuer: form.issuer, date: form.date,
            description: form.description, link: form.link, sort_order: parseInt(form.sort_order) || 0
        }

        const { error } = editId
            ? await supabase.from('achievements').update(payload).eq('id', editId)
            : await supabase.from('achievements').insert([payload])

        if (error) toast.error(error.message)
        else { toast.success(editId ? 'Achievement updated!' : 'Achievement added!'); close(); refetch() }
        setSaving(false)
    }

    const remove = async (id) => {
        if (typeof id === 'number') {
            toast.error('Demo achievements cannot be deleted.')
            setDeleteId(null)
            return
        }
        const { error } = await supabase.from('achievements').delete().eq('id', id)
        if (error) toast.error(error.message)
        else { toast.success('Deleted.'); setDeleteId(null); refetch() }
    }

    if (loading) return <Loader />

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Achievements</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage your awards, certifications, and milestones</p>
                </div>
                <Button variant="primary" onClick={openAdd}><Plus size={16} /> Add Achievement</Button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 font-medium">Achievement</th>
                                <th className="px-6 py-4 font-medium hidden md:table-cell">Issuer</th>
                                <th className="px-6 py-4 font-medium hidden sm:table-cell">Date</th>
                                <th className="px-6 py-4 font-medium text-right cursor-pointer" title="Lower numbers appear first">Order</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {achievements.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No achievements matching criteria.
                                    </td>
                                </tr>
                            ) : achievements.map((item) => (
                                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                                                <Award size={18} className="text-indigo-400" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-white flex items-center gap-2">
                                                    {item.title}
                                                    {item.link && (
                                                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-400">
                                                            <ExternalLink size={12} />
                                                        </a>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500 md:hidden mt-0.5">{item.issuer}</div>
                                                <p className="text-xs text-gray-400 mt-1 line-clamp-1 max-w-[300px]">{item.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">{item.issuer}</td>
                                    <td className="px-6 py-4 hidden sm:table-cell">
                                        <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs">
                                            {item.date || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right tabular-nums">{item.sort_order}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                                                <Pencil size={15} />
                                            </button>
                                            <button onClick={() => typeof item.id === 'string' ? setDeleteId(item.id) : toast.error('Demo achievements cannot be deleted.')} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal open={modal} onClose={close} title={editId ? 'Edit Achievement' : 'Add Achievement'}>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Achievement Title</label>
                            <input type="text" name="title" value={form.title} onChange={change} placeholder="e.g. Hackathon Winner"
                                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Issuer/Organization</label>
                            <input type="text" name="issuer" value={form.issuer} onChange={change} placeholder="e.g. Major League Hacking"
                                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Date <span className="text-gray-500">(Optional)</span></label>
                            <input type="text" name="date" value={form.date} onChange={change} placeholder="e.g. 2024"
                                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Credential Link <span className="text-gray-500">(Optional)</span></label>
                            <input type="url" name="link" value={form.link} onChange={change} placeholder="https://..."
                                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Description <span className="text-gray-500">(Optional)</span></label>
                        <textarea name="description" value={form.description} onChange={change} rows={3} placeholder="Briefly describe what this achievement entails..."
                            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all resize-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Sort Order</label>
                        <input type="number" name="sort_order" value={form.sort_order} onChange={change}
                            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all" />
                        <p className="text-xs text-gray-500 mt-1">Lower numbers appear first on your portfolio.</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-2">
                        <Button variant="ghost" onClick={close}>Cancel</Button>
                        <Button variant="primary" onClick={save} disabled={saving}>
                            {saving ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : 'Save'}
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Achievement">
                <p className="text-gray-300 mb-6">Are you sure you want to delete this achievement? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
                    <Button variant="danger" onClick={() => remove(deleteId)}>Delete</Button>
                </div>
            </Modal>
        </div>
    )
}
