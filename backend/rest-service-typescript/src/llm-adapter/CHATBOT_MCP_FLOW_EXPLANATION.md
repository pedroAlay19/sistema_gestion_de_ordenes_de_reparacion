# 🤖 AI Chatbot with MCP - Complete Flow Explanation

> **A detailed guide to understanding the entire message processing flow from user input to AI response with Model Context Protocol (MCP) tool execution**

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Complete Message Flow](#complete-message-flow)
3. [Iteration System](#iteration-system)
4. [Real-World Examples](#real-world-examples)
5. [Technical Details](#technical-details)

---

## 🏗️ Architecture Overview

### System Components

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────┐
│   Frontend  │─────▶│  REST Service    │─────▶│ MCP Server  │
│   (React)   │      │  (NestJS)        │      │ (Tools)     │
└─────────────┘      └──────────────────┘      └─────────────┘
      │                       │                        │
      │                       ▼                        │
      │               ┌──────────────┐                 │
      │               │    Gemini    │                 │
      │               │  AI Provider │                 │
      │               └──────────────┘                 │
      │                       │                        │
      └───────────────────────┴────────────────────────┘
```

### Key Players

1. **Frontend (React Chat UI)**
   - Handles user input (text + images)
   - Displays messages and tool execution results
   - Compresses images before sending

2. **REST Service (NestJS)**
   - LLM Adapter Service: Orchestrates the conversation
   - Gemini Provider: Communicates with Google Gemini AI
   - Manages iterative tool execution

3. **MCP Server (Express)**
   - Tool Registry: Manages available tools
   - Backend Client: Makes authenticated API calls
   - Executes tools and returns results

4. **Gemini AI**
   - Processes multimodal input (text + images)
   - Decides which tools to call
   - Generates natural language responses

---

## 🔄 Complete Message Flow

### Phase 1: User Sends Message

```
User Action: Types text + uploads image
     ↓
Frontend Processing:
  1. Compress image (max 1024x1024, 70% quality)
  2. Extract base64 data (remove data URL prefix)
  3. Build message content array:
     [
       { type: 'text', text: 'Create repair order...' },
       { type: 'image', imageBase64: '/9j/4AAQ...', mimeType: 'image/jpeg' }
     ]
  4. Add to conversation history
  5. Filter valid messages (skip empty content)
     ↓
API Request: POST /api/llm/chat
{
  "provider": "gemini",
  "messages": [
    {
      "role": "user",
      "content": [
        { "type": "text", "text": "..." },
        { "type": "image", "imageBase64": "...", "mimeType": "image/jpeg" }
      ]
    }
  ]
}
     ↓
Authentication: JWT token added to headers
```

**Frontend Code Example:**
```typescript
const handleSendMessage = async (text: string, images: string[]) => {
  const content: MessageContent[] = [];
  
  // Add text
  if (text.trim()) {
    content.push({ type: 'text', text: text.trim() });
  }
  
  // Add images (base64 only, no data URL prefix)
  images.forEach((imageData) => {
    const base64Data = imageData.split('base64,')[1];
    content.push({
      type: 'image',
      imageBase64: base64Data,
      mimeType: 'image/jpeg'
    });
  });
  
  // Send to API
  await chatAPI.sendMessage({
    provider: 'gemini',
    messages: [{ role: 'user', content }]
  });
};
```

---

### Phase 2: REST Service Receives Request

```
LLM Adapter Service receives request
     ↓
Step 1: Fetch available tools from MCP Server
  Request: POST http://localhost:4000/mcp
  {
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 1
  }
     ↓
MCP Server Response:
  {
    "jsonrpc": "2.0",
    "result": [
      {
        "name": "search_equipment",
        "description": "Search for equipment by name...",
        "inputSchema": { ... }
      },
      {
        "name": "validate_availability",
        "description": "Validates if equipment is available...",
        "inputSchema": { ... }
      },
      {
        "name": "create_repair_order",
        "description": "Creates a new repair order...",
        "inputSchema": { ... }
      },
      {
        "name": "get_repair_orders",
        "description": "Retrieve all repair orders...",
        "inputSchema": { ... }
      }
    ],
    "id": 1
  }
     ↓
Step 2: Initialize iteration loop (max 10 iterations)
Step 3: Convert messages to Gemini format
```

**Backend Code:**
```typescript
async chat(request: ChatRequestDto): Promise<ChatResult> {
  // Fetch tools
  const tools = await this.mcpClient.listTools();
  console.log(`Fetched ${tools.length} tools from MCP server`);
  
  // Track executions
  const allToolsExecuted: string[] = [];
  const allToolResults: ToolExecutionResult[] = [];
  
  // Build conversation
  const conversationHistory: Message[] = [...request.messages];
  
  // Start iteration
  const maxIterations = 10;
  let iteration = 0;
  
  while (iteration < maxIterations) {
    iteration++;
    // ... process iteration
  }
}
```

---

### Phase 3: Gemini Processing (Each Iteration)

```
Iteration Start
     ↓
Convert messages to Gemini format:
  - User messages → role: "user"
  - Assistant messages → role: "model"
  - Text content → { text: "..." }
  - Images → { inlineData: { mimeType: "...", data: "base64..." } }
     ↓
Send to Gemini with tools:
  {
    history: [previous messages],
    tools: [functionDeclarations],
    toolConfig: { functionCallingConfig: { mode: "AUTO" } }
  }
     ↓
Gemini analyzes request and decides:
  Option A: Call tools to get information
  Option B: Provide final text response
```

**Gemini Provider Code:**
```typescript
async chat(messages: Message[], tools: McpTool[]): Promise<ChatResponse> {
  // Convert tools to Gemini format
  const functionDeclarations = tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    parameters: {
      ...tool.inputSchema,
      type: SchemaType.OBJECT,
    },
  }));

  // Convert messages
  const geminiMessages = this.convertMessagesToGeminiFormat(messages);

  // Start chat
  const chat = model.startChat({
    history: geminiMessages.slice(0, -1),
    tools: [{ functionDeclarations }],
    toolConfig: {
      functionCallingConfig: {
        mode: FunctionCallingMode.AUTO,
      },
    },
  });

  // Send last message
  const lastMessage = geminiMessages[geminiMessages.length - 1];
  const result = await chat.sendMessage(lastMessage.parts);

  const response = result.response;
  const functionCalls = response.functionCalls();

  // Return tool calls or text response
  if (functionCalls && functionCalls.length > 0) {
    return {
      message: response.text() || 'Calling tools...',
      toolCalls: functionCalls.map((fc) => ({ ... })),
      finishReason: 'tool_calls',
    };
  }

  return {
    message: response.text(),
    finishReason: 'stop',
  };
}
```

---

### Phase 4: Tool Execution (If Gemini Calls Tools)

```
Gemini Returns Tool Calls:
  [
    {
      id: "call_123",
      type: "function",
      function: {
        name: "search_equipment",
        arguments: '{"query":"laptop"}'
      }
    }
  ]
     ↓
For each tool call:
  1. Parse arguments
  2. Send to MCP Server:
     POST http://localhost:4000/mcp
     {
       "jsonrpc": "2.0",
       "method": "tools/call",
       "params": {
         "name": "search_equipment",
         "arguments": { "query": "laptop" }
       },
       "id": 2
     }
     ↓
  3. MCP Server executes tool:
     - Gets JWT token from request headers
     - Calls backend API with authentication
     - Returns results
     ↓
  4. Collect result:
     {
       "toolName": "search_equipment",
       "result": {
         "success": true,
         "message": "Found 2 equipment(s)",
         "equipments": [
           {
             "id": "abc-123",
             "name": "Dell Latitude 5420",
             "status": "AVAILABLE"
           }
         ]
       },
       "success": true
     }
```

**Tool Execution Code:**
```typescript
async executeTools(toolCalls: ToolCall[]): Promise<ToolExecutionResult[]> {
  const results: ToolExecutionResult[] = [];
  
  for (const toolCall of toolCalls) {
    try {
      const args = JSON.parse(toolCall.function.arguments);
      
      // Call MCP server
      const result = await this.mcpClient.callTool(
        toolCall.function.name,
        args
      );
      
      results.push({
        toolName: toolCall.function.name,
        result: result,
        success: true,
      });
    } catch (error) {
      results.push({
        toolName: toolCall.function.name,
        error: error.message,
        success: false,
      });
    }
  }
  
  return results;
}
```

---

### Phase 5: Adding Tool Results to Conversation

```
After tool execution:
     ↓
Add assistant message to history:
  {
    role: "assistant",
    content: [
      { type: "text", text: "Calling tools..." }
    ]
  }
     ↓
Add tool results as user message:
  {
    role: "user",
    content: [
      {
        type: "text",
        text: "Tool results: [
          {
            toolName: 'search_equipment',
            result: { ... },
            success: true
          }
        ]"
      }
    ]
  }
     ↓
