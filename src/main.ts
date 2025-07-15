// src/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import axios from "axios";
import { z } from "zod";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { extractSchemaFromName } from "./schema-extractor";
import fs from "fs";
const server = new McpServer({
  name: "my-server",
  version: "1.0.0"
});

// const sendRequestSchema = z.object({
//   url: z.string(),
//   method: z.string().default("GET"),
//   headers: z.record(z.string(), z.string()).optional(),
//   body: z.any().optional(),
// });

// server.registerTool(

//   "sendRequest",
//   {
//     title: "Send HTTP request with optional headers and JSON body",
//     description: "Send HTTP request with optional headers and JSON body",
//     inputSchema: {
//       url: z.string(),
//       method: z.string().default("GET"),
//       headers: z.record(z.string(), z.string()).optional(),
//       body: z.any().optional(),
//     }
//   },
//   async ({ url, method, headers, body }: z.infer<typeof sendRequestSchema>) => {
//     try {
//       const response = await axios({
//         url,
//         method,
//         headers,
//         data: body,
//       });

//       const contentType = response.headers["content-type"] || "";
//       const isJson = contentType.includes("application/json");

//       return {
//         content: [
//           {
//             type: "text",
//             text: isJson
//               ? JSON.stringify(response.data, null, 2)
//               : response.data.toString(),
//           },
//         ],
//       };
//     } catch (error) {
//       return {
//         content: [
//           {
//             type: "text",
//             text: error instanceof Error ? error.message : String(error),
//           },
//         ],
//       };
//     }
//   }
// );
server.registerTool(
  "testApiTool",
  {
    title: "Test Named API",
    description: "Auto-discovers and tests a named POST API like 'createUser'",
    inputSchema: {
      name: z.string().describe("The name of the API to test, e.g. 'createUser'"),
    },
  },
  async ({ name }) => {
    try {
      // 1. Discover endpoint and schema
      const { url, bodySchema } = await extractSchemaFromName(name);

      // 2. Auto-generate mock request body
      const requestBody: Record<string, any> = {};
      for (const field of bodySchema) {
        requestBody[field] = `test_${field}`;
      }

      // 3. Send POST request
      const response = await axios.post(url, requestBody, {
        headers: { "Content-Type": "application/json" },
      });

      // 4. Save to collection
      const log = {
        timestamp: new Date().toISOString(),
        name,
        url,
        method: "POST",
        body: requestBody,
        response: response.data,
        status: response.status,
      };

      saveToCollection(log);

      // 5. Return result to Cursor
      return {
        content: [
          {
            type: "text",
            text: `✅ [${log.status}] Tested ${url}\n\nRequest:\n${JSON.stringify(requestBody, null, 2)}\n\nResponse:\n${JSON.stringify(response.data, null, 2)}`
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error: ${err instanceof Error ? err.message : String(err)}`,
          },
        ],
      };
    }
  }
);

// Save to file
function saveToCollection(log:any) {
  const file = "collection.json";
  const history = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf-8")) : [];
  history.push(log);
  fs.writeFileSync(file, JSON.stringify(history, null, 2));
}

server.registerTool(
  "sayHello",
  {
    title: "Say Hello",
    description: "Returns a greeting message",
    inputSchema: {
      name: z.string(),
    },
  },
  async ({ name }) => {
    try {
      return {
        content: [{ type: "text", text: `Hello, ${name}!` }]
      };
    } catch (error) {
      console.error("❌ Error in sayHello tool:", error);
      return {
        content: [
          {
            type: "text",
            text: error instanceof Error ? error.message : String(error),
          },
        ],      };
    }
  }
);


// console.log("🚀 MCP Server running...");
(async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
})();
