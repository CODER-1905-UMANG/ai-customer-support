const chunkText = (text, chunkSize = 800, overlap = 100) => {
  if (!text || !text.trim()) {
    return [];
  }

  const cleanedText = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const chunks = [];
  let start = 0;

  while (start < cleanedText.length) {
    let end = Math.min(start + chunkSize, cleanedText.length);

    // If this isn't the final chunk, move the boundary
    // backwards to the nearest whitespace.
    if (end < cleanedText.length) {
      const whitespaceIndex = cleanedText.lastIndexOf(" ", end);

      if (whitespaceIndex > start) {
        end = whitespaceIndex;
      }
    }

    const chunk = cleanedText.slice(start, end).trim();

    if (chunk) {
      chunks.push(chunk);
    }

    if (end >= cleanedText.length) {
      break;
    }

    // Start the next chunk with overlap.
    let nextStart = Math.max(0, end - overlap);

    // Move the overlap boundary to a whitespace position
    // so we never cut through a word.
    const nextWhitespace = cleanedText.indexOf(" ", nextStart);

    if (nextWhitespace !== -1 && nextWhitespace < end) {
      nextStart = nextWhitespace + 1;
    }

    start = nextStart;
  }

  return chunks;
};

export default chunkText;