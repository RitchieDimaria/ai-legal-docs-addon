export const extractContextPrompt = (text) => `
You are a legal document parser. Extract the following structured information from the document:

1. Defined Terms (pattern: “Term” means …)
2. Headings / Section Titles
3. Parties (from cover page or signature blocks)
4. Governing Law / Jurisdiction

Output as JSON.
Document:
${text}
`;