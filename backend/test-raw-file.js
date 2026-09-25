import fs from "fs/promises";

const content = await fs.readFile(
  "./knowledge_base/faq.md",
  "utf-8"
);

const index = content.indexOf("latest order status");

console.log("\nRaw file content:\n");
console.log(content.slice(index, index + 150));

console.log("\nChecks:");

console.log(
  "Contains 'from the order':",
  content.includes("from the order")
);

console.log(
  "Contains 'fromthe order':",
  content.includes("fromthe order")
);