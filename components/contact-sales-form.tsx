"use client";

import { useState } from "react";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Mail, Building, Phone, MessageSquare, CheckCircle2 } from "lucide-react";

const contactSalesSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  company: Yup.string()
    .required("Company name is required")
    .min(2, "Company name must be at least 2 characters"),
  phone: Yup.string()
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, "Invalid phone number")
    .required("Phone number is required"),
  message: Yup.string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

interface ContactSalesFormProps {
  planName?: string;
  onSubmit?: (values: any) => Promise<void>;
}

export function ContactSalesForm({ planName = "Enterprise", onSubmit }: ContactSalesFormProps) {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        // Default submission handler
        const response = await fetch("/api/contact-sales", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
            planName,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }
      }

      toast({
        title: "Message Sent",
        description: "Our sales team will contact you shortly to discuss your Enterprise needs.",
      });

      setIsSubmitted(true);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-4">
        <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Message Sent Successfully!</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our sales team will contact you shortly to discuss your {planName} plan needs.
          </p>
        </div>
        <Link href="/analyze" className="block">
          <Button className="w-full">
            Continue to Analysis
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Contact Sales Team
        </CardTitle>
        <CardDescription>
          Fill out the form below and our sales team will contact you to discuss your {planName} plan needs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={{
            name: "",
            email: "",
            company: "",
            phone: "",
            message: "",
          }}
          validationSchema={contactSalesSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.name && touched.name ? "border-destructive" : ""
                  }`}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-sm text-destructive mt-1"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
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
                <label htmlFor="company" className="block text-sm font-medium mb-2">
                  <Building className="inline h-4 w-4 mr-1" />
                  Company Name <span className="text-destructive">*</span>
                </label>
                <Field
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Your Company"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.company && touched.company ? "border-destructive" : ""
                  }`}
                />
                <ErrorMessage
                  name="company"
                  component="div"
                  className="text-sm text-destructive mt-1"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Phone Number <span className="text-destructive">*</span>
                </label>
                <Field
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.phone && touched.phone ? "border-destructive" : ""
                  }`}
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-sm text-destructive mt-1"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  <MessageSquare className="inline h-4 w-4 mr-1" />
                  Message <span className="text-destructive">*</span>
                </label>
                <Field
                  id="message"
                  name="message"
                  as="textarea"
                  rows={4}
                  placeholder="Tell us about your requirements and how we can help..."
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
                    errors.message && touched.message ? "border-destructive" : ""
                  }`}
                />
                <ErrorMessage
                  name="message"
                  component="div"
                  className="text-sm text-destructive mt-1"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}

