import { skillGroups } from '../../data/skills'
import { SectionReveal } from '../ui/SectionReveal'
import './Skills.css'

export function Skills() {
  return (
    <section id="skills" className="section">
      <div className="section__inner">
        <SectionReveal>
          <p className="section__eyebrow">Skills</p>
          <h2 className="section__title">Skills & Tools</h2>
          <p className="section__lead">
            Languages, frameworks, and tools I use across AI, systems, and
            product work.
          </p>
        </SectionReveal>

        <div className="skills__groups">
          {skillGroups.map((group, i) => (
            <SectionReveal key={group.title} delay={0.05 * i}>
              <div className="skills__group">
                <h3 className="skills__group-title">{group.title}</h3>
                <ul className="skills__grid">
                  {group.items.map((item) => (
                    <li key={item.name} className="skills__chip">
                      {item.icon ? (
                        <img
                          src={item.icon}
                          alt=""
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.visibility = 'hidden'
                          }}
                        />
                      ) : (
                        <span className="skills__initial" aria-hidden="true">
                          {item.initial ?? item.name.slice(0, 2)}
                        </span>
                      )}
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
