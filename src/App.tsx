import { Navigate, Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Home } from './components/sections/Home'
import { About } from './components/sections/About'
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

function HomePage() {
  useHashScroll()
  return (
    <>
      <main>
        <Home />
        <About />
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
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/life/sports" element={<SportsPage />} />
        <Route path="/life/travelling" element={<TravellingPage />} />
        <Route path="/life/photography" element={<PhotographyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