Continue to next iteration
  (Gemini will now see the tool results and can use them)
```

---

### Phase 6: Next Iteration or Final Response

```
If Gemini called tools:
  ↓ Continue iteration (go back to Phase 3)
  ↓ Gemini now has tool results in context
  ↓ Can call more tools or provide final answer

If Gemini provides text (no tool calls):
  ↓ Loop ends
  ↓ Return final response to frontend:
     {
       "response": "I've created repair order #456 for your Dell laptop...",
       "toolsExecuted": ["search_equipment", "create_repair_order"],
       "toolResults": [
         { toolName: "search_equipment", result: {...}, success: true },
         { toolName: "create_repair_order", result: {...}, success: true }
       ]
     }
```

---

### Phase 7: Frontend Displays Response

```
Frontend receives response
     ↓
Create assistant message:
  {
    id: "uuid",
    role: "assistant",
    content: [
      { type: "text", text: "I've created repair order #456..." }
    ],
    timestamp: Date,
    toolsExecuted: ["search_equipment", "create_repair_order"],
    toolResults: [...]
  }
     ↓
Render in UI:
  - Message bubble with text
  - Tool execution badges (green with checkmark)
  - Timestamp
```

---

## 🔁 Iteration System

### How Iterations Work

The LLM Adapter Service uses an **iterative loop** to allow Gemini to call multiple tools sequentially until it has enough information to answer.

```
┌──────────────────────────────────────────┐
│         Iteration Loop (Max 10)          │
├──────────────────────────────────────────┤
│                                          │
│  1. Send conversation + tools to Gemini  │
│           ↓                              │
│  2. Gemini decides action:               │
│     - Call tools? → Execute & continue   │
│     - Have answer? → Return response     │
│           ↓                              │
│  3. If tools called:                     │
│     - Execute all tools in parallel      │
│     - Add results to conversation        │
│     - Increment iteration count          │
│     - Go to step 1                       │
│           ↓                              │
│  4. If text response:                    │
│     - Exit loop                          │
│     - Return final result                │
│                                          │
└──────────────────────────────────────────┘
```

### Why Multiple Iterations?

Some user requests require **multiple steps**:

1. **Search** for equipment
2. **Validate** it's available
3. **Create** repair order

Gemini can't do all at once - it needs to see results from step 1 before deciding step 2.

---

## 📚 Real-World Examples

### Example 1: Simple Tool Call (2 Iterations)

**User Request:**
```
"Show me all my laptops"
```

#### Iteration 1

**Input to Gemini:**
```json
{
  "messages": [
    {
      "role": "user",
      "parts": [{ "text": "Show me all my laptops" }]
    }
  ],
  "tools": ["search_equipment", "validate_availability", "create_repair_order", "get_repair_orders"]
}
```

**Gemini Response:**
```json
{
  "message": "Let me search for your laptops",
  "toolCalls": [
    {
      "function": {
        "name": "search_equipment",
        "arguments": "{\"query\":\"laptop\"}"
      }
    }
  ]
}
```

**Tool Execution:**
```json
// Request to MCP Server
{
  "method": "tools/call",
  "params": {
    "name": "search_equipment",
    "arguments": { "query": "laptop" }
  }
}

