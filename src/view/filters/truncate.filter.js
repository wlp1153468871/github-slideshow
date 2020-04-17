export default function truncateFilter(str, charLimit, useWordBoundary, newlineLimit) {
  if (typeof str !== 'string') {
    return str;
  }

  let truncated = str;

  if (charLimit) {
    truncated = truncated.substring(0, charLimit);
  }

  if (newlineLimit) {
    const nthNewline = str.split('\n', newlineLimit).join('\n').length;
    truncated = truncated.substring(0, nthNewline);
  }

  if (useWordBoundary !== false) {
    const startIndex = Math.max(4, charLimit - 10);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace >= startIndex && lastSpace !== -1) {
      truncated = truncated.substring(0, lastSpace);
    }
  }

  return truncated;
}
