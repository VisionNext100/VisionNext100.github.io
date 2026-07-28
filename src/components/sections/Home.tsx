import { motion } from 'framer-motion'
import { SITE } from '../../data/site'
import { useTypewriter } from '../../hooks/useTypewriter'
import { ParticleField } from '../ui/ParticleField'
import { TapePhoto } from '../ui/TapePhoto'
import './Home.css'

export function Home() {
  const typed = useTypewriter({ words: SITE.tags })

  return (
    <section id="home" className="home">
      <ParticleField />
      <div className="home__inner">
        <div className="home__copy">
          <motion.p
            className="home__hello"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Hi there, I am
          </motion.p>
          <motion.h1
            className="home__name"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {SITE.name}
          </motion.h1>
          <motion.blockquote
            className="home__quote"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            “{SITE.quote}”
          </motion.blockquote>
          <motion.p
            className="home__typed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            aria-live="polite"
          >
            <span className="home__typed-label">I am into</span>
            <span className="home__typed-word">
              {typed}
              <span className="home__cursor" aria-hidden="true" />
            </span>
          </motion.p>
        </div>
        <div className="home__photo">
          <TapePhoto src={SITE.profilePhoto} alt="Portrait of Yehan Wang" />
        </div>
      </div>
    </section>
  )
}
