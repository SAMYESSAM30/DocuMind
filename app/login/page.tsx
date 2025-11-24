/**
 * Page: Login Page
 * Uses Atomic Design Pattern with Templates
 */
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthPageTemplate } from "@/components/templates/AuthPageTemplate";
import { Spinner } from "@/components/atoms/Spinner";
import { useAppSelector } from "@/lib/hooks";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const { loading, user } = useAppSelector((state) => state.auth);
  const expired = searchParams.get("expired") === "true";

  // Show loading if checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  // Don't render if user is logged in (will redirect via useAuth hook)
  if (user) {
    return null;
  }

  return (
    <AuthPageTemplate>
      <LoginForm expired={expired} />
    </AuthPageTemplate>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}

