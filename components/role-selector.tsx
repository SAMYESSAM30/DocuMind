"use client";

import { RoleType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface RoleSelectorProps {
  selectedRoles: RoleType[];
  onRoleChange: (roles: RoleType[]) => void;
  availableRoles?: RoleType[];
}

const allRoles: RoleType[] = [
  "frontend",
  "backend",
  "business",
  "ui-design",
  "devops",
  "qa",
  "database",
  "security",
  "mobile",
  "other",
];

export function RoleSelector({ selectedRoles, onRoleChange, availableRoles }: RoleSelectorProps) {
  const { t } = useTranslation();
  const rolesToShow = availableRoles || allRoles;

  const toggleRole = (role: RoleType) => {
    if (selectedRoles.includes(role)) {
      onRoleChange(selectedRoles.filter((r) => r !== role));
    } else {
      onRoleChange([...selectedRoles, role]);
    }
  };

  const selectAll = () => {
    onRoleChange([...rolesToShow]);
  };

  const clearAll = () => {
    onRoleChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">{t("translation:results.selectRole")}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {t("translation:results.selectRoleDescription")}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="text-xs text-primary hover:underline"
            type="button"
          >
            {t("translation:results.selectAll")}
          </button>
          <span className="text-xs text-muted-foreground">|</span>
          <button
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:underline"
            type="button"
          >
            {t("translation:results.clearAll")}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {rolesToShow.map((role) => {
          const isSelected = selectedRoles.includes(role);
          return (
            <Badge
              key={role}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all hover:scale-105",
                isSelected && "ring-2 ring-primary ring-offset-2"
              )}
              onClick={() => toggleRole(role)}
            >
              {t(`translation:results.roles.${role}`) || role}
            </Badge>
          );
        })}
      </div>
      {selectedRoles.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {t("translation:results.selectedRoles")}: {selectedRoles.length} {t("translation:results.of")} {rolesToShow.length}
        </p>
      )}
    </div>
  );
}

