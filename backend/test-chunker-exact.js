import fs from "fs/promises";
import chunkText from "./src/rag/chunker.js";

const content = await fs.readFile(
  "./knowledge_base/faq.md",
  "utf-8"
);

const chunks = chunkText(content);

console.log("RAW FILE CHECK:");
console.log("from the order:", content.includes("from the order"));
console.log("fromthe order:", content.includes("fromthe order"));

console.log("\nCHUNK CHECK:");

const combined = chunks.join("\n");

console.log("from the order:", combined.includes("from the order"));
console.log("fromthe order:", combined.includes("fromthe order"));

const index = combined.indexOf("latest order status");

console.log("\nTEXT FROM CHUNK:");
console.log(combined.slice(index, index + 100));

console.log("\nCHARACTER CODES:");
const phrase = "fromthe";
const phraseIndex = combined.indexOf(phrase);

if (phraseIndex !== -1) {
  console.log(
    [...combined.slice(phraseIndex - 10, phraseIndex + 15)]
      .map((char) => `${JSON.stringify(char)}:${char.charCodeAt(0)}`)
      .join(" ")
  );
} else {
  console.log("No 'fromthe' found in chunks.");
}