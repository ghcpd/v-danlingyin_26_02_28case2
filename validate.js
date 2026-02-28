// validate.js

const fs = require("fs");

const content = fs.readFileSync("CLARIFICATION_REQUEST.md", "utf8");

const requiredSections = [
  "Title",
  "Background",
  "Observed Ambiguity",
  "Specific Clarification Questions",
  "Risk of Proceeding Without Clarification",
  "Suggested Documentation Improvements"
];

for (const section of requiredSections) {
  if (!content.includes(section)) {
    throw new Error(`Missing section: ${section}`);
  }
}

console.log("Structure validation passed");