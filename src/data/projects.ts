export type Project = {
  title: string
  description: string
  image: string
  repoUrl: string
  languages: string[]
}

export const upcomingProjects: Project[] = [
  {
    title: 'AdenoGuard',
    description:
      'An AI-powered WeChat mini-program for pediatric adenoid hypertrophy screening and surgical decision support. The GitHub repository will be open-sourced after the software copyright registration is approved.',
    image: '/images/projects/project-adenoguard.png',
    repoUrl: 'https://www.bilibili.com/video/BV1AHAbzkEAu',
    languages: ['Python', 'JavaScript'],
  },
]

export const projects: Project[] = [
  {
    title: 'Higgs Discovery Dashboard',
    description:
      'ML pipeline and interactive Streamlit dashboard for the ATLAS Higgs Boson Challenge, with jet-grouped modeling, AMS optimization, and SHAP interpretability.',
    image: '/images/projects/project-higgs.png',
    repoUrl: 'https://github.com/VisionNext100/Higgs-Discovery-Dashboard',
    languages: ['Python'],
  },
  {
    title: 'Image Color Clustering',
    description:
      'Interactive color clustering and aesthetic harmony analysis powered by K-means, with Streamlit visualization and LLM-assisted palette critique.',
    image: '/images/projects/project-colorcluster.png',
    repoUrl: 'https://github.com/VisionNext100/Image-Color-Clustering',
    languages: ['Python'],
  },
  {
    title: 'GeoVis-UHI',
    description:
      'Quantifies Shanghai urban heat island dynamics and park cooling effects from satellite imagery, with spatial analytics and a 3D Streamlit visualization platform.',
    image: '/images/projects/project-uhi.png',
    repoUrl: 'https://github.com/VisionNext100/GeoVis-UHI',
    languages: ['Python'],
  },
  {
    title: 'HCI Mobile Timetable Prototype',
    description:
      'Mobile-first redesign of the ECNU student timetable: compact grid, course colors, live progress, and next-class shortcuts.',
    image: '/images/projects/project-timetable.png',
    repoUrl: 'https://github.com/VisionNext100/HCI-Mobile-Timetable-Prototype',
    languages: ['JavaScript'],
  },
  {
    title: 'Object Detection',
    description:
      'YOLOv8-based traffic sign detection tuned for 45 categories in complex driving scenes, with architectural enhancements and custom losses.',
    image: '/images/projects/project-objdet.png',
    repoUrl: 'https://github.com/VisionNext100/Object-Detection',
    languages: ['Python'],
  },
  {
    title: 'De-En Transformer',
    description:
      'Baseline Transformer built from scratch for German–English translation, covering tokenization, attention, training, and beam-search decoding.',
    image: '/images/projects/project-transformer.png',
    repoUrl: 'https://github.com/VisionNext100/De-En-Transformer',
    languages: ['Python'],
  },
  {
    title: 'Smart MLFQ on uCore',
    description:
      'Multi-level feedback queue scheduler with EWMA-based behavior prediction on uCore OS. Third Prize, CSCC 2025 OS Design Competition.',
    image: '/images/projects/project-mlfq.png',
    repoUrl:
      'https://github.com/VisionNext100/A-Smart-MLFQ-Project-Based-on-uCore',
    languages: ['Assembly'],
  },
  {
    title: 'Smart Course Scheduler',
    description:
      'Qt6 academic planner that auto-generates multi-semester timetables under prerequisite DAGs, credit caps, and consecutive-course constraints.',
    image: '/images/projects/project-coursesched.png',
    repoUrl: 'https://github.com/VisionNext100/SmartCourseScheduler',
    languages: ['C++'],
  },
  {
    title: 'SmartKeyLab',
    description:
      'Smart 9-key sequential input system with a custom Trie for prefix-frequency tracking, real-time prediction, and wildcard queries.',
    image: '/images/projects/project-smartkey.png',
    repoUrl: 'https://github.com/VisionNext100/SmartKeyLab',
    languages: ['C++'],
  },
  {
    title: 'MiniSearchLab',
    description:
      'Desktop mini search engine in C++/Qt6 with inverted indexing, multi-keyword retrieval, ranking, and a clean GUI.',
    image: '/images/projects/project-minisearch.png',
    repoUrl: 'https://github.com/VisionNext100/MiniSearchLab',
    languages: ['C++'],
  },
  {
    title: 'ECNU Campus Navigation',
    description:
      'Campus navigation system implementing Dijkstra, Kruskal, and Euler-path algorithms for route planning and location management.',
    image: '/images/projects/project-campus-navigation.png',
    repoUrl: 'https://github.com/VisionNext100/ECNU-Campus-Navigation',
    languages: ['C++'],
  },
  {
    title: 'Intro to Programming — C++ Labs',
    description:
      'Collection of foundational C++ labs: comment stripping, keyword counting, set ADT, arbitrary-precision arithmetic, and heterogeneous queues.',
    image: '/images/projects/project-cppbasics.png',
    repoUrl:
      'https://github.com/VisionNext100/Intro-To-Programming-Basic-CPP-Projects',
    languages: ['C++'],
  },
  {
    title: 'PendulumLab',
    description:
      'Physics simulator for single and multi-bob pendulums in C++/Qt, with tunable mass, length, angle, drag, and live energy readouts.',
    image: '/images/projects/project-pendulum.png',
    repoUrl: 'https://github.com/VisionNext100/PendulumLab',
    languages: ['C++'],
  },
  {
    title: 'Blender-SimpleRT',
    description:
      'Minimal Python ray tracer inside Blender: shadow rays, Blinn-Phong shading, recursive reflection, Schlick Fresnel, and transmission. ECNU CG final based on Stanford CS148 HW3.',
    image: '/images/projects/project-simplert.png',
    repoUrl: 'https://github.com/VisionNext100/Blender-SimpleRT',
    languages: ['Python'],
  },
]
