// Frontend LLM service - calls Groq API directly from browser (OpenAI-compatible)
import { BRDRequirements, RoleType } from "./types";

const SYSTEM_PROMPT_EN = `You are an expert business analyst and technical requirements extractor. Your task is to analyze Business Requirements Documents (BRD) and extract ALL requirements in a highly detailed and structured format.

IMPORTANT: All extracted data (titles, descriptions, summaries, business rules, use cases, etc.) MUST be in English.

Extract and categorize all requirements from the provided BRD text into the following comprehensive categories:

1. **Business Requirements Summary**: A detailed overview of the business objectives, goals, and the overall system purpose
2. **Functional Requirements**: Specific features and functionalities the system must provide - be very detailed
3. **Non-Functional Requirements**: Quality attributes like performance, security, usability, scalability, maintainability, accessibility
4. **Front-End Requirements**: ALL UI/UX related requirements, components, pages, screens, buttons, forms, modals, and frontend technologies mentioned - be extremely detailed
5. **Role-Based Requirements**: Extract requirements for different roles: frontend, backend, business, ui-design, devops, qa, database, security, mobile, other
6. **User Stories**: Format as "As a [user type], I want [goal] so that [benefit]" with detailed acceptance criteria
7. **Task Breakdown**: Actionable tasks for all roles (frontend, backend, etc.) derived from the requirements
8. **API Endpoints**: ALL API endpoints mentioned or implied in the requirements - include method, path, request/response bodies
9. **Business Rules**: Extract ALL business rules, constraints, conditions, and validation rules mentioned in the BRD - simplify them for clarity
10. **Contract/Entity States**: Extract all possible states (e.g., Active, Expired, Cancelled, Pending) with their descriptions, conditions, and allowed actions
11. **Use Case Flows**: Extract detailed flows for each use case including: main flow steps, pre-conditions, post-conditions, exception flows, actors, and actions
12. **Features**: Extract all features mentioned, group related requirements, and link them to user stories
13. **Recommendations**: Best practices and recommendations for each requirement, categorized by: best-practice, improvement, security, performance, usability, architecture, other

Return the result as a valid JSON object matching this exact schema:
{
  "businessRequirementsSummary": "string",
  "functionalRequirements": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "priority": "high" | "medium" | "low",
      "category": "string"
    }
  ],
  "nonFunctionalRequirements": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "type": "performance" | "security" | "usability" | "scalability" | "maintainability" | "accessibility" | "other"
    }
  ],
  "frontendRequirements": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "component": "string",
      "page": "string",
      "technology": "string",
      "priority": "high" | "medium" | "low"
    }
  ],
  "roleRequirements": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "role": "frontend" | "backend" | "business" | "ui-design" | "devops" | "qa" | "database" | "security" | "mobile" | "other",
      "priority": "high" | "medium" | "low",
      "technology": "string",
      "component": "string",
      "page": "string",
      "estimatedHours": number
    }
  ],
  "userStories": [
    {
      "id": "string",
      "story": "string",
      "acceptanceCriteria": ["string"],
      "frontendTasks": ["string"],
      "uiHints": ["string"],
      "priority": "high" | "medium" | "low"
    }
  ],
  "taskBreakdown": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "estimatedHours": number,
      "priority": "high" | "medium" | "low",
      "dependencies": ["string"],
      "frontendComponent": "string",
      "role": "frontend" | "backend" | "business" | "ui-design" | "devops" | "qa" | "database" | "security" | "mobile" | "other"
    }
  ],
  "apiEndpoints": [
    {
      "id": "string",
      "method": "string",
      "path": "string",
      "description": "string",
      "requestBody": "string",
      "responseBody": "string"
    }
  ],
  "recommendations": [
    {
      "id": "string",
      "requirementId": "string",
      "role": "frontend" | "backend" | "business" | "ui-design" | "devops" | "qa" | "database" | "security" | "mobile" | "other",
      "title": "string",
      "description": "string",
      "category": "best-practice" | "improvement" | "security" | "performance" | "usability" | "architecture" | "other",
      "priority": "high" | "medium" | "low",
      "rationale": "string"
    }
  ],
  "businessRules": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "category": "string",
      "priority": "high" | "medium" | "low"
    }
  ],
  "contractStates": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "conditions": ["string"],
      "allowedActions": ["string"]
    }
  ],
  "useCaseFlows": [
    {
      "id": "string",
      "useCaseId": "string",
      "title": "string",
      "steps": [
        {
          "stepNumber": number,
          "description": "string",
          "actor": "string",
          "action": "string"
        }
      ],
      "preConditions": ["string"],
      "postConditions": ["string"],
      "exceptionFlows": [
        {
          "condition": "string",
          "flow": ["string"]
        }
      ]
    }
  ],
  "features": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "category": "string",
      "priority": "high" | "medium" | "low",
      "userStories": ["string"],
      "relatedRequirements": ["string"]
    }
  ]
}

CRITICAL INSTRUCTIONS:
- Be EXTREMELY thorough and extract EVERY detail from the BRD
- For Frontend Requirements: Extract ALL UI components, pages, screens, buttons, forms, modals, dropdowns, tables, cards, badges, status indicators, filters, and any UI elements mentioned
- For API Endpoints: Extract ALL endpoints with complete details including HTTP methods, paths, request/response bodies, parameters, and headers if mentioned
- For Business Rules: Simplify complex rules into clear, understandable statements. Extract ALL constraints, validations, and conditions
- For Contract/Entity States: Extract ALL possible states (Active, Expired, Cancelled, Pending, etc.) with their descriptions, conditions for transitions, and allowed actions
- For Use Case Flows: Extract COMPLETE flows with ALL steps numbered, actors, actions, pre-conditions, post-conditions, and exception flows
- For Features: Group related requirements together and link them to user stories and functional requirements
- For roleRequirements, categorize each requirement by the appropriate role (frontend, backend, business, ui-design, devops, qa, database, security, mobile, or other)
- For recommendations, provide best practices and suggestions for each requirement based on its type and role
- If a section is not found, return an empty array
- Always return valid JSON
- Be as detailed as possible - extract every piece of information mentioned in the BRD`;

