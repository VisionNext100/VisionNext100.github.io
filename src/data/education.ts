export type EducationItem = {
  school: string
  degree: string
  period: string
  location: string
  logo: string
  details?: string
}

/** Newest first (top of the timeline). */
export const education: EducationItem[] = [
  {
    school: 'East China Normal University',
    degree: 'Bachelor of Engineering (B.Eng.) in Computer Science',
    period: 'Sep 2024 – Jul 2028',
    location: 'Shanghai, China',
    logo: '/images/brands/ECNU_Logo.jpg',
    details:
      'Undergraduate studies focusing on AI systems and software engineering.',
  },
]
