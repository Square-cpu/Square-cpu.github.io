export type ContactBrand = 'github' | 'linkedin' | 'youtube';
export interface ContactLink { label: string; href: string; brand: ContactBrand; }

export const site = {
  name: 'Arthur Milander',
  description: 'Arthur Milander’s personal portfolio. Projects, experiments, and experiences. Content in progress.',
  // Public destinations supplied by Arthur; shared by About, the Index, and the footer.
  contactLinks: [
    { label: 'GitHub', href: 'https://github.com/Square-cpu', brand: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/arthur-milander/', brand: 'linkedin' },
    { label: 'YouTube', href: 'https://www.youtube.com/@Square_SQ', brand: 'youtube' },
  ] satisfies ContactLink[],
};

export const navigation = [
  { label: 'Home', path: '' },
  { label: 'Projects', path: 'projects/' },
  { label: 'Experiences', path: 'experiences/' },
  { label: 'Playground', path: 'playground/' },
  { label: 'Awards', path: 'awards/' },
  { label: 'About', path: 'about/' },
];
