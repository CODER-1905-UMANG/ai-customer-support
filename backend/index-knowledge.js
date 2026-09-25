import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import loadDocuments from "./src/rag/documentLoader.js";
import chunkText from "./src/rag/chunker.js";
import generateEmbedding from "./src/rag/embeddings.js";
import KnowledgeChunk from "./src/models/KnowledgeChunk.js";

dotenv.config();

const indexKnowledgeBase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();

    console.log("Clearing existing knowledge chunks...");
    await KnowledgeChunk.deleteMany({});

    console.log("Loading knowledge-base documents...");
    const documents = await loadDocuments();

    let totalChunks = 0;

    for (const document of documents) {
      console.log(`\nProcessing: ${document.source}`);

      const chunks = chunkText(document.content);

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];

        console.log(
          `Generating embedding ${i + 1}/${chunks.length}...`
        );

        const embedding = await generateEmbedding(chunk);

        await KnowledgeChunk.create({
          content: chunk,
          source: document.source,
          chunkIndex: i,
          embedding,
        });

        totalChunks++;

        console.log(`Stored chunk ${i + 1}`);
      }
    }

    console.log("\n=================================");
    console.log("Knowledge base indexing complete!");
    console.log(`Documents: ${documents.length}`);
    console.log(`Chunks stored: ${totalChunks}`);
    console.log("Embedding dimensions: 384");
    console.log("=================================");
  } catch (error) {
    console.error("\nKnowledge indexing failed:", error.message);
  } finally {
    process.exit(0);
  }
};

indexKnowledgeBase();