import { projects, upcomingProjects } from '../../data/projects'
import { SITE } from '../../data/site'
import { SectionReveal } from '../ui/SectionReveal'
import './Projects.css'

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.8c.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .26.18.59.69.48A10.27 10.27 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"
      />
    </svg>
  )
}

function ProjectCard({
  project,
  delay = 0,
}: {
  project: (typeof projects)[number]
  delay?: number
}) {
  return (
    <SectionReveal delay={delay}>
      <a
        className="project-card"
        href={project.repoUrl}
        target="_blank"
        rel="noreferrer"
      >
        <div className="project-card__media">
          <img src={project.image} alt="" loading="lazy" />
        </div>
        <div className="project-card__body">
          <div className="project-card__title-row">
            <h3>{project.title}</h3>
            <ul className="project-card__langs">
              {project.languages.map((lang) => (
                <li key={lang}>{lang}</li>
              ))}
            </ul>
          </div>
          <p>{project.description}</p>
        </div>
      </a>
    </SectionReveal>
  )
}

export function Projects() {
  return (
    <section id="projects" className="section section--alt">
      <div className="section__inner">
        <SectionReveal>
          <div className="projects__header">
            <div>
              <p className="section__eyebrow">Projects</p>
              <h2 className="section__title">Selected Work</h2>
              <p className="section__lead projects__lead">
                Course projects, research experiments, and systems I have built.
                Click a card to open the repository.
              </p>
            </div>
            <a
              className="projects__github"
              href={SITE.github}
              target="_blank"
              rel="noreferrer"
              aria-label="Open GitHub profile"
              title="GitHub profile"
            >
              <GitHubIcon />
            </a>
          </div>
        </SectionReveal>

        <div className="projects__grid">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.repoUrl}
              project={project}
              delay={0.04 * (i % 4)}
            />
          ))}
        </div>

        <SectionReveal delay={0.06}>
          <div className="projects__subheader">
            <h2 className="section__title">Upcoming</h2>
            <p className="section__lead projects__lead">
              Not open-sourced yet due to software copyright and patent filing.
              Click a card to watch the demo.
            </p>
          </div>
        </SectionReveal>

        <div className="projects__grid projects__grid--upcoming">
          {upcomingProjects.map((project, i) => (
            <ProjectCard
              key={project.repoUrl}
              project={project}
              delay={0.04 * i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
