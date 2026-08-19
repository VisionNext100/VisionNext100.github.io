export const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
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
  quote:
    'Science aims to discover facts, but leaves us free to choose our own values.',
  tags: ['CODING', 'MUSIC', 'TRAVELLING', 'SPORTS', 'PHOTOGRAPHY'] as const,
  cvPath: '/cv/YehanWANG_CV.pdf',
  profilePhoto: '/images/profile/Profile_Photo.jpg',
  contactImage: '/images/contact/contact-illustration.png',
  formspreeId: import.meta.env.VITE_FORMSPREE_ID as string | undefined,
  contactNotifyEmail: '3276924450@qq.com',
}
