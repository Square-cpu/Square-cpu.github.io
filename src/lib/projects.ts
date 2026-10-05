import { getCollection } from 'astro:content';

export async function getPublishedProjects() {
  return (await getCollection('projects', ({ data }) => !data.draft)).sort(
    (a, b) => (b.data.year ?? 0) - (a.data.year ?? 0) || a.data.title.localeCompare(b.data.title),
  );
}

export async function getFeaturedProjects() {
  return (await getPublishedProjects()).filter(({ data }) => data.featured).sort(
    (a, b) => (a.data.featuredOrder ?? Infinity) - (b.data.featuredOrder ?? Infinity) || a.data.title.localeCompare(b.data.title),
  );
}
