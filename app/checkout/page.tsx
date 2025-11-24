"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/lib/hooks";
import { FileText, Loader2, ArrowLeft, CreditCard, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ContactSalesForm } from "@/components/contact-sales-form";

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

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  
  const planName = searchParams.get("plan");
  const selectedPlan = plans.find((p) => p.name === planName) || plans[0];

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/checkout${planName ? `?plan=${planName}` : ""}`);
    }
  }, [user, authLoading, router, planName]);

  const paymentSchema = Yup.object().shape({
    cardholderName: Yup.string()
      .required("Cardholder name is required")
      .min(2, "Name must be at least 2 characters"),
    cardNumber: Yup.string()
      .required("Card number is required")
      .matches(/^[0-9\s]{13,19}$/, "Invalid card number")
      .test("card-number", "Card number must be 13-19 digits", (value) => {
        if (!value) return false;
        const digitsOnly = value.replace(/\s/g, "");
        return digitsOnly.length >= 13 && digitsOnly.length <= 19;
      }),
    expiryDate: Yup.string()
      .required("Expiry date is required")
      .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiry date (MM/YY)")
      .test("expiry-date", "Card has expired", (value) => {
        if (!value) return false;
        const [month, year] = value.split("/");
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        const now = new Date();
        return expiry > now;
      }),
    cvv: Yup.string()
      .required("CVV is required")
      .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
  });

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handlePaymentSubmit = async (values: any, { setSubmitting }: any) => {
    // Simulate payment processing
    setTimeout(() => {
      setSubmitting(false);
      toast({
        title: "Payment Successful",
        description: `You have successfully subscribed to the ${selectedPlan.name} plan!`,
      });
      
      // Redirect to analyze page after successful payment
      setTimeout(() => {
        router.push("/analyze");
      }, 1500);
    }, 2000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">
              <Link href="/">DocuMind</Link>
            </span>
          </div>
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Payment Details</h1>
            <p className="text-muted-foreground mb-6">
              Complete your subscription to {selectedPlan.name} plan
            </p>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {selectedPlan.name === "Enterprise" ? "Contact Sales" : "Payment Information"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPlan.name === "Enterprise" ? (
                  <ContactSalesForm planName={selectedPlan.name} />
                ) : (
                  <Formik
                    initialValues={{
                      cardholderName: "",
                      cardNumber: "",
                      expiryDate: "",
                      cvv: "",
                    }}
                    validationSchema={paymentSchema}
                    onSubmit={handlePaymentSubmit}
                  >
                    {({ isSubmitting, errors, touched, setFieldValue, values }) => (
                      <Form className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Cardholder Name <span className="text-destructive">*</span>
                          </label>
                          <Field
                            name="cardholderName"
                            type="text"
                            placeholder="John Doe"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                              errors.cardholderName && touched.cardholderName ? "border-destructive" : ""
                            }`}
                          />
                          <ErrorMessage
                            name="cardholderName"
                            component="div"
                            className="text-sm text-destructive mt-1"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Card Number <span className="text-destructive">*</span>
                          </label>
                          <Field
                            name="cardNumber"
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const formatted = formatCardNumber(e.target.value);
                              setFieldValue("cardNumber", formatted);
                            }}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                              errors.cardNumber && touched.cardNumber ? "border-destructive" : ""
                            }`}
                          />
                          <ErrorMessage
                            name="cardNumber"
                            component="div"
                            className="text-sm text-destructive mt-1"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">
                              Expiry Date <span className="text-destructive">*</span>
                            </label>
                            <Field
                              name="expiryDate"
                              type="text"
                              placeholder="MM/YY"
                              maxLength={5}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const formatted = formatExpiryDate(e.target.value);
                                setFieldValue("expiryDate", formatted);
                              }}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                                errors.expiryDate && touched.expiryDate ? "border-destructive" : ""
                              }`}
                            />
                            <ErrorMessage
                              name="expiryDate"
                              component="div"
                              className="text-sm text-destructive mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">
                              CVV <span className="text-destructive">*</span>
                            </label>
                            <Field
                              name="cvv"
                              type="text"
                              placeholder="123"
                              maxLength={4}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const value = e.target.value.replace(/[^0-9]/g, "");
                                setFieldValue("cvv", value);
                              }}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                                errors.cvv && touched.cvv ? "border-destructive" : ""
                              }`}
                            />
                            <ErrorMessage
                              name="cvv"
                              component="div"
                              className="text-sm text-destructive mt-1"
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Complete Payment - {selectedPlan.price}
                              {selectedPlan.period && `/${selectedPlan.period}`}
                            </>
                          )}
                        </Button>
                      </Form>
                    )}
                  </Formik>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl">{selectedPlan.name} Plan</CardTitle>
                <CardDescription>{selectedPlan.description}</CardDescription>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="text-2xl font-bold">
                      {selectedPlan.price}
                      {selectedPlan.period && (
                        <span className="text-base text-muted-foreground">
                          /{selectedPlan.period}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">AI Analyses</span>
                    <span className="text-lg font-semibold text-primary">
                      {selectedPlan.aiCalls}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedPlan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="text-sm text-muted-foreground text-center">
              Your payment is secure and encrypted
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <CheckoutForm />
    </Suspense>
  );
}

