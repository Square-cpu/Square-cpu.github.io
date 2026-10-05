import { test, expect } from '@playwright/test';
import { sectionCurrent } from '../src/lib/paths';

test('section matching uses path boundaries and respects deployment bases', () => {
  for (const base of ['/', '/portfolio-test/', '/nested/site']) {
    const prefix = base.replace(/\/$/, '');
    expect(sectionCurrent(`${prefix}/`, '', base)).toBe('page');
    expect(sectionCurrent(`${prefix}/projects`, 'projects/', base)).toBe('page');
    expect(sectionCurrent(`${prefix}/projects/anything/deeper/`, 'projects/', base)).toBe('true');
    expect(sectionCurrent(`${prefix}/projects/anything/`, '', base)).toBeUndefined();
    expect(sectionCurrent(`${prefix}/projects-other/`, 'projects/', base)).toBeUndefined();
  }
  expect(sectionCurrent('/portfolio-test-other/projects/', 'projects/', '/portfolio-test')).toBeUndefined();
  expect(sectionCurrent('/projects/', 'projects/', '/portfolio-test')).toBeUndefined();
});
