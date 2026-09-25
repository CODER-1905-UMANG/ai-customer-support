import loadDocuments from "./src/rag/documentLoader.js";
import chunkText from "./src/rag/chunker.js";

const testRagLoader = async () => {
  try {
    const documents = await loadDocuments();

    console.log(`Documents loaded: ${documents.length}`);

    for (const document of documents) {
      const chunks = chunkText(document.content);

      console.log("\n----------------------------");
      console.log(`Source: ${document.source}`);
      console.log(`Characters: ${document.content.length}`);
      console.log(`Chunks: ${chunks.length}`);

      console.log("\nFirst chunk:");
      console.log(chunks[0]);
    }
  } catch (error) {
    console.error("RAG loader test failed:", error.message);
  }
};

testRagLoader();