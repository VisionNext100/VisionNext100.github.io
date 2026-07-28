import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Home } from './components/sections/Home'
import { About } from './components/sections/About'
import { Skills } from './components/sections/Skills'
import { Projects } from './components/sections/Projects'
import { Publications } from './components/sections/Publications'
import { Internship } from './components/sections/Internship'
import { Education } from './components/sections/Education'
import { Contact } from './components/sections/Contact'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Home />
        <About />
        <Skills />
        <Projects />
        <Publications />
        <Internship />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
