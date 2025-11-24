/**
 * Organism: AnalysisComparison Component
 * Compare multiple analyses side by side
 */
"use client";

import { useState, useMemo } from "react";
import { BRDRequirements } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  FileText,
  BarChart3,
  Users,
  Clock,
  CheckCircle2,
  Code,
  ChevronDown,
  ChevronUp,
  Table2,
  Shield,
} from "lucide-react";

interface AnalysisComparisonProps {
  analyses: Array<{
    id: string;
    name: string;
    requirements: BRDRequirements;
  }>;
  onRemove: (id: string) => void;
}

export function AnalysisComparison({
  analyses,
  onRemove,
}: AnalysisComparisonProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["summary"])
  );

  const comparisonData = useMemo(() => {
    return {
      totalRequirements: analyses.map((a) => ({
        name: a.name,
        value: a.requirements.metadata?.totalRequirements || 0,
      })),
      functionalRequirements: analyses.map((a) => ({
        name: a.name,
        value: a.requirements.functionalRequirements.length,
      })),
      nonFunctionalRequirements: analyses.map((a) => ({
        name: a.name,
        value: a.requirements.nonFunctionalRequirements.length,
      })),
      frontendRequirements: analyses.map((a) => ({
        name: a.name,
        value: a.requirements.frontendRequirements.length,
      })),
      userStories: analyses.map((a) => ({
        name: a.name,
        value: a.requirements.userStories.length,
      })),
      tasks: analyses.map((a) => ({
        name: a.name,
        value: a.requirements.taskBreakdown.length,
      })),
      estimatedHours: analyses.map((a) => {
        const hours = a.requirements.taskBreakdown.reduce(
          (sum, task) => sum + (task.estimatedHours || 0),
          0
        );
        return { name: a.name, value: hours };
      }),
      estimatedDays: analyses.map((a) => {
        const hours = a.requirements.taskBreakdown.reduce(
          (sum, task) => sum + (task.estimatedHours || 0),
          0
        );
        return { name: a.name, value: Math.ceil(hours / 8) };
      }),
      apiEndpoints: analyses.map((a) => ({
        name: a.name,
        value: a.requirements.apiEndpoints?.length || 0,
      })),
    };
  }, [analyses]);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  if (analyses.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No analyses selected</h3>
          <p className="text-muted-foreground">
            Select analyses from the dashboard to compare them
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with analysis names */}
      <div className="flex flex-wrap gap-2">
        {analyses.map((analysis) => (
          <Badge
            key={analysis.id}
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1 text-sm"
          >
            <span className="truncate max-w-[200px]">{analysis.name}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => onRemove(analysis.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>

      {/* Summary Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table2 className="h-5 w-5" />
            Comparison Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Metric</th>
                  {analyses.map((analysis) => (
                    <th
                      key={analysis.id}
                      className="text-center p-3 font-semibold min-w-[150px]"
                    >
                      {analysis.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Total Requirements
                  </td>
                  {comparisonData.totalRequirements.map((item) => (
                    <td key={item.name} className="text-center p-3">
                      <Badge variant="outline" className="text-base px-3 py-1">
                        {item.value}
                      </Badge>
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Functional Requirements
                  </td>
                  {comparisonData.functionalRequirements.map((item) => (
                    <td key={item.name} className="text-center p-3">
                      <Badge variant="outline">{item.value}</Badge>
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-3 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Non-Functional Requirements
                  </td>
                  {comparisonData.nonFunctionalRequirements.map((item) => (
                    <td key={item.name} className="text-center p-3">
                      <Badge variant="outline">{item.value}</Badge>
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-3 flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Frontend Requirements
                  </td>
                  {comparisonData.frontendRequirements.map((item) => (
                    <td key={item.name} className="text-center p-3">
                      <Badge variant="outline">{item.value}</Badge>
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    User Stories
                  </td>
                  {comparisonData.userStories.map((item) => (
                    <td key={item.name} className="text-center p-3">
                      <Badge variant="outline">{item.value}</Badge>
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Tasks
                  </td>
                  {comparisonData.tasks.map((item) => (
                    <td key={item.name} className="text-center p-3">
                      <Badge variant="outline">{item.value}</Badge>
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Estimated Hours
                  </td>
                  {comparisonData.estimatedHours.map((item) => (
                    <td key={item.name} className="text-center p-3">
                      <Badge variant="secondary">{item.value}h</Badge>
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Estimated Days
                  </td>
                  {comparisonData.estimatedDays.map((item) => (
                    <td key={item.name} className="text-center p-3">
                      <Badge variant="secondary">{item.value} days</Badge>
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="p-3 flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    API Endpoints
                  </td>
                  {comparisonData.apiEndpoints.map((item) => (
                    <td key={item.name} className="text-center p-3">
                      <Badge variant="outline">{item.value}</Badge>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Expandable Sections */}
      <div className="space-y-4">
        {/* Requirements Details */}
        <Card>
          <CardHeader
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => toggleSection("requirements")}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Requirements Details
              </CardTitle>
              {expandedSections.has("requirements") ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
          </CardHeader>
          {expandedSections.has("requirements") && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analyses.map((analysis) => (
                  <Card key={analysis.id} className="border-l-4 border-l-primary">
                    <CardHeader>
                      <CardTitle className="text-lg">{analysis.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Functional Requirements
                        </h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {analysis.requirements.functionalRequirements.map((req) => (
                            <div key={req.id} className="text-sm p-2 rounded bg-muted/50">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {req.priority || "N/A"}
                                </Badge>
                                {req.category && (
                                  <Badge variant="secondary" className="text-xs">
                                    {req.category}
                                  </Badge>
                                )}
                              </div>
                              <p className="font-medium">{req.title}</p>
                              <p className="text-muted-foreground text-xs mt-1">
                                {req.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          Frontend Requirements
                        </h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {analysis.requirements.frontendRequirements.map((req) => (
                            <div key={req.id} className="text-sm p-2 rounded bg-muted/50">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {req.priority || "N/A"}
                                </Badge>
                                {req.component && (
                                  <Badge variant="secondary" className="text-xs">
                                    {req.component}
                                  </Badge>
                                )}
                              </div>
                              <p className="font-medium">{req.title}</p>
                              <p className="text-muted-foreground text-xs mt-1">
                                {req.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Tasks Details */}
        <Card>
          <CardHeader
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => toggleSection("tasks")}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Tasks Breakdown
              </CardTitle>
              {expandedSections.has("tasks") ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
          </CardHeader>
          {expandedSections.has("tasks") && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analyses.map((analysis) => (
                  <Card key={analysis.id} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <CardTitle className="text-lg">{analysis.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                      {analysis.requirements.taskBreakdown.map((task) => (
                        <div
                          key={task.id}
                          className="text-sm border-l-2 border-l-primary pl-3 py-2 hover:bg-muted/50 rounded"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {task.priority}
                            </Badge>
                            {task.estimatedHours && (
                              <Badge variant="secondary" className="text-xs">
                                {task.estimatedHours}h
                              </Badge>
                            )}
                            {task.role && (
                              <Badge variant="outline" className="text-xs capitalize">
                                {task.role}
                              </Badge>
                            )}
                          </div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-muted-foreground text-xs mt-1">
                            {task.description}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Visual Comparison */}
        <Card>
          <CardHeader
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => toggleSection("visual")}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Visual Comparison
              </CardTitle>
              {expandedSections.has("visual") ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
          </CardHeader>
          {expandedSections.has("visual") && (
            <CardContent>
              <div className="space-y-6">
                {Object.entries({
                  "Total Requirements": comparisonData.totalRequirements,
                  "Functional Requirements": comparisonData.functionalRequirements,
                  "Frontend Requirements": comparisonData.frontendRequirements,
                  "User Stories": comparisonData.userStories,
                  "Tasks": comparisonData.tasks,
                }).map(([label, data]) => {
                  const maxValue = Math.max(...data.map((d) => d.value), 1);
                  return (
                    <div key={label}>
                      <h4 className="text-sm font-semibold mb-3">{label}</h4>
                      <div className="space-y-3">
                        {data.map((item) => (
                          <div key={item.name}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium truncate max-w-[200px]">
                                {item.name}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {item.value}
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div
                                className="bg-primary h-3 rounded-full transition-all"
                                style={{
                                  width: `${(item.value / maxValue) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}

