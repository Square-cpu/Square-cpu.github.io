export type RecognitionCategory = 'Computing' | 'Mathematics' | 'Science' | 'Languages' | 'Projects & Fairs' | 'School Recognition';

export interface RecognitionResult {
  result: string;
  year?: number;
  period?: string;
  level?: string;
  project?: string;
  detail?: string;
}

export interface RecognitionEntry {
  id: string;
  name: string;
  fullName?: string;
  category: RecognitionCategory;
  results: RecognitionResult[];
  featured: boolean;
  featuredOrder?: number;
  summary?: string[];
}

// All records were supplied by Arthur. Missing dates remain absent.
export const recognitionEntries: RecognitionEntry[] = [
  {
    id: 'obi', name: 'OBI', fullName: 'Brazilian Informatics Olympiad', category: 'Computing', featured: true, featuredOrder: 1,
    summary: ['Bronze 2024 · 30th nationally in Programming Level 1', 'HM 2023'],
    results: [
      { result: 'Honorable Mention', year: 2023 },
      { result: 'Bronze', year: 2024, level: 'Programming Level 1', detail: '30th nationally in the 2024 Programming Level 1 final ranking.' },
    ],
  },
  {
    id: 'obmep', name: 'OBMEP', fullName: 'Brazilian Public Schools Mathematics Olympiad', category: 'Mathematics', featured: true, featuredOrder: 2,
    summary: ['Silver 2021 · Bronze 2023', 'HM 2022, 2024, 2025'],
    results: [
      { result: 'Silver', year: 2021 },
      { result: 'Honorable Mention', year: 2022 },
      { result: 'Bronze', year: 2023 },
      { result: 'Bronze', year: 2023, level: 'Regional' },
      { result: 'Honorable Mention', year: 2024 },
      { result: 'Honorable Mention', year: 2025 },
    ],
  },
  {
    id: 'nasa-space-apps', name: 'NASA International Space Apps Challenge', category: 'Projects & Fairs', featured: true, featuredOrder: 3,
    summary: ['Global Nominee 2025', 'Asteroid Watchers'],
    results: [{ result: 'Global Nominee', year: 2025, project: 'Asteroid Watchers' }],
  },
  {
    id: 'oboi', name: 'OBOI', fullName: 'Brazilian Online Informatics Olympiad', category: 'Computing', featured: true, featuredOrder: 4,
    summary: ['Silver 2025 · Bronze 2024'],
    results: [{ result: 'Bronze', year: 2024 }, { result: 'Silver', year: 2025 }],
  },
  {
    id: 'onc', name: 'ONC', fullName: 'Brazilian National Science Olympiad', category: 'Science', featured: true, featuredOrder: 5,
    summary: ['Gold 2021 · Silver 2024', 'Bronze 2022, 2023'],
    results: [{ result: 'Gold', year: 2021 }, { result: 'Bronze', year: 2022 }, { result: 'Bronze', year: 2023 }, { result: 'Silver', year: 2024 }],
  },
  {
    id: 'canguru', name: 'Canguru de Matemática', category: 'Mathematics', featured: false,
    results: [{ result: 'Bronze', year: 2022 }, { result: 'Bronze', year: 2023 }, { result: 'Bronze', year: 2025 }, { result: 'Honorable Mention', year: 2026 }],
  },
  {
    id: 'mandacaru', name: 'Olimpíada Mandacaru de Matemática', category: 'Mathematics', featured: false,
    results: [{ result: 'Gold', year: 2025 }, { result: 'Gold', year: 2026 }],
  },
  {
    id: 'matematica-sem-fronteiras', name: 'Olimpíada Internacional de Matemática sem Fronteiras', category: 'Mathematics', featured: false,
    results: [{ result: 'Bronze', year: 2026, level: 'National' }, { result: 'Bronze', year: 2026, level: 'Regional' }],
  },
  {
    id: 'ufu-math-marathon', name: 'X Maratona de Matemática do Ensino Médio — UFU', category: 'Mathematics', featured: false,
    results: [{ result: '1st place', level: 'Public-school team division' }],
  },
  {
    id: 'ccl', name: 'CCL / Maratona do Cerrado', category: 'Computing', featured: false,
    results: [{ result: '1st place' }],
  },
  {
    id: 'obli', name: 'OBLI', category: 'Languages', featured: false,
    results: [{ result: 'Gold', year: 2025 }],
  },
  {
    id: 'ciencia-viva', name: 'Ciência Viva', category: 'Projects & Fairs', featured: false,
    results: [
      { result: '1st place', year: 2019, project: 'Biodigester / Biogas' },
      { result: '2nd place', year: 2023, project: 'Science Game', level: 'Exact and Earth Sciences / Engineering' },
    ],
  },
  {
    id: 'grau-ouro', name: 'Colégio Tiradentes', category: 'School Recognition', featured: false,
    results: [{ result: 'Grau Ouro', period: '2016 — 2025', detail: 'Academic recognition.' }],
  },
];

export function getFeaturedRecognition(entries: readonly RecognitionEntry[] = recognitionEntries): RecognitionEntry[] {
  return entries.filter(entry => entry.featured).sort((a, b) =>
    (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity) || a.name.localeCompare(b.name));
}
