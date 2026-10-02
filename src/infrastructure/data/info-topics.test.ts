import { describe, expect, it } from 'vitest';
import { infoTopics } from './info-topics';

describe('info topic seed', () => {
  it('starts with the housing list and the MUP appointment note', () => {
    expect(infoTopics.map((topic) => topic.slug)).toEqual([
      'where-to-look',
      'mup-appointment',
    ]);
    expect(infoTopics.every((topic) => topic.visible)).toBe(true);
  });

  it('marks Njuškalo as the place to start and lists it once', () => {
    const housing = infoTopics.find((topic) => topic.slug === 'where-to-look');
    const njuskalo = housing?.links.filter((link) => link.url.includes('njuskalo.hr'));

    expect(njuskalo).toHaveLength(1);
    expect(njuskalo?.[0]).toMatchObject({ featured: true, label: 'Njuškalo' });
    expect(housing?.links[0]?.id).toBe('link_njuskalo');
  });

  it('keeps the MUP booking page and six Facebook groups', () => {
    const housing = infoTopics.find((topic) => topic.slug === 'where-to-look');
    const mup = infoTopics.find((topic) => topic.slug === 'mup-appointment');

    expect(housing?.links.filter((link) => link.kind === 'group')).toHaveLength(6);
    expect(mup?.links.map((link) => link.url)).toEqual(['https://redomat.mup.hr/']);
    expect(mup?.body?.en).toContain('Rezerviraj');
    expect(mup?.body?.ru).toContain('номерки');
  });

  it('uses https links and unique ids', () => {
    const links = infoTopics.flatMap((topic) => topic.links);
    const ids = links.map((link) => link.id);

    expect(links.every((link) => link.url.startsWith('https://'))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(links.some((link) => link.url.includes('mibextid'))).toBe(false);
  });
});
