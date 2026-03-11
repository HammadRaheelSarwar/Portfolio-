import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
    Code2, LayoutDashboard, Cpu, FolderKanban,
    Briefcase, GraduationCap, Mail, Settings,
    LogOut, Menu, X, ChevronRight, Quote, Award
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-hot-toast'

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/admin' },
    { icon: Cpu, label: 'Skills', to: '/admin/skills' },
    { icon: FolderKanban, label: 'Projects', to: '/admin/projects' },
    { icon: Briefcase, label: 'Experience', to: '/admin/experience' },
    { icon: GraduationCap, label: 'Education', to: '/admin/education' },
    { icon: Award, label: 'Achievements', to: '/admin/achievements' },
    { icon: Quote, label: 'Today Best Quote', to: '/admin/messages' },
    { icon: Settings, label: 'Settings', to: '/admin/settings' },
]

export default function AdminLayout() {
    const { signOut, user } = useAuth()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleSignOut = async () => {
        await signOut()
        toast.success('Signed out.')
        navigate('/admin/login')
    }

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Brand */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Code2 size={18} className="text-white" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm">Admin Panel</p>
                        <p className="text-gray-400 text-xs truncate max-w-[120px]">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {NAV_ITEMS.map(({ icon: Icon, label, to }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/admin'}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/10'
                            }`
                        }
                    >
                        <Icon size={18} />
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* Sign out */}
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </div>
    )

    return (
        <div className="flex h-screen bg-gray-950 overflow-hidden">
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-gray-900/80 border-r border-white/10 shrink-0">
                <SidebarContent />
            </aside>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <aside className="relative w-64 h-full bg-gray-900 border-r border-white/10">
                        <SidebarContent />
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </aside>
                </div>
            )}

            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Top bar */}
                <header className="h-16 border-b border-white/10 bg-gray-900/50 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <Menu size={20} />
                    </button>
                    <NavLink to="/" className="ml-auto text-sm text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors">
                        View Portfolio <ChevronRight size={14} />
                    </NavLink>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
