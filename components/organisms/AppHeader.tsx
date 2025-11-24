/**
 * Organism: AppHeader Component
 * Main application header with navigation
 */
"use client";

import Link from "next/link";
import { FileText, History, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserInfo } from "../molecules/UserInfo";

interface AppHeaderUser {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  aiCallsUsed: number;
  aiCallsLimit: number;
}

interface AppHeaderProps {
  user: AppHeaderUser;
  onLogout: () => void;
}

export function AppHeader({ user, onLogout }: AppHeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-40 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">
              <Link href="/">DocuMind</Link>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <UserInfo
              name={user.name}
              email={user.email}
              plan={user.plan}
              aiCallsUsed={user.aiCallsUsed}
              aiCallsLimit={user.aiCallsLimit}
            />
            <Link href="/dashboard">
              <Button variant="ghost">
                <History className="mr-2 h-4 w-4" />
                History
              </Button>
            </Link>
            <Button variant="ghost" onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

