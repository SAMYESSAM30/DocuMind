/**
 * Organism: StatisticsDashboard Component
 * Visual statistics dashboard with charts for requirements analysis
 */
"use client";

import { useMemo } from "react";
import { BRDRequirements } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatisticsCard } from "@/components/molecules/StatisticsCard";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FileText,
  Code,
  Shield,
  Users,
  Clock,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

interface StatisticsDashboardProps {
  requirements: BRDRequirements;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export function StatisticsDashboard({ requirements }: StatisticsDashboardProps) {
  // Calculate statistics
  const stats = useMemo(() => {
    const totalRequirements =
      requirements.functionalRequirements.length +
      requirements.nonFunctionalRequirements.length +
      requirements.frontendRequirements.length;

    const totalTasks = requirements.taskBreakdown.length;
    const totalUserStories = requirements.userStories.length;
    const totalAPIs = requirements.apiEndpoints?.length || 0;

    // Calculate total estimated hours
    const totalHours = requirements.taskBreakdown.reduce(
      (sum, task) => sum + (task.estimatedHours || 0),
      0
    );

    // Priority distribution
    const priorityData = [
      {
        name: "High",
        value: [
          ...requirements.functionalRequirements,
          ...requirements.frontendRequirements,
          ...requirements.taskBreakdown,
        ].filter((item) => item.priority === "high").length,
      },
      {
        name: "Medium",
        value: [
          ...requirements.functionalRequirements,
          ...requirements.frontendRequirements,
          ...requirements.taskBreakdown,
        ].filter((item) => item.priority === "medium").length,
      },
      {
        name: "Low",
        value: [
          ...requirements.functionalRequirements,
          ...requirements.frontendRequirements,
          ...requirements.taskBreakdown,
        ].filter((item) => item.priority === "low").length,
      },
    ];

    // Role distribution
    const roleCounts = requirements.taskBreakdown.reduce(
      (acc, task) => {
        acc[task.role] = (acc[task.role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const roleData = Object.entries(roleCounts).map(([role, count]) => ({
      name: role.charAt(0).toUpperCase() + role.slice(1).replace("-", " "),
      value: count,
    }));

    // Requirements by type
    const requirementsByType = [
      {
        name: "Functional",
        value: requirements.functionalRequirements.length,
      },
      {
        name: "Non-Functional",
        value: requirements.nonFunctionalRequirements.length,
      },
      {
        name: "Frontend",
        value: requirements.frontendRequirements.length,
      },
    ];

    // Non-functional requirements by type
    const nonFunctionalByType = requirements.nonFunctionalRequirements.reduce(
      (acc, req) => {
        acc[req.type] = (acc[req.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const nonFunctionalData = Object.entries(nonFunctionalByType).map(
      ([type, count]) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        value: count,
      })
    );

    return {
      totalRequirements,
      totalTasks,
      totalUserStories,
      totalAPIs,
      totalHours,
      estimatedDays: Math.ceil(totalHours / 8),
      estimatedWeeks: Math.ceil(totalHours / 40),
      priorityData,
      roleData,
      requirementsByType,
      nonFunctionalData,
    };
  }, [requirements]);

  return (
    <div className="space-y-6">
      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticsCard
          title="Total Requirements"
          value={stats.totalRequirements}
          icon={FileText}
          description="All requirement types"
        />
        <StatisticsCard
          title="User Stories"
          value={stats.totalUserStories}
          icon={CheckCircle2}
          description="Stories with acceptance criteria"
        />
        <StatisticsCard
          title="Tasks"
          value={stats.totalTasks}
          icon={Code}
          description="Actionable development tasks"
        />
        <StatisticsCard
          title="Estimated Hours"
          value={stats.totalHours}
          icon={Clock}
          description={`~${stats.estimatedDays} days or ${stats.estimatedWeeks} weeks`}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Priority Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Requirements by Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Requirements by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.requirementsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.requirementsByType.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Role Distribution */}
        {stats.roleData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Tasks by Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.roleData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Non-Functional Requirements by Type */}
        {stats.nonFunctionalData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Non-Functional Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.nonFunctionalData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.nonFunctionalData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* API Endpoints Count */}
      {stats.totalAPIs > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              API Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAPIs}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Total API endpoints identified
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

