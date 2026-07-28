export type SkillGroup = {
  title: string
  items: { name: string; icon?: string; initial?: string }[]
}

/** Simple Icons CDN (https://simpleicons.org) */
const icon = (slug: string) =>
  `https://cdn.simpleicons.org/${slug}/1B3A4B`

export const skillGroups: SkillGroup[] = [
  {
    title: 'Languages',
    items: [
      { name: 'C / C++', icon: icon('cplusplus') },
      { name: 'Python', icon: icon('python') },
      { name: 'JavaScript', icon: icon('javascript') },
      { name: 'HTML', icon: icon('html5') },
      { name: 'CSS', icon: icon('css3') },
    ],
  },
  {
    title: 'AI & Data',
    items: [
      { name: 'PyTorch', icon: icon('pytorch') },
      { name: 'AutoGluon', initial: 'AG' },
      { name: 'MySQL', icon: icon('mysql') },
      { name: 'Streamlit', icon: icon('streamlit') },
    ],
  },
  {
    title: 'Tools',
    items: [
      { name: 'Docker', icon: icon('docker') },
      { name: 'Dify', initial: 'DF' },
      { name: 'Qt Creator', icon: icon('qt') },
      { name: 'Git', icon: icon('git') },
    ],
  },
]
