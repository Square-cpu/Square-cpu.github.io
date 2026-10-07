import type { CollectionEntry } from 'astro:content';

export function selectFeaturedProjects(projects: readonly CollectionEntry<'projects'>[]) {
  return projects.filter(({ data }) => data.featured && !data.draft).sort(
    (a, b) => (a.data.featuredOrder ?? Infinity) - (b.data.featuredOrder ?? Infinity) || a.data.title.localeCompare(b.data.title),
  );
}
