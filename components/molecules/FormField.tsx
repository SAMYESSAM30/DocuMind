/**
 * Molecule: FormField Component
 * Combines Label, Input, and ErrorMessage
 */
"use client";

import { Field, ErrorMessage as FormikErrorMessage } from "formik";
import { Label } from "../atoms/Label";
import { ErrorMessage } from "../atoms/ErrorMessage";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
  touched?: boolean;
}

export function FormField({
  name,
  label,
  type = "text",
  placeholder,
  required,
  className,
  error,
  touched,
}: FormFieldProps) {
  return (
    <div>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={cn(
          "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
          error && touched ? "border-destructive" : "",
          className
        )}
      />
      <FormikErrorMessage
        name={name}
        render={(msg: string) => <ErrorMessage message={msg} />}
      />
    </div>
  );
}

