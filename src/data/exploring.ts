export interface ExploringTopic {
  title: string;
  description: string;
  link?: { label: string; href: string };
  updatedAt?: `${number}-${number}-${number}`;
}

export const exploringTopics: ExploringTopic[] = [
  // Current interests supplied by Arthur, not a record of completed work.
  { title: 'Procedural Generation', description: 'Exploring how complex environments and structures can emerge from relatively small sets of rules, currently through Wave Function Collapse and terrain-generation experiments.' },
  { title: 'Animation', description: 'Studying timing, spacing, and how motion can make both visual work and interfaces feel clearer, more expressive, and more alive.' },
  { title: 'Machine Learning', description: 'Exploring how models can extract useful patterns from real-world data, especially when combined with visual, spatial, or geospatial information.' },
];
