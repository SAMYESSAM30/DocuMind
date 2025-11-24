"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Zap, Shield, Download, CheckCircle2, Sparkles, Database, History, ArrowRight } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";

export default function LandingPage() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const features = [
    {
      icon: FileText,
      title: "Multi-Format Support",
      description: "Upload PDF, Word (.doc, .docx), or Text (.txt) files seamlessly",
    },
    {
      icon: Zap,
      title: "AI-Powered Analysis",
      description: "Intelligent extraction using advanced AI models to understand your BRD",
    },
    {
      icon: Shield,
      title: "Comprehensive Extraction",
      description: "Get business, functional, non-functional, and role-based requirements",
    },
    {
      icon: Download,
      title: "Export Options",
      description: "Download results as JSON or PDF for further use",
    },
    {
      icon: Database,
      title: "Analysis History",
      description: "Access all your previous analyses anytime without re-processing",
    },
    {
      icon: History,
      title: "Smart Recommendations",
      description: "Get best practices and suggestions for each requirement",
    },
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "month",
      description: "Perfect for trying out the platform",
      features: [
        "5 AI analyses per month",
        "Basic requirement extraction",
        "JSON & PDF export",
        "Analysis history",
        "Email support",
      ],
      aiCalls: 5,
      popular: false,
    },
    {
      name: "Basic",
      price: "$9",
      period: "month",
      description: "For small teams and individual developers",
      features: [
        "50 AI analyses per month",
        "Advanced requirement extraction",
        "JSON & PDF export",
        "Unlimited analysis history",
        "Priority email support",
        "Role-based filtering",
      ],
      aiCalls: 50,
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "month",
      description: "For growing teams and agencies",
      features: [
        "200 AI analyses per month",
        "Premium AI models",
        "All Basic features",
        "API access",
        "Priority support",
        "Custom integrations",
      ],
      aiCalls: 200,
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Unlimited AI analyses",
        "Dedicated AI infrastructure",
        "All Pro features",
        "Custom AI model training",
        "Dedicated support",
        "SLA guarantee",
        "On-premise deployment",
      ],
      aiCalls: "Unlimited",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold"><Link href="/">DocuMind</Link></span>
            </div>
          <div className="flex items-center gap-4">
            {!loading && user ? (
              <Link href="/analyze">
                <Button>
                  Return to Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            AI-Powered Document Analysis
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Extract Technical Requirements
            <br />
            <span className="text-primary">Automatically</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your Business Requirements Documents into actionable technical requirements
            with AI-powered analysis. Save time and ensure nothing is missed.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            {!loading && user ? (
              <Link href="/analyze">
                <Button size="lg" className="text-lg px-8">
                  Go to Analysis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <Button size="lg" className="text-lg px-8">
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/analyze">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Try Demo
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to transform BRDs into technical requirements
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx}>
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include analysis history.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, idx) => (
            <Card
              key={idx}
              className={plan.popular ? "border-primary border-2 relative" : ""}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">/{plan.period}</span>}
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">AI Analyses</div>
                  <div className="text-2xl font-bold text-primary">{plan.aiCalls}</div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                {!loading && user ? (
                  <Link 
                    href={plan.name === "Free" ? "/analyze" : `/checkout?plan=${encodeURIComponent(plan.name)}`}
                    className="block mt-6"
                  >
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.name === "Free" ? "Go to Analysis" : "Subscribe Now"}
                    </Button>
                  </Link>
                ) : (
                  <Link href="/signup" className="block mt-6">
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of developers and teams who use DocuMind to streamline their workflow.
          </p>
          {!loading && user ? (
            <Link href="/analyze">
              <Button size="lg" className="text-lg px-8">
                Go to Analysis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 DocuMind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

