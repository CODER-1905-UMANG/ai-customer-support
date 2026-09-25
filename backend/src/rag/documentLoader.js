import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const knowledgeBasePath = path.join(
  __dirname,
  "../../knowledge_base"
);

const loadDocuments = async () => {
  try {
    const files = await fs.readdir(knowledgeBasePath);

    const markdownFiles = files.filter((file) =>
      file.endsWith(".md")
    );

    const documents = [];

    for (const file of markdownFiles) {
      const filePath = path.join(knowledgeBasePath, file);
      const content = await fs.readFile(filePath, "utf-8");

      documents.push({
        source: file,
        content,
      });
    }

    return documents;
  } catch (error) {
    console.error("Document loading error:", error.message);
    throw new Error("Failed to load knowledge-base documents.");
  }
};

export default loadDocuments;