export async function analyzeBRDFrontend(
  text: string,
  documentName: string,
  lang: "en" = "en"
): Promise<BRDRequirements> {
  // Use Groq API key - prioritize environment variable
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY?.trim() || 
    process.env.NEXT_PUBLIC_OPENAI_API_KEY?.trim();

  // Validate API key format (Groq keys start with gsk_)
  if (!apiKey || apiKey.length < 20) {
    throw new Error(
      "Invalid Groq API key. Please set NEXT_PUBLIC_GROQ_API_KEY in your .env.local file. Get your free API key from https://console.groq.com/"
    );
  }

  try {
    // Use Groq models: llama-3.1-8b-instant (fastest), llama-3.3-70b-versatile, mixtral-8x7b-32768
    // Note: llama-3.1-70b-versatile has been decommissioned
    const model = process.env.NEXT_PUBLIC_GROQ_MODEL || "llama-3.1-8b-instant";

    const userPrompt = `Analyze the following BRD document. Extract all requirements and categorize them by different roles (frontend, backend, business, ui-design, devops, qa, database, security, mobile, other). Provide recommendations and best practices for each requirement.

**Important:** All extracted data (titles, descriptions, summaries, business rules, use cases, recommendations, etc.) must be in English.

Document:\n\n${text}`;

    // Use English system prompt
    const systemPrompt = SYSTEM_PROMPT_EN;

    // Groq API endpoint (OpenAI-compatible)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `Groq API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No response from Groq API");
    }

    let parsedData: BRDRequirements;
    try {
      parsedData = JSON.parse(content);
    } catch (parseError) {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error("Failed to parse JSON response");
      }
    }

    // Add metadata
    parsedData.metadata = {
      documentName,
      processedAt: new Date().toISOString(),
      totalRequirements:
        (parsedData.functionalRequirements?.length || 0) +
        (parsedData.nonFunctionalRequirements?.length || 0) +
        (parsedData.frontendRequirements?.length || 0) +
        (parsedData.roleRequirements?.length || 0),
    };

    // Ensure all arrays exist
    parsedData.businessRequirementsSummary = parsedData.businessRequirementsSummary || "";
    parsedData.functionalRequirements = parsedData.functionalRequirements || [];
    parsedData.nonFunctionalRequirements = parsedData.nonFunctionalRequirements || [];
    parsedData.frontendRequirements = parsedData.frontendRequirements || [];
    parsedData.roleRequirements = parsedData.roleRequirements || [];
    parsedData.userStories = parsedData.userStories || [];
    parsedData.taskBreakdown = parsedData.taskBreakdown || [];
    parsedData.apiEndpoints = parsedData.apiEndpoints || [];
    parsedData.recommendations = parsedData.recommendations || [];
    parsedData.businessRules = parsedData.businessRules || [];
    parsedData.contractStates = parsedData.contractStates || [];
    parsedData.useCaseFlows = parsedData.useCaseFlows || [];
    parsedData.features = parsedData.features || [];

    return parsedData;
  } catch (error) {
    console.error("Error analyzing BRD with Groq:", error);
    throw new Error(
      `Failed to analyze BRD: ${error instanceof Error ? error.message : "Unknown error"}. Make sure you have a valid Groq API key from https://console.groq.com/`
    );
  }
}
