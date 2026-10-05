/** Site-local routes and public assets must include the configured deployment base. */
export function withBase(path = ''): string {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\/+/, '')}`;
}

/** Match whole segments so descendants belong to their top-level section. */
export function sectionCurrent(pathname: string, section: string, base = import.meta.env.BASE_URL): 'page' | 'true' | undefined {
  const segments = (path: string) => path.split('/').filter(Boolean);
  const current = segments(pathname);
  const prefix = segments(base);
  if (!prefix.every((segment, index) => current[index] === segment)) return undefined;
  const local = current.slice(prefix.length);
  const target = segments(section);
  if (!target.every((segment, index) => local[index] === segment)) return undefined;
  if (local.length === target.length) return 'page';
  return target.length > 0 ? 'true' : undefined;
}
