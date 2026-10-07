export type FeaturedVariant = 'feature' | 'portrait' | 'open' | 'ribbon' | 'orbital' | 'compact';
export type ProjectStudy = 'tiles' | 'layers' | 'timing' | 'panels' | 'orbits' | 'groups';

interface FeaturedPresentation { variant: FeaturedVariant; study: ProjectStudy; }

// Homepage art direction only. Ordering and project facts stay in the collection.
export const featuredPresentation: Record<string, FeaturedPresentation> = {
  'wfc-procedural-generator': { variant: 'feature', study: 'tiles' },
  'tks-un-consulting': { variant: 'portrait', study: 'layers' },
  'motion-lab': { variant: 'open', study: 'timing' },
  'enem-prep-platform': { variant: 'ribbon', study: 'panels' },
  'asteroid-watchers': { variant: 'orbital', study: 'orbits' },
  'behring-ifood-hackathon': { variant: 'compact', study: 'groups' },
};

export const defaultFeaturedPresentation: FeaturedPresentation = { variant: 'open', study: 'panels' };
