"use client";

import { useState, useMemo } from "react";
import { BRDRequirements, RoleType } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, Code, CheckCircle, Zap, Shield, Filter, BarChart3, Clock, ExternalLink, ChevronDown, ChevronUp, List, Layers, Settings, Rocket } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { RoleSelector } from "@/components/role-selector";
import { StatisticsDashboard } from "@/components/organisms/StatisticsDashboard";
import { SearchFilter, FilterOptions } from "@/components/molecules/SearchFilter";
import { TimeCostEstimator } from "@/components/organisms/TimeCostEstimator";
import { ExportToTools } from "@/components/organisms/ExportToTools";

interface ResultsDisplayProps {
  requirements: BRDRequirements;
  onDownloadJSON: () => void;
  onDownloadPDF: () => void;
}

export function ResultsDisplay({ requirements, onDownloadJSON, onDownloadPDF }: ResultsDisplayProps) {
  const [selectedRoles, setSelectedRoles] = useState<RoleType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    priority: "all",
    role: "all",
    category: "all",
  });
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["overview", "statistics", "time-cost"])
  );
  const { t } = useTranslation();

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Get available roles from requirements
  const availableRoles = useMemo(() => {
    const roles = new Set<RoleType>();
    requirements.roleRequirements?.forEach(req => roles.add(req.role));
    requirements.taskBreakdown?.forEach(task => roles.add(task.role));
    requirements.recommendations?.forEach(rec => roles.add(rec.role));
    return Array.from(roles);
  }, [requirements]);

  // Filter requirements by selected roles
  const filteredRoleRequirements = useMemo(() => {
    if (selectedRoles.length === 0) return requirements.roleRequirements || [];
    return (requirements.roleRequirements || []).filter(req => selectedRoles.includes(req.role));
  }, [requirements.roleRequirements, selectedRoles]);

  const filteredTasks = useMemo(() => {
    if (selectedRoles.length === 0) return requirements.taskBreakdown || [];
    return (requirements.taskBreakdown || []).filter(task => selectedRoles.includes(task.role));
  }, [requirements.taskBreakdown, selectedRoles]);

  const filteredRecommendations = useMemo(() => {
    if (selectedRoles.length === 0) return requirements.recommendations || [];
    return (requirements.recommendations || []).filter(rec => selectedRoles.includes(rec.role));
  }, [requirements.recommendations, selectedRoles]);
  
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">{t("translation:results.title")}</h2>
          {requirements.metadata && (
            <p className="text-sm text-muted-foreground mt-1">
              {t("translation:results.processedAt")}: {formatDate(new Date(requirements.metadata.processedAt))}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onDownloadJSON}>
            <Download className="h-4 w-4 mr-2" />
            {t("translation:results.downloadJSON")}
          </Button>
          <Button onClick={onDownloadPDF}>
            <FileText className="h-4 w-4 mr-2" />
            {t("translation:results.downloadPDF")}
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <SearchFilter
        onSearch={setSearchQuery}
        onFilterChange={setFilters}
        searchPlaceholder="Search requirements, tasks, stories..."
      />

      {/* Role Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t("translation:results.filterByRole")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RoleSelector
            selectedRoles={selectedRoles}
            onRoleChange={setSelectedRoles}
            availableRoles={availableRoles}
          />
        </CardContent>
      </Card>

      {/* Overview Section - Always Visible */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t("translation:results.overview")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("translation:analysis.businessSummary")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {requirements.businessRequirementsSummary || t("translation:results.noRequirements")}
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{t("translation:results.totalRequirements")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {requirements.metadata?.totalRequirements || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{t("translation:results.functionalRequirements")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{requirements.functionalRequirements.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{t("translation:results.frontendRequirements")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{requirements.frontendRequirements.length}</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Analytics & Insights Section */}
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => toggleSection("analytics")}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics & Insights
            </CardTitle>
            {expandedSections.has("analytics") ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        </CardHeader>
        {expandedSections.has("analytics") && (
          <CardContent className="space-y-6">
            <StatisticsDashboard requirements={requirements} />
            <TimeCostEstimator requirements={requirements} />
          </CardContent>
        )}
      </Card>

      {/* Requirements Section */}
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => toggleSection("requirements")}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Requirements
            </CardTitle>
            {expandedSections.has("requirements") ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        </CardHeader>
        {expandedSections.has("requirements") && (
          <CardContent className="space-y-6">
            {/* Functional Requirements */}
            {requirements.functionalRequirements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  {t("translation:results.functional")}
                </h3>
                <div className="space-y-4">
                  {requirements.functionalRequirements.map((req) => (
                    <Card key={req.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{req.title}</CardTitle>
                          <div className="flex gap-2">
                            {req.priority && (
                              <Badge variant={getPriorityColor(req.priority)}>
                                {t("translation:results.priority")}: {req.priority}
                              </Badge>
                            )}
                            {req.category && (
                              <Badge variant="outline">
                                {t("translation:results.category")}: {req.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{req.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Non-Functional Requirements */}
            {requirements.nonFunctionalRequirements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t("translation:results.nonFunctional")}
                </h3>
                <div className="space-y-4">
                  {requirements.nonFunctionalRequirements.map((req) => (
                    <Card key={req.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{req.title}</CardTitle>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {req.type === "performance" && <Zap className="h-3 w-3" />}
                            {req.type === "security" && <Shield className="h-3 w-3" />}
                            {req.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{req.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Frontend Requirements */}
            {requirements.frontendRequirements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  {t("translation:results.frontend")}
                </h3>
                <div className="space-y-4">
                  {requirements.frontendRequirements.map((req) => (
                    <Card key={req.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Code className="h-5 w-5" />
                            {req.title}
                          </CardTitle>
                          <div className="flex gap-2">
                            {req.priority && (
                              <Badge variant={getPriorityColor(req.priority)}>{req.priority}</Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-muted-foreground">{req.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {req.component && (
                            <Badge variant="secondary">
                              {t("translation:results.component")}: {req.component}
                            </Badge>
                          )}
                          {req.page && (
                            <Badge variant="secondary">
                              {t("translation:results.page")}: {req.page}
                            </Badge>
                          )}
                          {req.technology && (
                            <Badge variant="secondary">
                              {t("translation:results.technology")}: {req.technology}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Role-Based Requirements */}
            {filteredRoleRequirements && filteredRoleRequirements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  {t("translation:results.roleRequirements")}
                </h3>
                <div className="space-y-4">
                  {Object.entries(
                    filteredRoleRequirements.reduce((acc, req) => {
                      if (!acc[req.role]) acc[req.role] = [];
                      acc[req.role].push(req);
                      return acc;
                    }, {} as Record<string, typeof filteredRoleRequirements>)
                  ).map(([role, reqs]) => (
                    <Card key={role}>
                      <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <Badge variant="default">{t(`translation:results.roles.${role}`) || role}</Badge>
                          <span className="text-sm text-muted-foreground">({reqs.length})</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {reqs.map((req) => (
                          <Card key={req.id} className="border-l-4 border-l-primary">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">{req.title}</CardTitle>
                                <div className="flex gap-2">
                                  {req.priority && (
                                    <Badge variant={getPriorityColor(req.priority)}>
                                      {req.priority}
                                    </Badge>
                                  )}
                                  {req.technology && (
                                    <Badge variant="outline">
                                      {t("translation:results.technology")}: {req.technology}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground text-sm mb-3">{req.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {req.component && (
                                  <Badge variant="secondary">
                                    {t("translation:results.component")}: {req.component}
                                  </Badge>
                                )}
                                {req.page && (
                                  <Badge variant="secondary">
                                    {t("translation:results.page")}: {req.page}
                                  </Badge>
                                )}
                                {req.estimatedHours && (
                                  <Badge variant="outline">
                                    {t("translation:results.estimatedHours")}: {req.estimatedHours}h
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Features & Business Rules Section */}
      {((requirements.features && requirements.features.length > 0) || (requirements.businessRules && requirements.businessRules.length > 0) || (requirements.contractStates && requirements.contractStates.length > 0)) && (
        <Card>
          <CardHeader
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => toggleSection("features-rules")}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Features & Business Rules
              </CardTitle>
              {expandedSections.has("features-rules") ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
          </CardHeader>
          {expandedSections.has("features-rules") && (
            <CardContent className="space-y-6">
              {/* Features */}
              {requirements.features && requirements.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t("translation:results.features")}</h3>
                  <div className="space-y-4">
                    {requirements.features.map((feature) => (
                      <Card key={feature.id} className="border-l-4 border-l-blue-500">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                            <div className="flex gap-2">
                              {feature.priority && (
                                <Badge variant={getPriorityColor(feature.priority)}>
                                  {feature.priority}
                                </Badge>
                              )}
                              {feature.category && (
                                <Badge variant="outline">
                                  {t("translation:results.category")}: {feature.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-3">{feature.description}</p>
                          {feature.userStories && feature.userStories.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-semibold mb-2">{t("translation:results.userStories")}:</p>
                              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {feature.userStories.map((story, idx) => (
                                  <li key={idx}>{story}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Business Rules */}
              {requirements.businessRules && requirements.businessRules.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t("translation:results.businessRules")}</h3>
                  <div className="space-y-4">
                    {Object.entries(
                      requirements.businessRules.reduce((acc, rule) => {
                        const category = rule.category || "General";
                        if (!acc[category]) acc[category] = [];
                        acc[category].push(rule);
                        return acc;
                      }, {} as Record<string, typeof requirements.businessRules>)
                    ).map(([category, rules]) => (
                      <Card key={category}>
                        <CardHeader>
                          <CardTitle className="text-xl">
                            {category} <span className="text-sm text-muted-foreground">({rules.length})</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {rules.map((rule) => (
                            <Card key={rule.id} className="border-l-4 border-l-green-500">
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-base">{rule.title}</CardTitle>
                                  {rule.priority && (
                                    <Badge variant={getPriorityColor(rule.priority)}>
                                      {rule.priority}
                                    </Badge>
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-muted-foreground text-sm">{rule.description}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Contract States */}
              {requirements.contractStates && requirements.contractStates.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t("translation:results.contractStates")}</h3>
                  <div className="space-y-4">
                    {requirements.contractStates.map((state) => (
                      <Card key={state.id} className="border-l-4 border-l-purple-500">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Badge variant="default">{state.name}</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-muted-foreground">{state.description}</p>
                          {state.conditions && state.conditions.length > 0 && (
                            <div>
                              <p className="text-sm font-semibold mb-2">{t("translation:results.conditions")}:</p>
                              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {state.conditions.map((condition, idx) => (
                                  <li key={idx}>{condition}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {state.allowedActions && state.allowedActions.length > 0 && (
                            <div>
                              <p className="text-sm font-semibold mb-2">{t("translation:results.allowedActions")}:</p>
                              <div className="flex flex-wrap gap-2">
                                {state.allowedActions.map((action, idx) => (
                                  <Badge key={idx} variant="secondary">{action}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* Development Section */}
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => toggleSection("development")}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Development
            </CardTitle>
            {expandedSections.has("development") ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        </CardHeader>
        {expandedSections.has("development") && (
          <CardContent className="space-y-6">
            {/* User Stories */}
            {requirements.userStories.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t("translation:results.userStories")}
                </h3>
                <div className="space-y-4">
                  {requirements.userStories.map((story) => (
                    <Card key={story.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{story.story}</CardTitle>
                          {story.priority && (
                            <Badge variant={getPriorityColor(story.priority)}>{story.priority}</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            {t("translation:results.acceptanceCriteria")}
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-6">
                            {story.acceptanceCriteria.map((criteria, idx) => (
                              <li key={idx}>{criteria}</li>
                            ))}
                          </ul>
                        </div>
                        {story.frontendTasks && story.frontendTasks.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">{t("translation:results.frontendTasks")}</h4>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-6">
                              {story.frontendTasks.map((task, idx) => (
                                <li key={idx}>{task}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {story.uiHints && story.uiHints.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">{t("translation:results.uiHints")}</h4>
                            <div className="flex flex-wrap gap-2">
                              {story.uiHints.map((hint, idx) => (
                                <Badge key={idx} variant="outline">
                                  {hint}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Tasks */}
            {filteredTasks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  {t("translation:results.tasks")}
                </h3>
                <div className="space-y-4">
                  {filteredTasks.map((task) => (
                    <Card key={task.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{task.title}</CardTitle>
                          <div className="flex gap-2">
                            <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                            {task.estimatedHours && (
                              <Badge variant="outline">
                                {t("translation:results.estimatedHours")}: {task.estimatedHours}h
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-muted-foreground">{task.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {task.role && (
                            <Badge variant="secondary">
                              {t("translation:results.role")}: {t(`translation:results.roles.${task.role}`) || task.role}
                            </Badge>
                          )}
                          {task.frontendComponent && (
                            <Badge variant="secondary">
                              {t("translation:results.component")}: {task.frontendComponent}
                            </Badge>
                          )}
                          {task.dependencies && task.dependencies.length > 0 && (
                            <Badge variant="outline">
                              {t("translation:results.dependencies")}: {task.dependencies.join(", ")}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* API Endpoints */}
            {requirements.apiEndpoints && requirements.apiEndpoints.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  {t("translation:results.apiEndpoints")}
                </h3>
                <div className="space-y-4">
                  {requirements.apiEndpoints.map((endpoint) => (
                    <Card key={endpoint.id} className="border-l-4 border-l-indigo-500">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Badge variant={endpoint.method === "GET" ? "default" : endpoint.method === "POST" ? "destructive" : "secondary"}>
                              {endpoint.method}
                            </Badge>
                            <code className="text-sm font-mono">{endpoint.path}</code>
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-muted-foreground">{endpoint.description}</p>
                        {endpoint.requestBody && (
                          <div>
                            <p className="text-sm font-semibold mb-2">Request Body:</p>
                            <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                              {endpoint.requestBody}
                            </pre>
                          </div>
                        )}
                        {endpoint.responseBody && (
                          <div>
                            <p className="text-sm font-semibold mb-2">Response Body:</p>
                            <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                              {endpoint.responseBody}
                            </pre>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Use Case Flows */}
            {requirements.useCaseFlows && requirements.useCaseFlows.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">{t("translation:results.useCaseFlows")}</h3>
                <div className="space-y-4">
                  {requirements.useCaseFlows.map((flow) => (
                    <Card key={flow.id} className="border-l-4 border-l-orange-500">
                      <CardHeader>
                        <CardTitle className="text-lg">{flow.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {flow.preConditions && flow.preConditions.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold mb-2">{t("translation:results.preConditions")}:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {flow.preConditions.map((condition, idx) => (
                                <li key={idx}>{condition}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {flow.steps && flow.steps.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold mb-2">{t("translation:results.steps")}:</p>
                            <ol className="list-decimal list-inside space-y-2">
                              {flow.steps.map((step, idx) => {
                                const stepDescription = step?.description || String(step?.stepNumber || idx + 1);
                                return (
                                  <li key={idx} className="text-sm text-muted-foreground">
                                    <span className="font-medium">{stepDescription}</span>
                                    {step?.actor && (
                                      <Badge variant="outline" className="ml-2 text-xs">
                                        {t("translation:results.actor")}: {step.actor}
                                      </Badge>
                                    )}
                                    {step?.action && (
                                      <Badge variant="secondary" className="ml-2 text-xs">
                                        {t("translation:results.action")}: {step.action}
                                      </Badge>
                                    )}
                                  </li>
                                );
                              })}
                            </ol>
                          </div>
                        )}

                        {flow.postConditions && flow.postConditions.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold mb-2">{t("translation:results.postConditions")}:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {flow.postConditions.map((condition, idx) => (
                                <li key={idx}>{condition}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {flow.exceptionFlows && flow.exceptionFlows.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold mb-2">{t("translation:results.exceptionFlows")}:</p>
                            {flow.exceptionFlows.map((exception, idx) => (
                              <Card key={idx} className="mt-2 border-l-2 border-l-red-500">
                                <CardContent className="p-3">
                                  <p className="text-sm font-medium mb-1">{exception.condition}</p>
                                  <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                                    {exception.flow.map((step, stepIdx) => {
                                      const stepText = typeof step === 'string' 
                                        ? step 
                                        : (step as any)?.description || String(step);
                                      return <li key={stepIdx}>{stepText}</li>;
                                    })}
                                  </ul>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Recommendations Section */}
      {filteredRecommendations && filteredRecommendations.length > 0 && (
        <Card>
          <CardHeader
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => toggleSection("recommendations")}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t("translation:results.recommendations")}
              </CardTitle>
              {expandedSections.has("recommendations") ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
          </CardHeader>
          {expandedSections.has("recommendations") && (
            <CardContent className="space-y-4">
              {Object.entries(
                filteredRecommendations.reduce((acc, rec) => {
                  if (!acc[rec.category]) acc[rec.category] = [];
                  acc[rec.category].push(rec);
                  return acc;
                }, {} as Record<string, typeof filteredRecommendations>)
              ).map(([category, recs]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      <span>{t(`translation:results.recommendationCategories.${category}`) || category}</span>
                      <span className="text-sm text-muted-foreground">({recs.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recs.map((rec) => (
                      <Card key={rec.id} className="border-l-4 border-l-yellow-500">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{rec.title}</CardTitle>
                            <div className="flex gap-2">
                              <Badge variant={getPriorityColor(rec.priority)}>
                                {rec.priority}
                              </Badge>
                              <Badge variant="outline">
                                {t("translation:results.role")}: {t(`translation:results.roles.${rec.role}`) || rec.role}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-sm mb-3">{rec.description}</p>
                          {rec.rationale && (
                            <div className="mt-3 p-3 bg-muted rounded-md">
                              <p className="text-xs font-semibold mb-1">{t("translation:results.rationale")}:</p>
                              <p className="text-xs text-muted-foreground">{rec.rationale}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          )}
        </Card>
      )}

      {/* Export Section */}
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => toggleSection("export")}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Export & Integration
            </CardTitle>
            {expandedSections.has("export") ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        </CardHeader>
        {expandedSections.has("export") && (
          <CardContent>
            <ExportToTools requirements={requirements} />
          </CardContent>
        )}
      </Card>
    </div>
  );
}
