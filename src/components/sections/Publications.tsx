import { SectionReveal } from '../ui/SectionReveal'
import './Publications.css'

export function Publications() {
  return (
    <section id="publications" className="section">
      <div className="section__inner">
        <SectionReveal>
          <p className="section__eyebrow">Publications</p>
          <h2 className="section__title">Publications</h2>
          <p className="section__lead">
            Selected papers will appear here as they are published.
          </p>
        </SectionReveal>
        <SectionReveal delay={0.08}>
          <div className="publications__placeholder">
            <p>Coming soon — selected publications will appear here.</p>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
