/**
 * Login Form Component - Single Responsibility Principle
 * Handles login form UI and validation
 */
"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { loginSchema } from "@/lib/application/validators/AuthValidators";
import { useAuth } from "@/lib/application/hooks/useAuth";
import { OAuthButtons } from "./OAuthButtons";
import Link from "next/link";

interface LoginFormProps {
  expired?: boolean;
}

export function LoginForm({ expired }: LoginFormProps) {
  const { loading, handleLogin } = useAuth();

  const handleSubmit = async (
    values: { email: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    await handleLogin(values.email, values.password);
    setSubmitting(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl font-bold">
            <Link href="/">DocuMind</Link>
          </span>
        </div>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
        {expired && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>Your session has expired. Please login again.</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email <span className="text-destructive">*</span>
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.email && touched.email ? "border-destructive" : ""
                  }`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-destructive mt-1"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password <span className="text-destructive">*</span>
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.password && touched.password ? "border-destructive" : ""
                  }`}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-destructive mt-1"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
                {isSubmitting || loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </Form>
          )}
        </Formik>

        <OAuthButtons />

        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">Don&apos;t have an account? </span>
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

