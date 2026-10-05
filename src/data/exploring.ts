export interface ExploringTopic {
  title: string;
  description: string;
  link?: { label: string; href: string };
  updatedAt?: `${number}-${number}-${number}`;
}

export const exploringTopics: ExploringTopic[] = [
  { title: 'Procedural generation', description: 'TODO: add current questions and experiments in procedural generation.' },
  { title: 'Animation', description: 'TODO: add current animation studies.' },
  { title: 'Creative coding', description: 'TODO: add current creative coding explorations.' },
];
