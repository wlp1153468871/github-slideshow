// Returns HTML wrapping the matching words in a `mark` tag.
import {
  escape,
  escapeRegExp,
  isRegExp,
  get,
  isEmpty,
  isString,
  uniq,
} from 'lodash';

const generateKeywords = filterText => {
  if (!filterText) {
    return [];
  }

  const keywords = uniq(filterText.match(/\S+/g));

  // Sort the longest keyword first.
  keywords.sort((a, b) => {
    return b.length - a.length;
  });

  // Convert the keyword to a case-insensitive regular expression for the filter.
  return keywords.map(keyword => {
    return new RegExp(escapeRegExp(keyword), 'i');
  });
};

// eslint-disable-next-line no-unused-vars
const filterForKeywords = (objects, filterFields, keywords) => {
  let filteredObjects = objects;
  if (isEmpty(keywords)) {
    return filteredObjects;
  }

  // Find resources that match all keywords.
  keywords.forEach(regex => {
    const matchesKeyword = obj => {
      let i;
      for (i = 0; i < filterFields.length; i += 1) {
        const value = get(obj, filterFields[i]);
        if (value && regex.test(value)) {
          return true;
        }
      }

      return false;
    };

    filteredObjects = filteredObjects.filter(matchesKeyword);
  });
  return filteredObjects;
};

export default function highlightKeywords(str, keywords, caseSensitive) {
  if (!str) {
    return str;
  }

  if (isEmpty(keywords)) {
    return escape(str);
  }

  // If passed a plain string, get the keywords from KeywordService.
  if (isString(keywords)) {
    keywords = generateKeywords(keywords);
  }

  // Combine the keywords into a single regex.
  const source = keywords
    .map(keyword => {
      if (isRegExp(keyword)) {
        return keyword.source;
      }
      return escapeRegExp(keyword);
    })
    .join('|');

  // Search for matches.
  let match;
  let result = '';
  let lastIndex = 0;
  const flags = caseSensitive ? 'g' : 'ig';
  const regex = new RegExp(source, flags);
  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(str)) !== null) {
    // Escape any text between the end of the last match and the start of
    // this match, and add it to the result.
    if (lastIndex < match.index) {
      result += escape(str.substring(lastIndex, match.index));
    }

    // Wrap the match in a `mark` element to use the Bootstrap / Patternfly highlight styles.
    result += `<mark>${escape(match[0])}</mark>`;
    // eslint-disable-next-line prefer-destructuring
    lastIndex = regex.lastIndex;
  }

  // Escape any remaining text and add it to the result.
  if (lastIndex < str.length) {
    result += escape(str.substring(lastIndex));
  }

  return result;
}