// MCP Server calls: GET /api/equipments?query=laptop
// Returns:
{
  "success": true,
  "message": "Found 3 equipment(s) matching 'laptop'",
  "equipments": [
    {
      "id": "eq-001",
      "name": "Dell Latitude 5420",
      "brand": "Dell",
      "model": "Latitude 5420",
      "status": "AVAILABLE"
    },
    {
      "id": "eq-002",
      "name": "HP ProBook 450",
      "brand": "HP",
      "model": "ProBook 450",
      "status": "IN_REPAIR"
    },
    {
      "id": "eq-003",
      "name": "Lenovo ThinkPad X1",
      "brand": "Lenovo",
      "model": "ThinkPad X1",
      "status": "AVAILABLE"
    }
  ]
}
```

**Updated Conversation:**
```json
[
  {
    "role": "user",
    "content": [{ "type": "text", "text": "Show me all my laptops" }]
  },
  {
    "role": "assistant",
    "content": [{ "type": "text", "text": "Let me search for your laptops" }]
  },
  {
    "role": "user",
    "content": [{
      "type": "text",
      "text": "Tool results: [{ toolName: 'search_equipment', result: {...}, success: true }]"
    }]
  }
]
```

#### Iteration 2

**Input to Gemini:**
```json
{
  "messages": [
    /* Full conversation including tool results */
  ]
}
```

**Gemini Response:**
```json
{
  "message": "I found 3 laptops in your inventory:\n\n1. **Dell Latitude 5420** (ID: eq-001)\n   - Status: Available ✅\n   - Brand: Dell\n\n2. **HP ProBook 450** (ID: eq-002)\n   - Status: In Repair 🔧\n   - Brand: HP\n\n3. **Lenovo ThinkPad X1** (ID: eq-003)\n   - Status: Available ✅\n   - Brand: Lenovo\n\nTwo laptops are currently available, and one is being repaired.",
  "finishReason": "stop"
}
```

**Final Response to Frontend:**
```json
{
  "response": "I found 3 laptops in your inventory:\n\n1. **Dell Latitude 5420**...",
  "toolsExecuted": ["search_equipment"],
  "toolResults": [
    {
      "toolName": "search_equipment",
      "result": { "success": true, "equipments": [...] },
      "success": true
    }
  ]
}
```

---

### Example 2: Multi-Step Process (4 Iterations)

**User Request:**
```
"Create a repair order for my Dell laptop. The screen is broken."
+ [image of broken screen]
```

#### Iteration 1: Search Equipment

**Input to Gemini:**
```json
{
  "messages": [
    {
      "role": "user",
      "parts": [
        { "text": "Create a repair order for my Dell laptop. The screen is broken." },
        { "inlineData": { "mimeType": "image/jpeg", "data": "base64..." } }
      ]
    }
  ]
}
```

**Gemini Decision:** "I need to find the Dell laptop first"

**Tool Call:**
```json
{
  "function": {
    "name": "search_equipment",
    "arguments": "{\"query\":\"Dell laptop\"}"
  }
}
```

**Tool Result:**
```json
{
  "success": true,
  "equipments": [
    {
      "id": "eq-001",
      "name": "Dell Latitude 5420",
      "status": "AVAILABLE"
    }
  ]
}
```

#### Iteration 2: Validate Availability

**Gemini sees equipment found, now checks if it can be repaired**

**Tool Call:**
```json
{
  "function": {
    "name": "validate_availability",
    "arguments": "{\"equipmentId\":\"eq-001\"}"
  }
}
```

**Tool Result:**
```json
{
  "success": true,
  "available": true,
  "message": "Equipment available for repair order creation.",
  "equipment": {
    "id": "eq-001",
    "name": "Dell Latitude 5420",
    "status": "AVAILABLE"
  }
}
```

#### Iteration 3: Create Repair Order

**Gemini has verified equipment exists and is available, now creates order**

**Tool Call:**
```json
{
  "function": {
    "name": "create_repair_order",
    "arguments": "{\"equipmentId\":\"eq-001\",\"problemDescription\":\"Screen is broken. User provided image showing cracked display.\"}"
  }
}
```

**Tool Execution:**
```
MCP Server → POST /api/repair-orders
{
  "equipmentId": "eq-001",
  "problemDescription": "Screen is broken. User provided image showing cracked display."
}

