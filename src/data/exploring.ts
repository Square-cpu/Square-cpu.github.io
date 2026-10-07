export interface ExploringTopic {
  title: string;
  description: string;
  link?: { label: string; href: string };
  updatedAt?: `${number}-${number}-${number}`;
}

export const exploringTopics: ExploringTopic[] = [
  // Provisional directions, not a record of completed work.
  { title: 'Procedural generation', description: 'How simple rules can produce structures, variation, and unexpected results.' },
  { title: 'Animation', description: 'Timing, rhythm, and the small changes that make movement feel considered.' },
  { title: 'Creative coding', description: 'Code as a way to sketch, try a visual idea, and see where it leads.' },
];
