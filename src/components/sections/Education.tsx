import { education } from '../../data/education'
import { SectionReveal } from '../ui/SectionReveal'
import './Education.css'

export function Education() {
  return (
    <section id="education" className="section">
      <div className="section__inner">
        <SectionReveal>
          <p className="section__eyebrow">Education</p>
          <h2 className="section__title">Education</h2>
          <p className="section__lead">
            Academic path so far — newest at the top of the timeline.
          </p>
        </SectionReveal>

        <div className="education__timeline">
          {education.map((item, i) => (
            <SectionReveal key={item.school} delay={0.06 * i}>
              <article className="education__item">
                <div className="education__dot" aria-hidden="true" />
                <div className="education__card">
                  <div className="education__logo">
                    <img src={item.logo} alt="" loading="lazy" />
                  </div>
                  <div className="education__text">
                    <h3>{item.school}</h3>
                    <p className="education__degree">{item.degree}</p>
                    <p className="education__meta">
                      {item.period} · {item.location}
                    </p>
                    {item.details ? (
                      <p className="education__details">{item.details}</p>
                    ) : null}
                  </div>
                </div>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
