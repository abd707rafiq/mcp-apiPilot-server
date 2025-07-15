# 🧠 apiPilot – AI-Powered API Tester via MCP

**apiPilot** is an AI-native Postman alternative built with [MCP (Model Context Protocol)](https://github.com/modelcontextprotocol/mcp), allowing developers to test and interact with APIs using natural language via tools like [Cursor](https://www.cursor.sh).

With apiPilot, just say:
Test the createUser API

...and it will:
- Automatically locate the API endpoint
- Generate a mock request body
- Send a POST request
- Return the full response
- Save the request and response as a reusable collection

---

## 🚀 Features

✅ Test APIs with natural language  
✅ Auto-generate request bodies from field schema  
✅ Send HTTP requests using Axios  
✅ Save results into a `collection.json` file  
✅ Easily expandable with tools like `listCollection`, `retryFailed`, etc.  
✅ Works with [Cursor](https://www.cursor.sh) via MCP integration

---

## 📦 Tech Stack

- Node.js (typeScript)
- MCP SDK (Model Context Protocol)
- Cursor editor
- Zod for schema validation
- Axios for API calls
- File system for persistence

---




