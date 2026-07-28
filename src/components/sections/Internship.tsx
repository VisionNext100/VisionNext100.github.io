import { internship } from '../../data/internship'
import { SectionReveal } from '../ui/SectionReveal'
import './Internship.css'

export function Internship() {
  return (
    <section id="internship" className="section section--alt">
      <div className="section__inner">
        <SectionReveal>
          <p className="section__eyebrow">Internship</p>
          <h2 className="section__title">Experience</h2>
          <p className="section__lead">
            Industry practice where AI meets automotive quality workflows.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.08}>
          <article className="internship__card">
            <div className="internship__brand">
              <img
                src="/images/brands/SVW_Logo.png"
                alt="SAIC Volkswagen"
                loading="lazy"
              />
            </div>
            <div className="internship__body">
              <div className="internship__meta">
                <h3>{internship.company}</h3>
                <p className="internship__role">{internship.role}</p>
                <p className="internship__period">
                  {internship.period} · {internship.location}
                </p>
              </div>
              <p className="internship__summary">{internship.summary}</p>
              <ul>
                {internship.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        </SectionReveal>
      </div>
    </section>
  )
}
