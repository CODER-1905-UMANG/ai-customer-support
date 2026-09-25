import KnowledgeChunk from "../models/KnowledgeChunk.js";
import generateEmbedding from "./embeddings.js";

const retrieveRelevantChunks = async (query, topK = 5) => {
  try {
    
    if (!query || !query.trim()) {
      throw new Error("Query is required for retrieval.");
    }

    const queryEmbedding = await generateEmbedding(query);

    const results = await KnowledgeChunk.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 50,
          limit: topK,
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          source: 1,
          chunkIndex: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ]);

    return results;
  } catch (error) {
    console.error("Retrieval error:", error.message);
    throw new Error("Failed to retrieve relevant knowledge.");
  }
};

export default retrieveRelevantChunks;