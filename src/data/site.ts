export const site = {
  name: 'Arthur Milander',
  description: 'Arthur Milander’s personal portfolio. Projects, experiments, and experiences. Content in progress.',
  // Add verified contact details here; shared by About, the Index, and the footer.
  contactLinks: [] as { label: string; href: string }[],
};

export const navigation = [
  { label: 'Home', path: '' },
  { label: 'Projects', path: 'projects/' },
  { label: 'Experiences', path: 'experiences/' },
  { label: 'Playground', path: 'playground/' },
  { label: 'Awards', path: 'awards/' },
  { label: 'About', path: 'about/' },
];
