const buildContext = (results) => {
  if (!results || results.length === 0) {
    return {
      context: "",
      sources: [],
    };
  }

  const contextParts = results.map((result, index) => {
    return `[Source ${index + 1}: ${result.source}]\n${result.content}`;
  });

  const sources = [
    ...new Set(results.map((result) => result.source)),
  ];

  return {
    context: contextParts.join("\n\n"),
    sources,
  };
};

export default buildContext;