// schema-extractor.js
export async function extractSchemaFromName(name:any) {
    const normalized = name.toLowerCase();
  
    // You can later scan Express routes or read swagger/openapi
    const knownApis: Record<string, { url: string; bodySchema: string[] }> = {
      createuser: {
        url: "https://jsonplaceholder.typicode.com/posts",  // <-- change to your real endpoint
        bodySchema: ["title", "body", "userId"],            // <-- fields expected
      },
      register: {
        url: "http://localhost:3000/api/register",
        bodySchema: ["email", "password", "name"],
      }
    };
  
    if (!knownApis[normalized]) {
      throw new Error(`Unknown API: ${name}`);
    }
  
    return knownApis[normalized];
  }
  