Backend creates repair order and updates equipment status to IN_REPAIR
```

**Tool Result:**
```json
{
  "success": true,
  "message": "Repair order created successfully",
  "repairOrder": {
    "id": "ro-789",
    "equipmentId": "eq-001",
    "equipmentName": "Dell Latitude 5420",
    "problemDescription": "Screen is broken...",
    "status": "PENDING",
    "createdAt": "2026-01-17T10:30:00Z"
  }
}
```

#### Iteration 4: Final Response

**Gemini has all information, provides summary**

**Response:**
```
I've successfully created repair order #ro-789 for your Dell Latitude 5420.

📋 **Repair Order Details:**
- Order ID: ro-789
- Equipment: Dell Latitude 5420
- Problem: Screen is broken (as shown in the image you provided)
- Status: Pending assignment
- Created: January 17, 2026

The equipment has been marked as "In Repair" and a technician will be assigned soon. You'll receive notifications about the repair progress.

Is there anything else I can help you with?
```

**Final Response Object:**
```json
{
  "response": "I've successfully created repair order #ro-789...",
  "toolsExecuted": [
    "search_equipment",
    "validate_availability",
    "create_repair_order"
  ],
  "toolResults": [
    {
      "toolName": "search_equipment",
      "result": { "success": true, "equipments": [...] },
      "success": true
    },
    {
      "toolName": "validate_availability",
      "result": { "success": true, "available": true, ... },
      "success": true
    },
    {
      "toolName": "create_repair_order",
      "result": { "success": true, "repairOrder": {...} },
      "success": true
    }
  ]
}
```

---

### Example 3: Complex Request with Error Recovery (5 Iterations)

**User Request:**
```
"I need to fix my laptop that's already being repaired"
```

#### Iteration 1: Search Equipment

**Tool Call:** `search_equipment` with query "laptop"

**Result:** Found equipment `eq-002` (Status: IN_REPAIR)

#### Iteration 2: Validate Availability

**Tool Call:** `validate_availability` for equipment `eq-002`

**Result:**
```json
{
  "success": false,
  "available": false,
  "message": "The equipment is already under repair. A new order cannot be created.",
  "equipment": {
    "id": "eq-002",
    "status": "IN_REPAIR"
  }
}
```

#### Iteration 3: Get Existing Orders

**Gemini realizes equipment is already being repaired, checks existing orders**

**Tool Call:** `get_repair_orders` for equipment `eq-002`

**Result:**
```json
{
  "success": true,
  "message": "Found 1 repair order(s)",
  "repairOrders": [
    {
      "id": "ro-555",
      "problemDescription": "Screen not turning on",
      "status": "IN_REPAIR",
      "technician": {
        "name": "John Smith"
      },
      "createdAt": "2026-01-15T14:20:00Z"
    }
  ]
}
```

#### Iteration 4: Final Response with Information

**Gemini provides helpful response instead of creating duplicate order**

**Response:**
```
I see that your laptop (HP ProBook 450) is already being repaired. Here's the existing repair order:

