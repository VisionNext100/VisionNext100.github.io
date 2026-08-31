import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Navbar } from './components/Navbar'
import { IntroOverlay } from './components/ui/IntroOverlay'
import { Footer } from './components/Footer'
import { Home } from './components/sections/Home'
import { Skills } from './components/sections/Skills'
import { Projects } from './components/sections/Projects'
import { Publications } from './components/sections/Publications'
import { Internship } from './components/sections/Internship'
import { Education } from './components/sections/Education'
import { Life } from './components/sections/Life'
import { Contact } from './components/sections/Contact'
import { SportsPage } from './pages/life/SportsPage'
import { TravellingPage } from './pages/life/TravellingPage'
import { PhotographyPage } from './pages/life/PhotographyPage'
import { useHashScroll } from './hooks/useHashScroll'
import { useImageGuard } from './hooks/useImageGuard'

function HomePage({ active }: { active: boolean }) {
  useHashScroll(active)
  return (
    <>
      <main>
        <Home active={active} />
        <Skills />
        <Projects />
        <Publications />
        <Internship />
        <Education />
        <Life />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  useImageGuard()
  // Splash plays on a fresh load of the home page only, so Life sub-pages and
  // in-app navigation never wait for it.
  const [showIntro, setShowIntro] = useState(
    () => window.location.pathname === '/',
  )

  return (
    <>
      <AnimatePresence>
        {showIntro ? (
          <IntroOverlay onDone={() => setShowIntro(false)} />
        ) : null}
      </AnimatePresence>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage active={!showIntro} />} />
        <Route path="/life/sports" element={<SportsPage />} />
        <Route path="/life/travelling" element={<TravellingPage />} />
        <Route path="/life/photography" element={<PhotographyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
