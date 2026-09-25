import dotenv from "dotenv";

dotenv.config();

console.log("Groq key loaded:", !!process.env.GROQ_API_KEY);