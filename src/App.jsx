import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import { AnimatePresence, motion } from 'framer-motion'
import { Suspense } from 'react'

// Public layout components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import TechScene from './components/HeroScene'
import AnimatedCursor from './components/ui/AnimatedCursor'
import ScrollProgress from './components/ui/ScrollProgress'
import CommandPalette from './components/CommandPalette'

// Public pages
import Home from './pages/Home'
import About from './pages/About'
import Skills from './pages/Skills'
import Projects from './pages/Projects'
import Experience from './pages/Experience'
import Education from './pages/Education'
import Achievements from './pages/Achievements'
import Contact from './pages/Contact'

// Admin pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import ManageSkills from './pages/admin/ManageSkills'
import ManageProjects from './pages/admin/ManageProjects'
import ManageExperience from './pages/admin/ManageExperience'
import ManageEducation from './pages/admin/ManageEducation'
import ManageAchievements from './pages/admin/ManageAchievements'
import ViewMessages from './pages/admin/ViewMessages'
import AdminSettings from './pages/admin/AdminSettings'

// Public layout wrapper with 3D tech background on all pages
function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface text-white flex flex-col noise-overlay relative">
      {/* 3D dev-themed background (renders behind all pages) */}
      <Suspense fallback={null}>
        <TechScene />
      </Suspense>
      {/* Semi-transparent overlay for text readability */}
      <div className="absolute inset-0 bg-surface/50 z-[1] pointer-events-none" />

      {/* Content on top */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <ScrollProgress />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}

// Page transition wrapper with enhanced slide + scale
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.99, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -8, scale: 0.99, filter: 'blur(4px)' }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<PublicLayout><PageTransition><Home /></PageTransition></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><PageTransition><About /></PageTransition></PublicLayout>} />
        <Route path="/skills" element={<PublicLayout><PageTransition><Skills /></PageTransition></PublicLayout>} />
        <Route path="/projects" element={<PublicLayout><PageTransition><Projects /></PageTransition></PublicLayout>} />
        <Route path="/experience" element={<PublicLayout><PageTransition><Experience /></PageTransition></PublicLayout>} />
        <Route path="/education" element={<PublicLayout><PageTransition><Education /></PageTransition></PublicLayout>} />
        <Route path="/achievements" element={<PublicLayout><PageTransition><Achievements /></PageTransition></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><PageTransition><Contact /></PageTransition></PublicLayout>} />

        {/* Admin - login (unprotected) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin - protected routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="skills" element={<ManageSkills />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="experience" element={<ManageExperience />} />
          <Route path="education" element={<ManageEducation />} />
          <Route path="achievements" element={<ManageAchievements />} />
          <Route path="messages" element={<ViewMessages />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={
          <PublicLayout>
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
              <p className="text-8xl font-display font-extrabold gradient-text mb-4">404</p>
              <h1 className="text-2xl font-display font-bold text-white mb-2">Page Not Found</h1>
              <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
              <a href="/" className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 hover:shadow-glow transition-all duration-300">
                Go Home
              </a>
            </div>
          </PublicLayout>
        } />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AnimatedCursor />
          <CommandPalette />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#12121a',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
                backdropFilter: 'blur(20px)',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
          <AnimatedRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
