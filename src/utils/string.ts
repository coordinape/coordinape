import countBy from 'lodash/countBy';
import sortBy from 'lodash/sortBy';
import toPairs from 'lodash/toPairs';

export const capitalizedName = (name: string | undefined): string => {
  if (!name) {
    return '';
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const synonyms = ['strategy|strategist|strategies'];
const synonymRegex = new RegExp(`(${synonyms.join('|')})`, 'gi');

const ignoreWords = new Set([
  'for',
  'and',
  'the',
  'i',
  'fi',
  'top',
  'looking',
  'give',
  'more',
  'than',
  'made',
  'actively',
  '',
  'also',
  'users',
  'this',
  'can',
  'improving',
  'safe',
  'project',
  'currently',
  'team',
  'various',
  'wrote',
  'com',
  'been',
  'get',
  'creating',
  'built',
  'write',
  'state',
  'contributed',
  'people',
  'well',
  'all',
  'my',
  'out',
  'at',
  'help',
  'other',
  'into',
  'that',
  'new',
  'is',
  'in',
  'work',
  'a',
  'as',
  'with',
  'working',
  'helping',
  'to',
  'of',
  'on',
  'null',
]);

export const getNotableWords = (source: string, take: number): string[] => {
  // let cleanedUp = source.replace(/[\,\(\)-\.\\\/&]/g, ' ').replace(/\w*/g, ' ').toLowerCase();
  const words = source
    .replace(/[\u{1F600}-\u{1F64F}]/gu, ' ')
    .replace(/[,()\-.\\/&]/g, ' ')
    .toLowerCase()
    .split(/\W+/g)
    .filter((w) => w.length > 1 && !ignoreWords.has(w));

  const counts = sortBy(toPairs(countBy(words)), (pair) => pair[1]);
  const wordsByFrequency = counts
    .map((pair) => pair[0])
    .filter((w) => !synonymRegex.test(w))
    .concat(synonyms);
  return wordsByFrequency.slice(counts.length - take).reverse();
};
