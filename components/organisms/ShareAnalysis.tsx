/**
 * Organism: ShareAnalysis Component
 * Share analysis with others via shareable link
 */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  Globe,
  Lock,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ShareAnalysisProps {
  analysisId: string;
  analysisName: string;
  isPublic?: boolean;
  shareToken?: string;
}

export function ShareAnalysis({
  analysisId,
  analysisName,
  isPublic = false,
  shareToken,
}: ShareAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentShareToken, setCurrentShareToken] = useState(shareToken);
  const [isCurrentlyPublic, setIsCurrentlyPublic] = useState(isPublic);
  const { toast } = useToast();

  const shareUrl = currentShareToken
    ? `${window.location.origin}/shared/${currentShareToken}`
    : "";

  const handleCreateShareLink = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analyses/${analysisId}/share`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentShareToken(data.shareToken);
        setIsCurrentlyPublic(data.isPublic);
        toast({
          title: "Share link created",
          description: "Your analysis is now shareable",
        });
      } else {
        throw new Error("Failed to create share link");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create share link",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Share link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const handleTogglePublic = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analyses/${analysisId}/share`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          isPublic: !isCurrentlyPublic,
        }),
      });

      if (response.ok) {
        setIsCurrentlyPublic(!isCurrentlyPublic);
        toast({
          title: "Updated",
          description: `Analysis is now ${!isCurrentlyPublic ? "public" : "private"}`,
        });
      } else {
        throw new Error("Failed to update share settings");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update share settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeShare = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analyses/${analysisId}/share`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setCurrentShareToken(undefined);
        setIsCurrentlyPublic(false);
        toast({
          title: "Share link revoked",
          description: "The share link has been disabled",
        });
      } else {
        throw new Error("Failed to revoke share link");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke share link",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share Analysis
        </CardTitle>
        <CardDescription>
          Share "{analysisName}" with your team or make it publicly accessible
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!currentShareToken ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create a shareable link to allow others to view this analysis
            </p>
            <Button
              onClick={handleCreateShareLink}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Share2 className="mr-2 h-4 w-4" />
                  Create Share Link
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {isCurrentlyPublic ? (
                <Badge variant="default" className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  Public
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Private Link
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Share Link</label>
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(shareUrl, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="space-y-1">
                <p className="text-sm font-medium">Public Access</p>
                <p className="text-xs text-muted-foreground">
                  {isCurrentlyPublic
                    ? "Anyone with the link can view"
                    : "Only people with the link can view"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTogglePublic}
                disabled={loading}
              >
                {isCurrentlyPublic ? "Make Private" : "Make Public"}
              </Button>
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleRevokeShare}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Revoking...
                </>
              ) : (
                "Revoke Share Link"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

