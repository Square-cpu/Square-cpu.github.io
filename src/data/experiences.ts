export interface ExperienceEntry {
  id: string;
  title: string;
  shortTitle?: string;
  period?: string;
  summary: string;
  tags?: string[];
  featured: boolean;
  featuredOrder?: number;
  highlights?: string[];
}

// Supplied by Arthur; longer notes are reserved for the dedicated Experiences page.
export const experienceEntries: ExperienceEntry[] = [
  {
    id: 'behring-academy',
    title: 'Behring Academy',
    period: '2024 — 2026',
    summary: 'A multi-year technology program and community where I grew through programming, mathematics, projects, competitive programming, mentoring, and annual university camps.',
    tags: ['Programming', 'Mathematics', 'Community', 'Mentoring'],
    featured: true,
    featuredOrder: 1,
    highlights: [
      'Joined in 2024. The program combines programming, mathematics, English, socioemotional development, projects, mentoring, and community.',
      'Annual camps: Unicamp in 2024, USP São Carlos in 2025, and UFMG in 2026.',
      'Completed multiple projects; competitive programming and OBI became an important part of the experience.',
      'Later mentored newer students.',
      'During the 2026 Camp, his team won 1st place in the iFood hackathon.',
      'One of Arthur’s most important technical and personal communities.',
    ],
  },
  {
    id: 'tks',
    title: 'The Knowledge Society (TKS)',
    shortTitle: 'TKS',
    period: '2025 — 2026',
    summary: 'A 10-month global program that pushed me into unfamiliar technologies, real-world challenges, expert outreach, presentations, and building with students around the world.',
    tags: ['Procedural generation', 'Machine learning', 'Communication'],
    featured: true,
    featuredOrder: 2,
    highlights: [
      'Participated with a scholarship in the 10-month program.',
      'Explored unfamiliar technologies and fields, especially procedural generation and machine learning.',
      'Weekly sessions emphasized mindsets, communication, and personal growth.',
      'For the TKS Global Challenge, the team developed Pasture Intelligence for a United Nations problem related to cattle movement and conflict risk in South Sudan.',
      'Learned about satellite imagery, geospatial analysis, deep learning, dataset preparation, segmentation, predictive systems, expert outreach, and technical presentation.',
      'For the Moonshot Hackathon, the team developed Veris, a smart-ring concept intended to help protect older adults from scams and manipulation.',
      'Served as Veris Project Manager and worked on 3D visuals, presentation, script, slides, prototype, one-pager, and website.',
      'Gave multiple presentations in English, built a global peer network, and learned to reach out to domain experts.',
    ],
  },
  {
    id: 'future-lab',
    title: 'Future Lab',
    period: '2026',
    summary: 'A 6-week mentor-guided launchpad experience where I built Motion Lab, refining timing and spacing through continuous feedback from industry professionals to accelerate my creative growth.',
    tags: ['Animation', 'Creative technology'],
    featured: true,
    featuredOrder: 3,
    highlights: [
      'Main period: approximately July–August 2026.',
      'Built Motion Lab to explore animation timing and spacing.',
      'Sought expert feedback, including feedback from an Emmy-winning professional.',
      'The project had intermediate/demo and final presentation milestones.',
    ],
  },
  {
    id: 'pic-jr',
    title: 'PIC Jr. — OBMEP Scientific Initiation Program',
    shortTitle: 'PIC Jr.',
    period: 'Approximately 4 years of participation',
    summary: 'Biweekly advanced mathematics work in a university environment.',
    tags: ['Mathematics'],
    featured: false,
    highlights: [
      'Selected through performance in PIC Jr. for the 8th Encontro do Hotel de Hilbert in Natal, Rio Grande do Norte.',
      'Hotel de Hilbert was a 4-day mathematics immersion and a selective academic experience, not a medal.',
    ],
  },
];

export function getFeaturedExperiences(entries: readonly ExperienceEntry[] = experienceEntries): ExperienceEntry[] {
  return entries.filter(entry => entry.featured).sort((a, b) =>
    (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity) || a.title.localeCompare(b.title));
}

export const experiencePreview = getFeaturedExperiences();