🔧 **Active Repair Order:**
- Order ID: ro-555
- Problem: Screen not turning on
- Status: Currently being repaired
- Technician: John Smith
- Started: January 15, 2026

Since there's already an active repair order, I cannot create a new one. However, if you have additional issues or concerns about this repair, I recommend:

1. Contacting the assigned technician (John Smith)
2. Waiting for the current repair to complete
3. Creating a new order if issues persist after completion

Would you like me to help you with anything else?
```

**Tool Executions:**
```json
{
  "toolsExecuted": [
    "search_equipment",
    "validate_availability",
    "get_repair_orders"
  ],
  "toolResults": [...]
}
```

---

## 🔧 Technical Details

### Message Format Transformations

#### Frontend → Backend
```typescript
// Frontend sends
{
  role: 'user',
  content: [
    { type: 'text', text: 'Hello' },
    { type: 'image', imageBase64: 'base64data', mimeType: 'image/jpeg' }
  ]
}
```

#### Backend → Gemini
```typescript
// Gemini format
{
  role: 'user',  // or 'model' for assistant
  parts: [
    { text: 'Hello' },
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: 'base64data'
      }
    }
  ]
}
```

### Tool Call Format

#### Gemini Tool Declaration
```typescript
{
  name: 'create_repair_order',
  description: 'Creates a new repair order for equipment',
  parameters: {
    type: 'object',
    properties: {
      equipmentId: {
        type: 'string',
        description: 'Unique ID of the equipment'
      },
      problemDescription: {
        type: 'string',
        description: 'Description of the problem'
      }
    },
    required: ['equipmentId', 'problemDescription']
  }
}
```

#### Gemini Tool Call Response
```typescript
{
  name: 'create_repair_order',
  args: {
    equipmentId: 'eq-001',
    problemDescription: 'Screen is broken'
  }
}
```

#### MCP Server Request
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "create_repair_order",
    "arguments": {
      "equipmentId": "eq-001",
      "problemDescription": "Screen is broken"
    }
  },
  "id": 2
}
```

