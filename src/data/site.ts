export const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'publications', label: 'Publications' },
  { id: 'internship', label: 'Internship' },
  { id: 'education', label: 'Education' },
  { id: 'life', label: 'Life' },
] as const

export const SITE = {
  name: 'Yehan WANG',
  shortName: 'Yehan Wang',
  email: 'yehanw133@gmail.com',
  github: 'https://github.com/VisionNext100',
  githubUser: 'VisionNext100',
  quotes: [
    {
      text: 'All problems in computer science can be solved by another level of indirection.',
      author: 'David Wheeler',
    },
    {
      text: 'The best way to predict the future is to invent it.',
      author: 'Alan Kay',
    },
    {
      text: 'You can outsource your thinking, but you can’t outsource your understanding.',
      author: 'Andrej Karpathy',
    },
    {
      text: 'Simplicity is prerequisite for reliability.',
      author: 'Edsger Dijkstra',
    },
    {
      text: 'Don’t be encumbered by history, just go out and do something wonderful.',
      author: 'Robert Noyce',
    },
  ] as const,
  facts: [
    { label: 'School', value: 'East China Normal University' },
    { label: 'Program', value: 'B.Eng. CS · Junior' },
    { label: 'Focus', value: 'Machine Learning, Agent, Quantum Computing' },
    { label: 'Base', value: 'Shanghai, China' },
  ] as const,
  tags: ['CODING', 'MUSIC', 'TRAVELLING', 'SPORTS', 'PHOTOGRAPHY'] as const,
  cvPath: '/cv/YehanWANG_CV.pdf',
  profilePhoto: '/images/profile/Profile_Photo.png',
  contactImage: '/images/contact/contact-illustration.png',
  formspreeId: import.meta.env.VITE_FORMSPREE_ID as string | undefined,
  contactNotifyEmail: '3276924450@qq.com',
}
