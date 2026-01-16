# 🔄 LLM Adapter Service - Complete Explanation

## 📚 Table of Contents
1. [What is the LLM Adapter Service?](#what-is-the-llm-adapter-service)
2. [Architecture Overview](#architecture-overview)
3. [How It Works with Providers](#how-it-works-with-providers)
4. [The Conversation Flow](#the-conversation-flow)
5. [Code Walkthrough](#code-walkthrough)
6. [Real-World Example](#real-world-example)

---

## 🎯 What is the LLM Adapter Service?

### The Problem It Solves

Imagine you have multiple AI providers (Gemini, OpenAI, Claude, etc.) and you want to:
- Switch between them easily
- Let the AI use tools (like creating repair orders)
- Handle complex multi-step conversations
- Not rewrite your entire codebase when adding a new provider

**The LLM Adapter Service is your solution!** 🎉

### What It Does

The service is like a **smart coordinator** that:

1. **Receives chat requests** from your API
2. **Chooses the right AI provider** (Gemini, OpenAI, etc.)
3. **Fetches available tools** from your MCP server
4. **Sends messages to the AI** with tool descriptions
5. **Executes tools** when AI requests them
6. **Continues the conversation** until AI has a final answer
7. **Returns the result** to your API

---

## 🏗️ Architecture Overview

### The Big Picture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Your Application                         │
│                     (Controllers/Routes)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │ ChatRequestDto
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LLM ADAPTER SERVICE                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  1. Choose Provider (Gemini/OpenAI)                      │  │
│  │  2. Get Tools from MCP Server                            │  │
│  │  3. Manage Conversation Loop                             │  │
│  │  4. Execute Tools                                        │  │
│  │  5. Return Final Response                                │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────┬─────────────────────────────────┬────────────────────────┘
       │                                 │
       │ Provider Interface              │ MCP Client
       ▼                                 ▼
┌──────────────────┐            ┌─────────────────┐
│  Gemini Provider │            │   MCP Server    │
│  OpenAI Provider │            │  (Tool Server)  │
└──────────────────┘            └─────────────────┘
       │                                 │
       ▼                                 ▼
┌──────────────────┐            ┌─────────────────┐
│  Google Gemini   │            │  Your Backend   │
│  OpenAI GPT      │            │   (REST API)    │
└──────────────────┘            └─────────────────┘
```

### Key Components

| Component | Role | Example |
|-----------|------|---------|
| **LLMAdapterService** | Orchestrates everything | Main coordinator |
| **ILLMProvider** | Interface all providers implement | Contract/Blueprint |
| **GeminiProvider** | Talks to Google's Gemini API | Concrete implementation |
| **OpenAIProvider** | Talks to OpenAI's API | Concrete implementation |
| **MCPClient** | Communicates with MCP Server | Tool executor |
| **ChatRequestDto** | Validates incoming requests | Input validator |

---

## 🤝 How It Works with Providers

### The Strategy Pattern

The service uses the **Strategy Pattern** - a design pattern that lets you switch between different implementations (providers) without changing your code.

#### What's a Provider?

A provider is a class that knows how to talk to a specific AI service.

**Interface (Contract):**
```typescript
interface ILLMProvider {
  chat(messages: Message[], tools: MCPTool[]): Promise<ChatResponse>;
}
```

This says: "Any provider MUST have a `chat` method that takes messages and tools, and returns a ChatResponse."

**Implementations:**

```typescript
// Gemini Provider - Talks to Google
class GeminiProvider implements ILLMProvider {
  async chat(messages: Message[], tools: MCPTool[]): Promise<ChatResponse> {
    // Convert to Gemini format
    // Call Google's API
    // Return response
  }
}

// OpenAI Provider - Talks to OpenAI
class OpenAIProvider implements ILLMProvider {
  async chat(messages: Message[], tools: MCPTool[]): Promise<ChatResponse> {
    // Convert to OpenAI format
    // Call OpenAI's API
    // Return response
  }
}
```

### Provider Registry

The service maintains a **Map** of available providers:

```typescript
private providers: Map<string, ILLMProvider>;

constructor(
  private readonly geminiProvider: GeminiProvider,
  private readonly openaiProvider: OpenAIProvider,
) {
  this.providers = new Map<string, ILLMProvider>([
    ['gemini', this.geminiProvider],
    ['openai', this.openaiProvider],
  ]);
}
```

**What's a Map?**
- Like a dictionary: key → value
- Key: Provider name (`'gemini'`, `'openai'`)
- Value: Provider instance (GeminiProvider, OpenAIProvider)

**Example:**
```typescript
// Get a provider by name
const provider = this.providers.get('gemini');
// Returns: GeminiProvider instance

const provider = this.providers.get('openai');
// Returns: OpenAIProvider instance
```

### Selecting a Provider

```typescript
private getProvider(name: string): ILLMProvider {
  const provider = this.providers.get(name);
  if (!provider) {
    throw new BadRequestException(
      `Provider "${name}" not supported. Available: ${Array.from(this.providers.keys()).join(', ')}`
    );
  }
  return provider;
}
```

**What happens:**
1. Try to get provider from Map
2. If not found, throw error with helpful message
3. If found, return the provider

**Example:**
```typescript
// Valid request
const provider = this.getProvider('gemini');  // ✅ Returns GeminiProvider

// Invalid request
const provider = this.getProvider('claude');  // ❌ Throws error: "Provider "claude" not supported. Available: gemini, openai"
```

**Why is this useful?**
- Want to add Claude support? Just add to the Map!
- Want to remove a provider? Just remove from Map!
- No need to change the rest of your code!

---

## 🔄 The Conversation Flow

### Overview

The service manages an **iterative conversation loop**:

```
1. User sends request
2. Get tools from MCP
3. Send to AI
4. AI wants to use tools? → Execute them → Go back to step 3
5. AI has final answer? → Return to user
```

### Why a Loop?

AI might need **multiple rounds** to complete a task:

**Example:**
```
User: "Create a high-priority repair order for the broken laptop in office A"

Round 1:
  AI: "I need to search for equipment first"
  Tool Call: search_equipment(query: "laptop office A")
  Tool Result: Found equipment ID "eq-123"

Round 2:
  AI: "Now I'll create the repair order"
  Tool Call: create_repair_order(equipmentId: "eq-123", priority: "HIGH", ...)
  Tool Result: Repair order created successfully

Round 3:
  AI: "Done! I've created repair order #456 for equipment eq-123"
  No tool calls - FINAL ANSWER
```

Without the loop, AI could only do ONE tool call per request!

### The Main Loop

```typescript
const maxIterations = 5; // Safety limit
let iteration = 0;

while (iteration < maxIterations) {
  iteration++;
  
  // Send conversation to AI
  const response = await provider.chat(conversationHistory, tools);
  
  // Does AI want to call tools?
  if (response.toolCalls && response.toolCalls.length > 0) {
    // Execute tools
    const toolResults = await this.executeTools(response.toolCalls);
    
    // Add AI's response to conversation
    conversationHistory.push({
      role: 'assistant',
      content: [{ type: 'text', text: response.message || 'Calling tools...' }]
    });
    
    // Add tool results to conversation
    conversationHistory.push({
      role: 'user',
      content: [{ type: 'text', text: `Tool results: ${JSON.stringify(toolResults)}` }]
    });
    
    // Continue loop - let AI process results
    continue;
  }
  
  // No tool calls - AI has final answer!
  return {
    response: response.message,
    toolsExecuted: [...],
    toolResults: [...]
  };
}
```

**Key Concepts:**

1. **`maxIterations = 5`**: Safety limit to prevent infinite loops
2. **`conversationHistory`**: Array of all messages (user + assistant + tool results)
3. **Tool execution**: If AI requests tools, execute them and add results to history
4. **Continue loop**: Go back and let AI process the tool results
5. **Exit condition**: No tool calls = final answer ready

---

## 📝 Code Walkthrough

Let's go through the service **line by line**!

### 1. Constructor - Setting Up

```typescript
constructor(
  private readonly mcpClient: MCPClient,
  private readonly geminiProvider: GeminiProvider,
  private readonly openaiProvider: OpenAIProvider,
) {
  // Initialize provider registry
  this.providers = new Map<string, ILLMProvider>([
    ['gemini', this.geminiProvider],
    ['openai', this.openaiProvider],
  ]);
}
```

**What's happening:**

1. **Dependency Injection**: NestJS automatically creates and injects these classes
   - `mcpClient`: For calling MCP tools
   - `geminiProvider`: For talking to Gemini
   - `openaiProvider`: For talking to OpenAI

2. **Provider Registry**: Create a Map to store providers
   - Makes it easy to get a provider by name
   - Easy to add new providers in the future

**Why `private readonly`?**
- `private`: Can't access from outside the class
- `readonly`: Can't reassign after construction
- Prevents accidental modifications

---

### 2. Main Chat Method - Entry Point

```typescript
async chat(request: ChatRequestDto): Promise<ChatResult> {
```

This is the **main method** - the entry point for all chat requests.

**Parameters:**
- `request: ChatRequestDto`: Validated request with messages and provider choice

**Returns:**
- `Promise<ChatResult>`: Final response with tool execution info

---

#### Step 2.1: Choose Provider

```typescript
const provider = this.getProvider(request.provider || 'gemini');
```

**What happens:**
- Get provider name from request (default to 'gemini')
- Call `getProvider()` to get the provider instance
- Throws error if provider doesn't exist

**Example:**
```typescript
// Request specifies gemini
request.provider = 'gemini';
const provider = this.getProvider('gemini');  // Returns GeminiProvider

// Request doesn't specify provider
request.provider = undefined;
const provider = this.getProvider('gemini');  // Returns GeminiProvider (default)
```

---

#### Step 2.2: Fetch Available Tools

```typescript
const tools = await this.mcpClient.listTools();
console.log(`Fetched ${tools.length} tools from MCP server`);
```

**What happens:**
- Ask MCP server: "What tools are available?"
- MCP returns list of tools (create_repair_order, search_equipment, etc.)
- These tools will be sent to the AI so it knows what it can do

**Example response:**
```typescript
[
  {
    name: 'create_repair_order',
    description: 'Creates a new repair order',
    inputSchema: {
      type: 'object',
      properties: {
        equipmentId: { type: 'string' },
        problemDescription: { type: 'string' }
      }
    }
  },
  {
    name: 'search_equipment',
    description: 'Searches for equipment by name',
    inputSchema: { ... }
  }
]
```

**Why fetch tools every time?**
- Tools might change (new tools added, old ones removed)
- Always have the latest available tools
- MCP server is the single source of truth

---

#### Step 2.3: Initialize Tracking Variables

```typescript
const allToolsExecuted: string[] = [];
const allToolResults: ToolExecutionResult[] = [];
```

**What are these?**
- `allToolsExecuted`: Array of tool names that were called
- `allToolResults`: Array of tool execution results

**Why track these?**
- User wants to know what happened
- Debugging and logging
- Frontend can show "Tools used: search_equipment, create_repair_order"

**Example at end:**
```typescript
{
  response: "Repair order created!",
  toolsExecuted: ['search_equipment', 'create_repair_order'],
  toolResults: [
    { toolName: 'search_equipment', result: {...}, success: true },
    { toolName: 'create_repair_order', result: {...}, success: true }
  ]
}
```

---

#### Step 2.4: Build Conversation History

```typescript
const conversationHistory: Message[] = [...request.messages];
```

**What's `[...request.messages]`?**
- Spread operator: Creates a **copy** of the array
- Why copy? We'll modify it (add AI responses and tool results)
- Don't want to modify the original request

**Example:**
```typescript
// Original request
request.messages = [
  { role: 'user', content: [{ type: 'text', text: 'Create repair order' }] }
];

// Create copy
const conversationHistory = [...request.messages];

// Add to history (doesn't affect original)
conversationHistory.push({ role: 'assistant', content: [...] });

// request.messages is unchanged ✅
```

---

#### Step 2.5: The Main Iteration Loop

```typescript
const maxIterations = 5;
let iteration = 0;

while (iteration < maxIterations) {
  iteration++;
  console.log(`\n=== Iteration ${iteration} ===`);
```

**Why a loop?**
- AI might need multiple tool calls to complete task
- Example: Search for equipment, THEN create repair order

**Why `maxIterations = 5`?**
- Safety mechanism to prevent infinite loops
- If AI keeps requesting tools forever, stop after 5 rounds
- Prevents wasting API calls and money

**Example scenario that needs multiple iterations:**
```
Iteration 1: AI searches for equipment
Iteration 2: AI creates repair order with equipment ID
Iteration 3: AI searches for available technicians
Iteration 4: AI assigns technician to repair order
Iteration 5: AI provides final summary
```

---

#### Step 2.6: Send to AI Provider

```typescript
const response = await provider.chat(conversationHistory, tools);
console.log(`LLM response: ${response.message?.substring(0, 100) || 'Tool calls only'}...`);
```

**What happens:**
1. Call provider's `chat` method (Gemini or OpenAI)
2. Pass conversation history and available tools
3. Wait for response (async/await)
4. Log the response (truncated to 100 chars for console)

**What does the provider do?**
- Converts messages to provider-specific format
- Sends to AI API (Google or OpenAI)
- Converts response back to our format
- Returns ChatResponse

**Response structure:**
```typescript
{
  message: "I'll create a repair order for you.",
  toolCalls: [
    {
      id: 'call_123',
      type: 'function',
      function: {
        name: 'create_repair_order',
        arguments: '{"equipmentId":"eq-123","problemDescription":"Broken screen"}'
      }
    }
  ],
  finishReason: 'tool_calls'
}
```

---

#### Step 2.7: Check for Tool Calls

```typescript
if (response.toolCalls && response.toolCalls.length > 0) {
  console.log(`Executing ${response.toolCalls.length} tool call(s)`);
  
  const toolResults = await this.executeTools(response.toolCalls);
```

**What's happening:**
- Check if AI wants to call any tools
- `response.toolCalls` is an array of tool calls
- If array exists and has items, execute them

**Why the checks?**
```typescript
response.toolCalls && response.toolCalls.length > 0
```

- `response.toolCalls`: Might be undefined or null
- `response.toolCalls.length > 0`: Might be empty array
- Both checks ensure we only proceed if there are actual tool calls

**Example:**
```typescript
// AI wants to call tools
response.toolCalls = [
  { function: { name: 'search_equipment', arguments: '{"query":"laptop"}' } }
];
// Condition is TRUE ✅

// AI doesn't want to call tools
response.toolCalls = [];
// Condition is FALSE ❌

// AI doesn't have tool calls property
response.toolCalls = undefined;
// Condition is FALSE ❌
```

---

#### Step 2.8: Execute Tools

```typescript
const toolResults = await this.executeTools(response.toolCalls);
```

Calls the private method to execute all tool calls. We'll explain this method later!

---

#### Step 2.9: Track Tool Executions

```typescript
allToolsExecuted.push(...response.toolCalls.map(tc => tc.function.name));
allToolResults.push(...toolResults);
```

**What's happening:**

1. **Extract tool names:**
   ```typescript
   response.toolCalls.map(tc => tc.function.name)
   // Example: ['search_equipment', 'create_repair_order']
   ```

2. **Add to tracking array:**
   ```typescript
   allToolsExecuted.push(...['search_equipment', 'create_repair_order'])
   // Now: ['search_equipment', 'create_repair_order']
   ```

3. **Track results:**
   ```typescript
   allToolResults.push(...toolResults)
   // Adds all results to the array
   ```

**Why `...` (spread)?**
- `push(...array)` adds all items individually
- `push(array)` would add the array as a single item

**Example:**
```typescript
const arr = [1, 2];

arr.push(...[3, 4]);  // arr = [1, 2, 3, 4] ✅
arr.push([3, 4]);     // arr = [1, 2, [3, 4]] ❌ (nested array)
```

---

#### Step 2.10: Add AI Response to History

```typescript
conversationHistory.push({
  role: 'assistant',
  content: [
    {
      type: 'text',
      text: response.message || 'Calling tools...'
    }
  ],
});
```

**What's happening:**
- Add AI's message to conversation history
- Role is 'assistant' (the AI)
- Content is array format (as required by our new structure)
- Use `response.message` or fallback to 'Calling tools...'

**Why add this?**
- Maintain conversation context
- AI needs to see its own previous responses
- Creates a complete conversation thread

**Example conversation history after this:**
```typescript
[
  { role: 'user', content: [{ type: 'text', text: 'Create repair order' }] },
  { role: 'assistant', content: [{ type: 'text', text: 'I will create a repair order' }] }
]
```

---

#### Step 2.11: Add Tool Results to History

```typescript
conversationHistory.push({
  role: 'user',
  content: [
    {
      type: 'text',
      text: `Tool results: ${JSON.stringify(toolResults, null, 2)}`
    }
  ],
});
```

**What's happening:**
- Add tool execution results to conversation
- Role is 'user' (treating tool results as user input)
- Convert results to JSON string for AI to read

**Why role 'user'?**
- AI expects alternating user/assistant messages
- Tool results are "information from the outside world"
- Similar to user providing information

**Example:**
```typescript
// Tool results
toolResults = [
  {
    toolName: 'search_equipment',
    result: { equipment: { id: 'eq-123', name: 'Laptop' } },
    success: true
  }
];

// Added to history as:
{
  role: 'user',
  content: [{
    type: 'text',
    text: `Tool results: [
      {
        "toolName": "search_equipment",
        "result": { "equipment": { "id": "eq-123", "name": "Laptop" } },
        "success": true
      }
    ]`
  }]
}
```

**Why `JSON.stringify(toolResults, null, 2)`?**
- Converts object to string (AI can read strings)
- `null, 2`: Pretty-print with 2-space indentation
- Makes it readable for AI

---

#### Step 2.12: Continue Loop

```typescript
console.log('Tool results added to conversation. Continuing iteration...');
continue;
```

**What happens:**
- Log that we're continuing
- `continue`: Go back to top of while loop
- Next iteration: AI will see the tool results and decide next action

**Why continue?**
- AI needs to process the tool results
- Might need to call more tools
- Might have final answer ready

---

#### Step 2.13: Return Final Answer

```typescript
// No more tool calls - LLM has provided final answer
console.log('No tool calls. Returning final response.');
return {
  response: response.message,
  toolsExecuted: allToolsExecuted,
  toolResults: allToolResults.length > 0 ? allToolResults : undefined,
};
```

**When does this run?**
- When AI doesn't request any tool calls
- Means AI has final answer ready

**What's returned:**
```typescript
{
  response: "I've created repair order #456 for equipment eq-123",
  toolsExecuted: ['search_equipment', 'create_repair_order'],
  toolResults: [...]  // Or undefined if no tools were used
}
```

**Why `allToolResults.length > 0 ? allToolResults : undefined`?**
- Only include `toolResults` if there are any
- If no tools were used, return `undefined` (cleaner response)

---

#### Step 2.14: Max Iterations Reached

```typescript
// Max iterations reached
console.warn(`Max iterations (${maxIterations}) reached`);
return {
  response: 'I executed multiple tools but need more iterations to complete. Please try again or rephrase your request.',
  toolsExecuted: allToolsExecuted,
  toolResults: allToolResults,
};
```

**When does this run?**
- After 5 iterations without final answer
- AI kept calling tools but never finished

**Why is this necessary?**
- Prevents infinite loops
- Prevents excessive API costs
- Gives user feedback about what happened

**Example scenario:**
- User asks something extremely complex
- AI calls 5+ tools in sequence
- Still doesn't have complete answer
- Better to stop and let user rephrase

---

### 3. Execute Tools Method

```typescript
private async executeTools(toolCalls: ToolCall[]): Promise<ToolExecutionResult[]> {
  const results: ToolExecutionResult[] = [];

  for (const call of toolCalls) {
    try {
      const args = JSON.parse(call.function.arguments) as Record<string, unknown>;
      const result = await this.mcpClient.callTool(call.function.name, args);
      
      results.push({
        toolName: call.function.name,
        result,
        success: true,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      results.push({
        toolName: call.function.name,
        error: errorMessage,
        success: false,
      });
    }
  }

  return results;
}
```

**What does this method do?**
Executes all tool calls and collects results.

---

#### Step 3.1: Initialize Results Array

```typescript
const results: ToolExecutionResult[] = [];
```

Empty array to collect all results.

---

#### Step 3.2: Loop Through Tool Calls

```typescript
for (const call of toolCalls) {
```

Execute each tool call one by one.

**Why not in parallel?**
- Some tools might depend on previous results
- Easier to debug when sequential
- Could be optimized later if needed

---

#### Step 3.3: Parse Arguments

```typescript
const args = JSON.parse(call.function.arguments) as Record<string, unknown>;
```

**What's happening:**
- `call.function.arguments` is a JSON string
- `JSON.parse()` converts to JavaScript object
- `as Record<string, unknown>` is TypeScript type assertion

**Example:**
```typescript
// AI provides
call.function.arguments = '{"equipmentId":"eq-123","priority":"HIGH"}'

// After parsing
args = {
  equipmentId: "eq-123",
  priority: "HIGH"
}
```

**What's `Record<string, unknown>`?**
- An object where keys are strings
- Values can be anything (unknown type)
- Like: `{ key1: value1, key2: value2, ... }`

---

#### Step 3.4: Call MCP Tool

```typescript
const result = await this.mcpClient.callTool(call.function.name, args);
```

**What happens:**
1. MCP client sends request to MCP server
2. MCP server calls your backend API
3. Backend executes the operation (create repair order, etc.)
4. Result comes back through MCP client

**Example:**
```typescript
// Call
this.mcpClient.callTool('create_repair_order', {
  equipmentId: 'eq-123',
  problemDescription: 'Broken screen'
})

// Returns
{
  success: true,
  repairOrder: {
    id: 'repair-456',
    equipmentId: 'eq-123',
    status: 'PENDING'
  }
}
```

---

#### Step 3.5: Store Success Result

```typescript
results.push({
  toolName: call.function.name,
  result,
  success: true,
});
```

Add successful result to array.

---

#### Step 3.6: Handle Errors

```typescript
catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  results.push({
    toolName: call.function.name,
    error: errorMessage,
    success: false,
  });
}
```

**What happens:**
- If tool execution fails, catch the error
- Extract error message
- Add error result to array (with `success: false`)

**Why continue instead of throwing?**
- We want to know about all tool results, including failures
- AI can decide how to handle the error
- Partial success is better than complete failure

**Example:**
```typescript
// Tool 1 succeeds
{ toolName: 'search_equipment', result: {...}, success: true }

// Tool 2 fails
{ toolName: 'create_repair_order', error: 'Equipment not found', success: false }

// Both are returned to AI
// AI can say: "I found the equipment but couldn't create the order because..."
```

---

### 4. Get Provider Method

```typescript
private getProvider(name: string): ILLMProvider {
  const provider = this.providers.get(name);
  if (!provider) {
    throw new BadRequestException(
      `Provider "${name}" not supported. Available: ${Array.from(this.providers.keys()).join(', ')}`
    );
  }
  return provider;
}
```

We covered this earlier, but let's break down the error message:

```typescript
`Provider "${name}" not supported. Available: ${Array.from(this.providers.keys()).join(', ')}`
```

**What does this do?**
1. `this.providers.keys()`: Gets all provider names from Map
2. `Array.from()`: Converts to array
3. `.join(', ')`: Joins array items with commas
4. Result: `"Provider "claude" not supported. Available: gemini, openai"`

---

### 5. Get Available Tools Method

```typescript
async getAvailableTools() {
  return this.mcpClient.listTools();
}
```

**Simple utility method:**
- Exposes MCP tools to other parts of your application
- Useful for debugging or showing available tools to users

---

## 🎬 Real-World Example

Let's trace a complete request through the entire system!

### User Request

```json
POST /api/llm/chat
{
  "provider": "gemini",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Create a high-priority repair order for the laptop in office A with a cracked screen"
        }
      ]
    }
  ]
}
```

---

### Execution Flow

#### **Iteration 1**

1. **Service receives request**
   ```typescript
   const provider = this.getProvider('gemini');  // Get GeminiProvider
   const tools = await this.mcpClient.listTools(); // Get available tools
   ```

2. **Send to Gemini**
   ```typescript
   const response = await provider.chat(conversationHistory, tools);
   ```

3. **Gemini analyzes and responds**
   ```typescript
   {
     message: "I need to search for the laptop first to get its equipment ID.",
     toolCalls: [{
       function: {
         name: 'search_equipment',
         arguments: '{"query":"laptop office A"}'
       }
     }],
     finishReason: 'tool_calls'
   }
   ```

4. **Execute tool**
   ```typescript
   const toolResults = await this.executeTools([...]);
   // MCP calls: GET /api/equipments/search?query=laptop%20office%20A
   ```

5. **Tool result**
   ```typescript
   [{
     toolName: 'search_equipment',
     result: {
       equipment: {
         id: 'eq-789',
         name: 'Laptop - Office A',
         type: 'Computer'
       }
     },
     success: true
   }]
   ```

6. **Add to conversation history**
   ```typescript
   conversationHistory = [
     { role: 'user', content: [{ type: 'text', text: 'Create a high-priority repair order...' }] },
     { role: 'assistant', content: [{ type: 'text', text: 'I need to search for the laptop first...' }] },
     { role: 'user', content: [{ type: 'text', text: 'Tool results: [{"toolName":"search_equipment",...}]' }] }
   ]
   ```

7. **Continue loop** (`continue`)

---

#### **Iteration 2**

1. **Send updated conversation to Gemini**
   - Includes previous messages + tool results

2. **Gemini processes tool results and responds**
   ```typescript
   {
     message: "I found the laptop (ID: eq-789). Now I'll create the repair order.",
     toolCalls: [{
       function: {
         name: 'create_repair_order',
         arguments: '{"equipmentId":"eq-789","problemDescription":"Cracked screen","priority":"HIGH"}'
       }
     }],
     finishReason: 'tool_calls'
   }
   ```

3. **Execute tool**
   ```typescript
   const toolResults = await this.executeTools([...]);
   // MCP calls: POST /api/repair-orders
   ```

4. **Tool result**
   ```typescript
   [{
     toolName: 'create_repair_order',
     result: {
       success: true,
       repairOrder: {
         id: 'repair-123',
         equipmentId: 'eq-789',
         problemDescription: 'Cracked screen',
         priority: 'HIGH',
         status: 'PENDING'
       }
     },
     success: true
   }]
   ```

5. **Add to conversation history**
   ```typescript
   conversationHistory = [
     // ... previous messages ...
     { role: 'assistant', content: [{ type: 'text', text: "I found the laptop..." }] },
     { role: 'user', content: [{ type: 'text', text: 'Tool results: [{"toolName":"create_repair_order",...}]' }] }
   ]
   ```

6. **Continue loop** (`continue`)

---

#### **Iteration 3**

1. **Send updated conversation to Gemini**

2. **Gemini provides final answer**
   ```typescript
   {
     message: "✅ I've successfully created repair order #repair-123 for the laptop in Office A (equipment ID: eq-789). The repair order has been marked as HIGH priority due to the cracked screen. The status is currently PENDING and a technician will be assigned soon.",
     toolCalls: [],  // No more tool calls!
     finishReason: 'stop'
   }
   ```

3. **No tool calls - exit loop!**

4. **Return final result**
   ```typescript
   {
     response: "✅ I've successfully created repair order #repair-123...",
     toolsExecuted: ['search_equipment', 'create_repair_order'],
     toolResults: [
       { toolName: 'search_equipment', result: {...}, success: true },
       { toolName: 'create_repair_order', result: {...}, success: true }
     ]
   }
   ```

---

### Response to User

```json
{
  "response": "✅ I've successfully created repair order #repair-123 for the laptop in Office A (equipment ID: eq-789). The repair order has been marked as HIGH priority due to the cracked screen. The status is currently PENDING and a technician will be assigned soon.",
  "toolsExecuted": [
    "search_equipment",
    "create_repair_order"
  ],
  "toolResults": [
    {
      "toolName": "search_equipment",
      "result": {
        "equipment": {
          "id": "eq-789",
          "name": "Laptop - Office A",
          "type": "Computer"
        }
      },
      "success": true
    },
    {
      "toolName": "create_repair_order",
      "result": {
        "success": true,
        "repairOrder": {
          "id": "repair-123",
          "equipmentId": "eq-789",
          "problemDescription": "Cracked screen",
          "priority": "HIGH",
          "status": "PENDING"
        }
      },
      "success": true
    }
  ]
}
```

---

## 🎯 Key Takeaways

### Design Patterns Used

1. **Strategy Pattern**: Switch between providers without changing code
2. **Dependency Injection**: NestJS handles object creation
3. **Iterator Pattern**: Loop through tool calls and conversations

### Why This Architecture?

✅ **Flexibility**: Easy to add new providers
✅ **Separation of Concerns**: Each component has one job
✅ **Testability**: Can mock providers and MCP client
✅ **Maintainability**: Clear structure, easy to understand
✅ **Scalability**: Can handle complex multi-step workflows

### The Flow Diagram

```
User Request
    ↓
LLM Adapter Service
    ↓
Choose Provider (Gemini/OpenAI)
    ↓
Get Tools from MCP
    ↓
┌─────────────────────────────┐
│   ITERATION LOOP (max 5)   │
│  ┌───────────────────────┐  │
│  │ Send to AI Provider   │  │
│  └─────────┬─────────────┘  │
│            ↓                │
│  ┌───────────────────────┐  │
│  │ AI Wants Tools?       │  │
│  └─────────┬─────────────┘  │
│            ↓                │
│     ┌─────┴─────┐          │
│     │    YES    │    NO    │
│     ↓           ↓          │
│  Execute    Return         │
│   Tools    Response        │
│     ↓           │          │
│   Add to        │          │
│  History        │          │
│     ↓           │          │
│  Continue       │          │
│   Loop ←────────┘          │
└─────────────────────────────┘
    ↓
Return Final Response to User
```

---

## 🚀 Next Steps

Now that you understand the service, you can:

1. **Add new providers**: Create a new provider class implementing `ILLMProvider`
2. **Optimize tool execution**: Execute independent tools in parallel
3. **Add caching**: Cache tool results to avoid redundant calls
4. **Improve error handling**: More specific error messages
5. **Add metrics**: Track response times, token usage, etc.

---

That's it! You now have a complete understanding of how the LLM Adapter Service works! 🎉