### Error Handling

#### Tool Execution Failure
```typescript
// If tool fails
{
  toolName: 'create_repair_order',
  error: 'Equipment not found',
  success: false
}

// Gemini sees the error in next iteration and can:
// 1. Retry with different parameters
// 2. Try alternative approach
// 3. Explain error to user
```

#### Max Iterations Reached
```typescript
if (iteration >= maxIterations) {
  return {
    response: 'I executed multiple tools but need more iterations to complete. Please try again or rephrase your request.',
    toolsExecuted: allToolsExecuted,
    toolResults: allToolResults,
  };
}
```

### Performance Optimizations

#### Message History Limiting
```typescript
// Frontend sends only last 10 messages for performance
messages.slice(-10).filter(msg => msg.content.length > 0)
```

#### Image Compression
```typescript
// Compress to 1024x1024, 70% quality
const MAX_WIDTH = 1024;
const MAX_HEIGHT = 1024;
canvas.toDataURL('image/jpeg', 0.7);
```

#### Parallel Tool Execution
```typescript
// Execute multiple tool calls in parallel
const results = await Promise.all(
  toolCalls.map(tc => this.mcpClient.callTool(tc.name, tc.args))
);
```

---

## 🎯 Summary

### Complete Flow in One Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Sends Message                       │
│              (Text: "Fix my laptop" + Image)                    │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Processing                          │
│  • Compress image (1024x1024, 70% quality)                      │
│  • Extract base64 (no data URL prefix)                          │
│  • Build content array                                          │
│  • Add to conversation history                                  │
│  • Filter valid messages                                        │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                 POST /api/llm/chat (Authenticated)              │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│               LLM Adapter Service (Orchestrator)                │
│  1. Fetch tools from MCP Server                                 │
│  2. Initialize iteration loop                                   │
│  3. Track all tool executions                                   │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
        ┌────────────────────────────────────┐
        │     ITERATION LOOP (Max 10)        │
        └────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Gemini Provider                              │
│  • Convert messages to Gemini format                            │
│  • Send to Gemini with tools                                    │
│  • Get response (tool calls or text)                            │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
                    ┌────────┴─────────┐
                    │                  │
                    ↓                  ↓
        ┌───────────────────┐  ┌──────────────┐
        │   Tool Calls?     │  │  Text Only?  │
        │   (function_call) │  │   (stop)     │
        └─────────┬─────────┘  └──────┬───────┘
                  ↓                    ↓
        ┌───────────────────┐         │
        │  Execute Tools    │         │
        │  via MCP Server   │         │
        └─────────┬─────────┘         │
                  ↓                    │
        ┌───────────────────┐         │
        │  Add Results to   │         │
        │  Conversation     │         │
        └─────────┬─────────┘         │
                  ↓                    │
           Continue Loop               │
                  ↑                    │
                  └────────────────────┘
                            ↓
                   ┌─────────────────┐
                   │  Return Final   │
                   │    Response     │
                   └────────┬────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Displays                            │
│  • Text message bubble                                          │
│  • Tool execution badges (green checkmarks)                     │
│  • Timestamp                                                    │
│  • Save to localStorage                                         │
└─────────────────────────────────────────────────────────────────┘
```

### Key Takeaways

1. **Iterative Process**: Gemini can call tools multiple times until it has enough information
2. **Tool Results as Context**: Each tool result is added to the conversation for Gemini to see
3. **Max 10 Iterations**: Prevents infinite loops
4. **Parallel Execution**: Multiple tool calls in one iteration execute in parallel
5. **Error Recovery**: Failed tools are reported to Gemini, which can retry or explain to user
6. **Multimodal Support**: Images are compressed and sent as base64 inline data
7. **Authentication Flow**: JWT token propagates from frontend → REST service → MCP server → backend APIs
8. **Smart Filtering**: Empty messages are filtered to prevent Gemini API errors

---

## 📖 Additional Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Model Context Protocol (MCP) Spec](https://modelcontextprotocol.io)
- [NestJS Documentation](https://docs.nestjs.com)
- [React Documentation](https://react.dev)

---

**Last Updated**: January 17, 2026
