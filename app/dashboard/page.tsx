"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logoutUser } from "@/lib/slices/authSlice";
import { setLoadingMessage } from "@/lib/slices/uiSlice";
import { InlineLoader } from "@/components/loader";
import { ResultsDisplay } from "@/components/results-display";
import { BRDRequirements } from "@/lib/types";
import { downloadJSON } from "@/lib/utils";
import { downloadPDF } from "@/lib/pdf-generator";
import { FileText, History, LogOut, Plus, Loader2, User, Mail, Share2, GitCompare, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { AnalysisComparison } from "@/components/organisms/AnalysisComparison";
import { ShareAnalysis } from "@/components/organisms/ShareAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalysisItem {
  id: string;
  documentName: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<BRDRequirements | null>(null);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
  const [comparisonAnalyses, setComparisonAnalyses] = useState<Array<{
    id: string;
    name: string;
    requirements: BRDRequirements;
  }>>([]);
  const [selectedForComparison, setSelectedForComparison] = useState<Set<string>>(new Set());
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingAnalysis, setLoadingAnalysis] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { user, loading: authLoading } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      fetchAnalyses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router]);

    const fetchAnalyses = async () => {
      dispatch(setLoadingMessage("Loading analyses..."));
      try {
        const response = await fetch("/api/analyses", {
          credentials: "include", // Include cookies
        });

        if (response.ok) {
          const data = await response.json();
          setAnalyses(data.analyses);
        }
      } catch (error) {
        console.error("Failed to fetch analyses:", error);
      } finally {
        setLoading(false);
        dispatch(setLoadingMessage(null));
      }
    };

  const loadAnalysis = async (id: string) => {
    setLoadingAnalysis(id);
    dispatch(setLoadingMessage("Loading analysis..."));
    try {
      const response = await fetch(`/api/analyses/${id}`, {
        credentials: "include", // Include cookies
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedAnalysis(data.analysis.requirements);
        setSelectedAnalysisId(id);
        
        // Load share link if exists
        const shareResponse = await fetch(`/api/analyses/${id}/share`, {
          credentials: "include",
        });
        if (shareResponse.ok) {
          const shareData = await shareResponse.json();
          setShareToken(shareData.shareToken);
          setIsPublic(shareData.isPublic);
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to load analysis",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load analysis",
        variant: "destructive",
      });
    } finally {
      setLoadingAnalysis(null);
      dispatch(setLoadingMessage(null));
    }
  };

  const toggleComparison = async (id: string) => {
    const newSelected = new Set(selectedForComparison);
    if (newSelected.has(id)) {
      newSelected.delete(id);
      setComparisonAnalyses(prev => prev.filter(a => a.id !== id));
    } else {
      newSelected.add(id);
      try {
        const response = await fetch(`/api/analyses/${id}`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          const analysis = analyses.find(a => a.id === id);
          setComparisonAnalyses(prev => [...prev, {
            id,
            name: analysis?.documentName || "Unknown",
            requirements: data.analysis.requirements,
          }]);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load analysis for comparison",
          variant: "destructive",
        });
      }
    }
    setSelectedForComparison(newSelected);
  };

  const handleDownloadJSON = () => {
    if (selectedAnalysis) {
      const filename = selectedAnalysis.metadata?.documentName
        ? `${selectedAnalysis.metadata.documentName.replace(/\.[^/.]+$/, "")}_requirements.json`
        : "brd_requirements.json";
      downloadJSON(selectedAnalysis, filename);
    }
  };

  const handleDownloadPDF = () => {
    if (selectedAnalysis) {
      downloadPDF(selectedAnalysis);
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/");
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-40 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold"><Link href="/">DocuMind</Link></span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user.name || user.email.split("@")[0]}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {user.plan} Plan
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {user.aiCallsUsed} / {user.aiCallsLimit} analyses
              </div>
              <Link href="/analyze">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Analysis
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-40 py-8">
        {!selectedAnalysis ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <History className="h-8 w-8" />
                  Analysis History
                </h1>
                <p className="text-muted-foreground mt-2">
                  View and access your previous BRD analyses
                </p>
              </div>
              {comparisonAnalyses.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedForComparison(new Set());
                    setComparisonAnalyses([]);
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear Comparison ({comparisonAnalyses.length})
                </Button>
              )}
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                      <div className="h-3 bg-muted animate-pulse rounded w-1/2 mt-2" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : analyses.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No analyses yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start analyzing your first BRD document
                  </p>
                  <Link href="/analyze">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Analysis
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <>
                {comparisonAnalyses.length > 0 ? (
                  <AnalysisComparison
                    analyses={comparisonAnalyses}
                    onRemove={(id) => {
                      setSelectedForComparison(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(id);
                        return newSet;
                      });
                      setComparisonAnalyses(prev => prev.filter(a => a.id !== id));
                    }}
                  />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analyses.map((analysis) => (
                  <Card
                    key={analysis.id}
                        className={`cursor-pointer hover:border-primary transition-colors ${
                          selectedForComparison.has(analysis.id) ? "border-primary border-2" : ""
                        }`}
                    onClick={() => loadAnalysis(analysis.id)}
                  >
                    <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                      <CardTitle className="line-clamp-2">{analysis.documentName}</CardTitle>
                      <CardDescription>
                        {formatDate(new Date(analysis.createdAt))}
                      </CardDescription>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleComparison(analysis.id);
                                }}
                              >
                                <GitCompare className={`h-4 w-4 ${
                                  selectedForComparison.has(analysis.id) ? "text-primary" : ""
                                }`} />
                              </Button>
                            </div>
                          </div>
                    </CardHeader>
                        <CardContent className="space-y-2">
                      <Button
                        className="w-full"
                        variant="outline"
                        disabled={loadingAnalysis === analysis.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          loadAnalysis(analysis.id);
                        }}
                      >
                        {loadingAnalysis === analysis.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "View Analysis"
                        )}
                      </Button>
                          {selectedForComparison.has(analysis.id) && (
                            <Button
                              className="w-full"
                              variant="secondary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleComparison(analysis.id);
                              }}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Remove from Comparison
                            </Button>
                          )}
                    </CardContent>
                  </Card>
                ))}
              </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => {
                setSelectedAnalysis(null);
                setSelectedAnalysisId(null);
                setShareToken(null);
                setIsPublic(false);
              }}>
                ← Back to History
              </Button>
            </div>
            <Tabs defaultValue="analysis" className="w-full">
              <TabsList>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="share">Share</TabsTrigger>
              </TabsList>
              <TabsContent value="analysis" className="space-y-6">
            <ResultsDisplay
              requirements={selectedAnalysis}
              onDownloadJSON={handleDownloadJSON}
              onDownloadPDF={handleDownloadPDF}
            />
              </TabsContent>
              <TabsContent value="share" className="space-y-6">
                {selectedAnalysisId && (
                  <ShareAnalysis
                    analysisId={selectedAnalysisId}
                    analysisName={selectedAnalysis?.metadata?.documentName || "Analysis"}
                    isPublic={isPublic}
                    shareToken={shareToken || undefined}
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}

