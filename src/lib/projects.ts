import { getCollection } from 'astro:content';
import { selectFeaturedProjects } from './project-selection';

export async function getPublishedProjects() {
  return (await getCollection('projects', ({ data }) => !data.draft)).sort(
    (a, b) => (b.data.year ?? 0) - (a.data.year ?? 0) || a.data.title.localeCompare(b.data.title),
  );
}

export async function getFeaturedProjects() {
  return selectFeaturedProjects(await getCollection('projects'));
}
