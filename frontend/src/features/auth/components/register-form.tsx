"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { register as registerAccount } from "../api/auth.api";
import {
  registerSchema,
  RegisterFormValues,
} from "../schemas/register.schema";
import { useAuth } from "../hooks/use-auth";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error?.message;

    if (typeof message === "string") {
      return message;
    }
  }

  return "Registration failed. Please try again.";
}

export function RegisterForm() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setSubmitError(null);

    try {
      const response = await registerAccount(values);
      setSession(response);
      router.push("/dashboard");
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        style={{
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h1>Register</h1>

        <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          Username
          <input
            type="text"
            autoComplete="username"
            {...register("username")}
          />
          {errors.username && (
            <span style={{ color: "#b00020" }}>{errors.username.message}</span>
          )}
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          Email
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <span style={{ color: "#b00020" }}>{errors.email.message}</span>
          )}
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          Password
          <input
            type="password"
            autoComplete="new-password"
            {...register("password")}
          />
          {errors.password && (
            <span style={{ color: "#b00020" }}>{errors.password.message}</span>
          )}
        </label>

        {submitError && (
          <p style={{ color: "#b00020" }} role="alert">
            {submitError}
          </p>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>
    </main>
  );
}
