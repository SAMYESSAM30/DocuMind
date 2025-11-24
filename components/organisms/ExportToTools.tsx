/**
 * Organism: ExportToTools Component
 * Export requirements to project management tools
 */
"use client";

import { useState } from "react";
import { BRDRequirements } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  ExternalLink,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ExportToToolsProps {
  requirements: BRDRequirements;
}

interface ExportFormat {
  name: string;
  description: string;
  icon: React.ReactNode;
  format: "jira" | "trello" | "asana" | "csv" | "markdown";
}

export function ExportToTools({ requirements }: ExportToToolsProps) {
  const [exporting, setExporting] = useState<string | null>(null);
  const { toast } = useToast();

  const exportFormats: ExportFormat[] = [
    {
      name: "Jira",
      description: "Export as CSV for Jira import",
      icon: <ExternalLink className="h-4 w-4" />,
      format: "jira",
    },
    {
      name: "Trello",
      description: "Export as CSV for Trello import",
      icon: <ExternalLink className="h-4 w-4" />,
      format: "trello",
    },
    {
      name: "Asana",
      description: "Export as CSV for Asana import",
      icon: <ExternalLink className="h-4 w-4" />,
      format: "asana",
    },
    {
      name: "CSV",
      description: "Generic CSV format",
      icon: <Download className="h-4 w-4" />,
      format: "csv",
    },
    {
      name: "Markdown",
      description: "Markdown format for documentation",
      icon: <Download className="h-4 w-4" />,
      format: "markdown",
    },
  ];

  const exportToFormat = async (format: ExportFormat["format"]) => {
    setExporting(format);
    try {
      let content = "";
      let filename = "";
      let mimeType = "text/plain";

      switch (format) {
        case "jira":
        case "trello":
        case "asana":
        case "csv":
          content = convertToCSV(requirements);
          filename = `requirements_${format}.csv`;
          mimeType = "text/csv";
          break;
        case "markdown":
          content = convertToMarkdown(requirements);
          filename = "requirements.md";
          mimeType = "text/markdown";
          break;
      }

      // Create and download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Requirements exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export requirements",
        variant: "destructive",
      });
    } finally {
      setExporting(null);
    }
  };

  const convertToCSV = (req: BRDRequirements): string => {
    const rows: string[] = [];
    
    // Header
    rows.push("Type,Title,Description,Priority,Role,Estimated Hours,Category");

    // Functional Requirements
    req.functionalRequirements.forEach((r) => {
      rows.push(
        `Functional,"${r.title}","${r.description.replace(/"/g, '""')}",${r.priority || ""},,,"${r.category || ""}"`
      );
    });

    // Frontend Requirements
    req.frontendRequirements.forEach((r) => {
      rows.push(
        `Frontend,"${r.title}","${r.description.replace(/"/g, '""')}",${r.priority || ""},,,"${r.component || ""}"`
      );
    });

    // Tasks
    req.taskBreakdown.forEach((t) => {
      rows.push(
        `Task,"${t.title}","${t.description.replace(/"/g, '""')}",${t.priority},${t.role},${t.estimatedHours || ""},`
      );
    });

    // User Stories
    req.userStories.forEach((s) => {
      rows.push(
        `User Story,"${s.story}","${s.acceptanceCriteria.join("; ").replace(/"/g, '""')}",${s.priority || ""},,,`
      );
    });

    return rows.join("\n");
  };

  const convertToMarkdown = (req: BRDRequirements): string => {
    let md = `# Requirements Document\n\n`;
    md += `**Document:** ${req.metadata?.documentName || "Unknown"}\n`;
    md += `**Processed:** ${req.metadata?.processedAt || "Unknown"}\n\n`;

    // Business Summary
    if (req.businessRequirementsSummary) {
      md += `## Business Requirements Summary\n\n${req.businessRequirementsSummary}\n\n`;
    }

    // Functional Requirements
    if (req.functionalRequirements.length > 0) {
      md += `## Functional Requirements\n\n`;
      req.functionalRequirements.forEach((r, idx) => {
        md += `### ${idx + 1}. ${r.title}\n\n`;
        md += `${r.description}\n\n`;
        if (r.priority) md += `**Priority:** ${r.priority}\n\n`;
      });
    }

    // Tasks
    if (req.taskBreakdown.length > 0) {
      md += `## Task Breakdown\n\n`;
      req.taskBreakdown.forEach((t, idx) => {
        md += `### ${idx + 1}. ${t.title}\n\n`;
        md += `${t.description}\n\n`;
        md += `- **Priority:** ${t.priority}\n`;
        md += `- **Role:** ${t.role}\n`;
        if (t.estimatedHours) md += `- **Estimated Hours:** ${t.estimatedHours}\n`;
        md += `\n`;
      });
    }

    return md;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export to Project Management Tools
        </CardTitle>
        <CardDescription>
          Export your requirements to popular project management platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exportFormats.map((format) => (
            <Card
              key={format.format}
              className="cursor-pointer hover:border-primary transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {format.icon}
                    <h3 className="font-semibold">{format.name}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {format.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => exportToFormat(format.format)}
                  disabled={exporting === format.format}
                >
                  {exporting === format.format ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

