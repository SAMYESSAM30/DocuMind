/**
 * Molecule: UserInfo Component
 * Displays user information
 */
import { User, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UserInfoProps {
  name?: string | null;
  email: string;
  plan: string;
  aiCallsUsed: number;
  aiCallsLimit: number;
}

export function UserInfo({
  name,
  email,
  plan,
  aiCallsUsed,
  aiCallsLimit,
}: UserInfoProps) {
  const displayName = name || email.split("@")[0];

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{displayName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>{email}</span>
        </div>
        <Badge variant="secondary" className="capitalize">
          {plan} Plan
        </Badge>
      </div>
      <div className="text-sm text-muted-foreground">
        {aiCallsUsed} / {aiCallsLimit} analyses
      </div>
    </div>
  );
}

