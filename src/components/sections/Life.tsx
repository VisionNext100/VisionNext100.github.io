import { Link } from 'react-router-dom'
import { lifeHubCards } from '../../data/travel'
import { SectionReveal } from '../ui/SectionReveal'
import './Life.css'

export function Life() {
  return (
    <section id="life" className="section section--alt">
      <div className="section__inner">
        <SectionReveal>
          <p className="section__eyebrow">Life</p>
          <h2 className="section__title">Life</h2>
          <p className="section__lead">
            Three windows into how I spend time outside the IDE.
          </p>
        </SectionReveal>

        <div className="life-hub">
          {lifeHubCards.map((card, i) => (
            <SectionReveal
              key={card.id}
              className="life-hub__item"
              delay={0.05 * i}
            >
              <Link to={card.href} className="life-hub__card">
                <img src={card.image} alt="" loading="lazy" />
                <div className="life-hub__overlay">
                  <h3>{card.title}</h3>
                  <p>{card.blurb}</p>
                  <span className="life-hub__arrow" aria-hidden="true">
                    →
                  </span>
                </div>
              </Link>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
