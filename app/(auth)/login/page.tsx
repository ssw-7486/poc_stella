"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // MVP stub - just redirect to dashboard
    window.location.href = "/dashboard";
  };

  const handleSSOLogin = () => {
    // MVP stub - just redirect to dashboard
    window.location.href = "/dashboard";
  };

  return (
    <main className="flex min-h-screen">
      {/* Left Panel - Brand Section */}
      <section className="w-2/5 bg-navy text-white flex flex-col justify-center px-16">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2 tracking-tight">STELLA</h1>
          <div className="w-16 h-1 bg-green"></div>
        </div>

        {/* Tagline */}
        <p className="text-2xl mb-12 text-white/90">
          Making Data Management Simple
        </p>

        {/* Features List */}
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="mt-1.5">
              <svg
                className="w-5 h-5 text-green"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Automated OCR</h3>
              <p className="text-white/70 text-sm">
                Process handwritten and machine-printed documents with AI
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1.5">
              <svg
                className="w-5 h-5 text-green"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Smart Classification</h3>
              <p className="text-white/70 text-sm">
                Automatically route documents to the right workflow
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1.5">
              <svg
                className="w-5 h-5 text-green"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Human-in-the-loop</h3>
              <p className="text-white/70 text-sm">
                Review and validate with confidence thresholds
              </p>
            </div>
          </li>
        </ul>
      </section>

      {/* Right Panel - Login Form */}
      <section className="w-3/5 bg-card-bg flex flex-col justify-center px-20">
        <div className="max-w-md w-full mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h2 className="text-3xl font-bold text-navy mb-2">Welcome Back</h2>
            <p className="text-navy/60">Sign in to access your dashboard</p>
          </header>

          {/* SSO Button */}
          <Button
            variant="primary"
            fullWidth
            onClick={handleSSOLogin}
            className="mb-6"
          >
            Sign in with SSO
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-navy/20"></div>
            <span className="text-navy/50 text-sm">or</span>
            <div className="flex-1 h-px bg-navy/20"></div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" variant="secondary" fullWidth className="mt-6">
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <footer className="mt-8 text-center">
            <p className="text-navy/50 text-sm">MVP Demo v1.0</p>
          </footer>
        </div>
      </section>
    </main>
  );
}
