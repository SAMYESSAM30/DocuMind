export interface FunctionalRequirement {
  id: string;
  title: string;
  description: string;
  priority?: "high" | "medium" | "low";
  category?: string;
}

export interface NonFunctionalRequirement {
  id: string;
  title: string;
  description: string;
  type: "performance" | "security" | "usability" | "scalability" | "maintainability" | "accessibility" | "other";
}

export interface FrontendRequirement {
  id: string;
  title: string;
  description: string;
  component?: string;
  page?: string;
  technology?: string;
  priority?: "high" | "medium" | "low";
}

export type RoleType = "frontend" | "backend" | "business" | "ui-design" | "devops" | "qa" | "database" | "security" | "mobile" | "other" | "system administrator" | "contract party";

export interface RoleRequirement {
  id: string;
  title: string;
  description: string;
  role: RoleType;
  priority?: "high" | "medium" | "low";
  technology?: string;
  component?: string;
  page?: string;
  estimatedHours?: number;
}

export interface Recommendation {
  id: string;
  requirementId: string;
  role: RoleType;
  title: string;
  description: string;
  category: "best-practice" | "improvement" | "security" | "performance" | "usability" | "architecture" | "other";
  priority: "high" | "medium" | "low";
  rationale?: string;
}

export interface UserStory {
  id: string;
  story: string;
  acceptanceCriteria: string[];
  frontendTasks?: string[];
  uiHints?: string[];
  priority?: "high" | "medium" | "low";
  roles?: RoleType[];
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  estimatedHours?: number;
  priority: "high" | "medium" | "low";
  dependencies?: string[];
  frontendComponent?: string;
  role: RoleType;
}

export interface APIEndpoint {
  id: string;
  method: string;
  path: string;
  description: string;
  requestBody?: string;
  responseBody?: string;
}

export interface BusinessRule {
  id: string;
  title: string;
  description: string;
  category?: string;
  priority?: "high" | "medium" | "low";
}

export interface ContractState {
  id: string;
  name: string;
  description: string;
  conditions?: string[];
  allowedActions?: string[];
}

export interface UseCaseFlow {
  id: string;
  useCaseId: string;
  title: string;
  steps: Array<{
    stepNumber: number;
    description: string;
    actor?: string;
    action?: string;
  }>;
  preConditions?: string[];
  postConditions?: string[];
  exceptionFlows?: Array<{
    condition: string;
    flow: string[];
  }>;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  category?: string;
  priority?: "high" | "medium" | "low";
  userStories?: string[];
  relatedRequirements?: string[];
}

export interface BRDRequirements {
  businessRequirementsSummary: string;
  functionalRequirements: FunctionalRequirement[];
  nonFunctionalRequirements: NonFunctionalRequirement[];
  frontendRequirements: FrontendRequirement[];
  roleRequirements: RoleRequirement[];
  userStories: UserStory[];
  taskBreakdown: TaskItem[];
  apiEndpoints?: APIEndpoint[];
  recommendations: Recommendation[];
  businessRules?: BusinessRule[];
  contractStates?: ContractState[];
  useCaseFlows?: UseCaseFlow[];
  features?: Feature[];
  metadata?: {
    documentName: string;
    processedAt: string;
    totalRequirements: number;
  };
}

export interface ProcessingStatus {
  status: "idle" | "uploading" | "parsing" | "analyzing" | "complete" | "error";
  message?: string;
  progress?: number;
}

