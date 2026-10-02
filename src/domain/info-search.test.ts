import { describe, expect, it } from 'vitest';
import { matchedLinkLabels, searchInfoTopics } from './info-search';
import type { InfoSearchDocument } from './info-topic';
import type { LocalizedString } from './service';

function text(en: string, ru = en, hr = en, uk = en): LocalizedString {
  return { en, ru, hr, uk };
}

function topic(
  title: string,
  extra?: Partial<InfoSearchDocument>,
): InfoSearchDocument {
  return {
    title: text(title),
    summary: text('summary'),
    links: [],
    ...extra,
  };
}

describe('searchInfoTopics', () => {
  const housing = topic('Where to look for a flat', {
    summary: text('Njuškalo first', 'Сначала Njuškalo'),
    links: [{ label: 'Njuškalo', url: 'https://www.njuskalo.hr/' }],
  });
  const mup = topic('How to book a MUP appointment', {
    body: text('Do not press Rezerviraj before 5:00.'),
    links: [{ label: 'redomat.mup.hr', url: 'https://redomat.mup.hr/' }],
  });
  const topics = [housing, mup];

  it('returns every topic when the query is blank', () => {
    expect(searchInfoTopics(topics, '   ')).toEqual(topics);
    expect(searchInfoTopics(topics, '   ')).not.toBe(topics);
  });

  it('matches a title, a body, and a link in any language', () => {
    expect(searchInfoTopics(topics, 'flat')).toEqual([housing]);
    expect(searchInfoTopics(topics, 'rezerviraj')).toEqual([mup]);
    expect(searchInfoTopics(topics, 'NJUSKALO')).toEqual([housing]);
    expect(searchInfoTopics(topics, 'сначала')).toEqual([housing]);
  });

  it('treats punctuation as a space so times still match', () => {
    expect(searchInfoTopics(topics, '5:00')).toEqual([mup]);
  });

  it('returns nothing when nothing matches', () => {
    expect(searchInfoTopics(topics, 'balloons')).toEqual([]);
  });
});

describe('matchedLinkLabels', () => {
  const topicWithLinks = topic('Housing', {
    links: [
      { label: 'Njuškalo', url: 'https://www.njuskalo.hr/' },
      { label: 'Booking.com', url: 'https://www.booking.com/' },
    ],
  });

  it('returns no labels when the query is blank', () => {
    expect(matchedLinkLabels(topicWithLinks, '  ')).toEqual([]);
  });

  it('returns only the links that contain the query', () => {
    expect(matchedLinkLabels(topicWithLinks, 'booking')).toEqual(['Booking.com']);
  });
});
