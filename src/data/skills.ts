export type SkillGroup = {
  title: string
  items: { name: string; icon?: string; initial?: string }[]
}

/** Prefer local icons for reliability; Simple Icons CDN as fallback for common brands */
const si = (slug: string) =>
  `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`

export const skillGroups: SkillGroup[] = [
  {
    title: 'Languages',
    items: [
      { name: 'C / C++', icon: si('cplusplus') },
      { name: 'Python', icon: si('python') },
      { name: 'JavaScript', icon: si('javascript') },
      { name: 'HTML', icon: si('html5') },
      { name: 'CSS', icon: '/images/skills/css.svg' },
    ],
  },
  {
    title: 'AI & Data',
    items: [
      { name: 'PyTorch', icon: si('pytorch') },
      { name: 'AutoGluon', icon: '/images/skills/autogluon.png' },
      { name: 'MySQL', icon: si('mysql') },
      { name: 'Streamlit', icon: si('streamlit') },
    ],
  },
  {
    title: 'Tools',
    items: [
      { name: 'Docker', icon: si('docker') },
      { name: 'Dify', icon: '/images/skills/dify.svg' },
      { name: 'Qt Creator', icon: si('qt') },
      { name: 'Git', icon: si('git') },
    ],
  },
]
