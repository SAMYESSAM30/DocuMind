/**
 * Organism: TimeCostEstimator Component
 * Estimates time and cost for the project based on requirements
 */
"use client";

import { useMemo } from "react";
import { BRDRequirements } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Users, Calendar } from "lucide-react";

interface TimeCostEstimatorProps {
  requirements: BRDRequirements;
  hourlyRate?: number;
}

export function TimeCostEstimator({
  requirements,
  hourlyRate = 50, // Default $50/hour
}: TimeCostEstimatorProps) {
  const estimates = useMemo(() => {
    // Calculate total hours from tasks
    const totalHours = requirements.taskBreakdown.reduce(
      (sum, task) => sum + (task.estimatedHours || 0),
      0
    );

    // Estimate hours for requirements without explicit estimates
    const functionalHours = requirements.functionalRequirements.length * 8; // 8 hours per requirement
    const frontendHours = requirements.frontendRequirements.length * 6; // 6 hours per frontend requirement
    const apiHours = (requirements.apiEndpoints?.length || 0) * 12; // 12 hours per API endpoint

    const estimatedTotalHours =
      totalHours + functionalHours + frontendHours + apiHours;

    // Calculate estimates
    const estimatedDays = Math.ceil(estimatedTotalHours / 8);
    const estimatedWeeks = Math.ceil(estimatedTotalHours / 40);
    const estimatedMonths = Math.ceil(estimatedTotalHours / 160);

    // Cost estimates
    const baseCost = estimatedTotalHours * hourlyRate;
    const lowCost = baseCost * 0.8; // 20% buffer
    const highCost = baseCost * 1.3; // 30% buffer

    // Team size estimates
    const recommendedTeamSize = Math.ceil(estimatedWeeks / 4); // 1 developer per 4 weeks
    const minTeamSize = 1;
    const maxTeamSize = Math.min(recommendedTeamSize, 5); // Cap at 5

    // Breakdown by role
    const roleHours = requirements.taskBreakdown.reduce(
      (acc, task) => {
        const hours = task.estimatedHours || 0;
        acc[task.role] = (acc[task.role] || 0) + hours;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalHours: estimatedTotalHours,
      estimatedDays,
      estimatedWeeks,
      estimatedMonths,
      baseCost,
      lowCost,
      highCost,
      recommendedTeamSize,
      minTeamSize,
      maxTeamSize,
      roleHours,
    };
  }, [requirements, hourlyRate]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Estimation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-bold">{estimates.totalHours}</div>
              <div className="text-sm text-muted-foreground">Total Hours</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{estimates.estimatedDays}</div>
              <div className="text-sm text-muted-foreground">Days</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{estimates.estimatedWeeks}</div>
              <div className="text-sm text-muted-foreground">Weeks</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{estimates.estimatedMonths}</div>
              <div className="text-sm text-muted-foreground">Months</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Cost Estimation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Hourly Rate:</span>
              <Badge variant="outline">${hourlyRate}/hour</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Base Cost:</span>
              <span className="font-semibold">${estimates.baseCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Low Estimate:</span>
              <span className="text-green-600 font-semibold">
                ${estimates.lowCost.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">High Estimate:</span>
              <span className="text-red-600 font-semibold">
                ${estimates.highCost.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Estimates include 20-30% buffer for unexpected issues and revisions.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Recommended Team Size:</span>
              <Badge variant="default">
                {estimates.recommendedTeamSize} developer{estimates.recommendedTeamSize !== 1 ? "s" : ""}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Team Size Range:</span>
              <span className="text-sm">
                {estimates.minTeamSize} - {estimates.maxTeamSize} developers
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {Object.keys(estimates.roleHours).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Hours by Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(estimates.roleHours).map(([role, hours]) => (
                <div key={role} className="flex items-center justify-between">
                  <span className="text-sm capitalize">
                    {role.replace("-", " ")}
                  </span>
                  <Badge variant="secondary">{hours} hours</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

