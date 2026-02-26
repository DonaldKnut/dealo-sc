"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { SiGoogle } from "react-icons/si";
import Link from "next/link";
import { useNotification } from "@/components/ui/Notification";
import { validateEmail, validatePassword, validateName } from "@/lib/validation";
import AuthInput from "@/components/ui/AuthInput";

interface ModernAuthFormProps {
  showSignUp?: boolean;
  initialError?: string | null;
  initialMessage?: string | null;
}

const ModernAuthForm = ({
  showSignUp = false,
  initialError = null,
  initialMessage = null,
}: ModernAuthFormProps) => {
  const router = useRouter();
  const { addNotification } = useNotification();
  const [isClient, setIsClient] = useState(false);
  const [isSignUp, setIsSignUp] = useState(showSignUp);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  // LinkedIn OAuth disabled; keep for future use so no ReferenceError if any stale ref remains
  const isLinkedInLoading = false;
  const [authAvailable, setAuthAvailable] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState<{
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
  }>({});

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize notifications from props
  useEffect(() => {
    if (!isClient) return;

    const mapNextAuthError = (code: string) => {
      switch (code) {
        case "OAuthAccountNotLinked":
          return "This email is already linked to a different sign-in method. Please sign in using the originally connected provider or reset your password.";
        case "CredentialsSignin":
          return "Invalid email or password. Please try again.";
        case "Configuration":
          return "Authentication is not configured correctly. Please try again later.";
        case "AccessDenied":
          return "Access denied. Please ensure you have permission to sign in.";
        case "Verification":
          return "Verification failed or expired. Please request a new link.";
        default:
          return code;
      }
    };

    const mapMessage = (msg: string) => {
      switch (msg) {
        case "NoAccount":
          return "We couldn&apos;t find an account for that email. You can create one now.";
        default:
          return msg;
      }
    };

    if (initialError) {
      addNotification({
        title: "Authentication Error",
        message: mapNextAuthError(initialError),
        type: "error",
      });
    } else if (initialMessage) {
      if (initialMessage === "NoAccount") {
        setIsSignUp(true);
      }
      addNotification({
        title: initialMessage === "NoAccount" ? "No Account" : "Information",
        message: mapMessage(initialMessage),
        type: initialMessage === "NoAccount" ? "error" : "info",
      });
    }
  }, [isClient, initialError, initialMessage, addNotification]);

  // Check NextAuth provider availability
  useEffect(() => {
    if (!isClient) return;
    let cancelled = false;
    const checkProviders = async () => {
      try {
        const res = await fetch("/api/auth/providers", { cache: "no-store" });
        if (!res.ok) throw new Error("Providers endpoint unavailable");
        const providers = await res.json();
        const hasAny = providers && Object.keys(providers).length > 0;
        if (!cancelled) {
          setAuthAvailable(!!hasAny);
          if (!hasAny) {
            addNotification({
              title: "Service Unavailable",
              message:
                "Authentication is currently unavailable. Please try again later.",
              type: "error",
            });
          }
        }
      } catch (err) {
        if (!cancelled) {
          setAuthAvailable(false);
          addNotification({
            title: "Configuration Error",
            message:
              "Authentication is not configured. Please contact support or try again later.",
            type: "error",
          });
        }
      }
    };
    checkProviders();
    return () => {
      cancelled = true;
    };
  }, [isClient, addNotification]);

  // Check for email verification message
  useEffect(() => {
    if (!isClient) return;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const message = urlParams.get("message");
      if (message === "email-verified") {
        addNotification({
          title: "Success",
          message: "Email verified successfully! Please sign in to continue.",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error parsing URL params:", error);
    }
  }, [isClient, addNotification]);

  // Show loading state during SSR
  if (!isClient) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/20 rounded-lg"></div>
          <div className="h-4 bg-white/20 rounded-lg"></div>
          <div className="h-12 bg-white/20 rounded-lg"></div>
          <div className="h-12 bg-white/20 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOAuthSignIn = async (provider: "google") => {
    if (!isClient) return;
    if (!authAvailable) {
      addNotification({
        title: "Service Unavailable",
        message:
          "Authentication is unavailable right now. Please try again later.",
        type: "error",
      });
      return;
    }

    if (provider === "google") setIsGoogleLoading(true);

    try {
      // Use redirect flow to ensure state/pkce cookies are correctly set
      await signIn(provider, {
        callbackUrl: "/complete-profile",
        redirect: true,
      });
      return;
    } catch (error) {
      console.error(`${provider} sign-in exception:`, error);
      addNotification({
        title: "Error",
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setTimeout(() => {
        if (provider === "google") setIsGoogleLoading(false);
      }, 800);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isClient) return;

    // Client-side validation
    if (isSignUp) {
      const errors: typeof validationErrors = {};

      // Validate first name
      const firstNameValidation = validateName(formData.firstName);
      if (!firstNameValidation.valid) {
        errors.firstName = firstNameValidation.errors;
      }

      // Validate last name
      const lastNameValidation = validateName(formData.lastName);
      if (!lastNameValidation.valid) {
        errors.lastName = lastNameValidation.errors;
      }

      // Validate email
      if (!validateEmail(formData.email)) {
        errors.email = ["Invalid email address format"];
      }

      // Validate password
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.valid) {
        errors.password = passwordValidation.errors;
      }

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        addNotification({
          title: "Validation Error",
          message: "Please fix the errors in the form",
          type: "error",
        });
        return;
      }

      setValidationErrors({});
    } else {
      // Validate email for sign-in
      if (!validateEmail(formData.email)) {
        setValidationErrors({ email: ["Invalid email address format"] });
        addNotification({
          title: "Validation Error",
          message: "Please enter a valid email address",
          type: "error",
        });
        return;
      }
      setValidationErrors({});
    }

    setIsFormLoading(true);

    try {
      if (isSignUp) {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.toLowerCase().trim(),
            password: formData.password,
            dateOfBirth: new Date(1990, 0, 1),
          }),
        });

        const responseData = await response.json();

        if (!response.ok) {
          if (responseData.code === 11000) {
            addNotification({
              title: "Account Exists",
              message:
                "This email is already registered. Please sign in instead.",
              type: "error",
            });
            return;
          }
          throw new Error(responseData.message || "Registration failed");
        }

        addNotification({
          title: "Success",
          message:
            "Account created successfully! Please check your email for verification.",
          type: "success",
        });
        setTimeout(() => {
          router.push(
            `/verify-email-new?email=${encodeURIComponent(formData.email)}`
          );
        }, 2000);
      } else {
        // Pre-check if user exists and email verification state
        try {
          const checkRes = await fetch("/api/auth/check-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email }),
          });
          if (checkRes.ok) {
            const checkData = await checkRes.json();

            if (!checkData.exists) {
              addNotification({
                title: "No Account",
                message:
                  "No account found with this email. You can create one in seconds.",
                type: "error",
              });
              // Switch to sign up mode and reflect in URL
              setIsSignUp(true);
              try {
                const params = new URLSearchParams(window.location.search);
                params.set("signup", "true");
                window.history.replaceState(
                  {},
                  "",
                  `/sign-in?${params.toString()}`
                );
              } catch { }
              return; // Stop proceeding to signIn
            }

            if (checkData.degraded) {
              addNotification({
                title: "Service Under Maintenance",
                message: "Our authentication database is currently undergoing maintenance. Please try again in a few minutes.",
                type: "error",
              });
              return;
            }

            if (checkData.exists && checkData.isEmailVerified === false) {
              addNotification({
                title: "Email Not Verified",
                message:
                  "Please verify your email before signing in. Check your inbox for the verification code or we can resend it.",
                type: "error",
              });
              addNotification({
                title: "Verification email sent",
                message:
                  "We sent a new verification email. Enter the code at the verification page or sign in after verifying.",
                type: "info",
              });
              try {
                await fetch("/api/resend-verification", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: formData.email }),
                });
              } catch { }
              const params = new URLSearchParams(window.location.search);
              params.set("email", formData.email);
              router.push(`/verify-email-new?${params.toString()}`);
              return;
            }
          }
        } catch (precheckErr) {
          // Ignore precheck failure; proceed to signIn for canonical errors
        }

        if (!authAvailable) {
          addNotification({
            title: "Service Unavailable",
            message:
              "Authentication is unavailable right now. Please try again later.",
            type: "error",
          });
          return;
        }
        // Use NextAuth redirect flow so the session cookie is definitely established
        // before the next page loads (prevents needing to "sign in twice").
        addNotification({
          title: "Signing you in",
          message: "Redirecting...",
          type: "success",
        });
        await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          callbackUrl: "/complete-profile",
          redirect: true,
        });
        return;
      }
    } catch (error: any) {
      addNotification({
        title: "Error",
        message:
          error.message || "An unexpected error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-green-400 to-green-500 mb-4 tracking-tight leading-tight">
          {isSignUp ? "Create Your Account" : "Welcome Back"}
        </h1>
        <p className="text-gray-200 text-lg font-body opacity-80 leading-relaxed max-w-sm mx-auto">
          {isSignUp
            ? "Join thousands of professionals learning and growing together"
            : "Sign in to continue your learning journey"}
        </p>
      </motion.div>

      {/* OAuth Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="space-y-4 mb-8"
      >
        <button
          type="button"
          onClick={() => handleOAuthSignIn("google")}
          disabled={
            isFormLoading ||
            isGoogleLoading ||
            !authAvailable
          }
          className="w-full relative group flex items-center justify-center gap-4 bg-white/5 backdrop-blur-md text-white py-4.5 px-6 rounded-2xl font-semibold border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-2xl"
        >
          {/* Subtle Hover Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {isGoogleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-green-400" />
          ) : (
            <SiGoogle className="text-2xl text-green-400 group-hover:scale-110 transition-transform duration-300" />
          )}
          <span className="relative z-10 tracking-wide uppercase text-xs">Continue with Google</span>
        </button>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-black/40 backdrop-blur-sm text-gray-300 rounded-full">
            or continue with email
          </span>
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {isSignUp && (
          <div className="grid grid-cols-2 gap-5">
            <AuthInput
              label="First Name"
              icon={User}
              type="text"
              value={formData.firstName}
              onChange={(e) => {
                handleInputChange("firstName", e.target.value);
                if (validationErrors.firstName) {
                  setValidationErrors((prev) => {
                    const next = { ...prev };
                    delete next.firstName;
                    return next;
                  });
                }
              }}
              placeholder="John"
              autoComplete="given-name"
              required={isSignUp}
              error={validationErrors.firstName}
            />
            <AuthInput
              label="Last Name"
              icon={User}
              type="text"
              value={formData.lastName}
              onChange={(e) => {
                handleInputChange("lastName", e.target.value);
                if (validationErrors.lastName) {
                  setValidationErrors((prev) => {
                    const next = { ...prev };
                    delete next.lastName;
                    return next;
                  });
                }
              }}
              placeholder="Doe"
              autoComplete="family-name"
              required={isSignUp}
              error={validationErrors.lastName}
            />
          </div>
        )}

        {/* Email Input */}
        <AuthInput
          label="Email Address"
          icon={Mail}
          type="email"
          value={formData.email}
          onChange={(e) => {
            handleInputChange("email", e.target.value);
            if (validationErrors.email) {
              setValidationErrors((prev) => {
                const next = { ...prev };
                delete next.email;
                return next;
              });
            }
          }}
          placeholder="you@example.com"
          autoComplete="email"
          required
          error={validationErrors.email}
        />

        {/* Password Input */}
        <div>
          <AuthInput
            label="Password"
            icon={Lock}
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => {
              handleInputChange("password", e.target.value);
              if (validationErrors.password) {
                setValidationErrors((prev) => {
                  const next = { ...prev };
                  delete next.password;
                  return next;
                });
              }
            }}
            placeholder={
              isSignUp
                ? "At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special"
                : "Enter your password"
            }
            autoComplete={isSignUp ? "new-password" : "current-password"}
            required
            error={validationErrors.password}
            showPasswordToggle={true}
            isPasswordVisible={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
          {isSignUp && formData.password && !validationErrors.password && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center gap-1.5 text-xs text-green-400"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Password strength: Good
            </motion.div>
          )}
        </div>

        {!isSignUp && (
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-green-500 bg-white/10 rounded focus:ring-green-500 focus:ring-offset-black/40"
              />
              <span className="ml-2 text-sm text-gray-300">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-green-400 hover:text-green-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.01, translateY: -2 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={
            isFormLoading ||
            isGoogleLoading ||
            !authAvailable
          }
          className="w-full relative group bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white py-5 px-6 rounded-2xl font-bold transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(34,197,94,0.3)] hover:shadow-[0_15px_40px_rgba(34,197,94,0.4)] overflow-hidden"
        >
          {/* Button Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

          {isFormLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="uppercase tracking-widest text-xs">{isSignUp ? "Creating Account..." : "Signing In..."}</span>
            </>
          ) : (
            <>
              <span className="uppercase tracking-widest text-xs">{isSignUp ? "Create Account" : "Sign In"}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </motion.button>
      </motion.form>

      {/* Toggle Sign In/Sign Up */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-center"
      >
        <p className="text-gray-200">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-green-400 hover:text-green-300 font-medium transition-colors hover:underline"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </motion.div>

      {/* Additional Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 pt-6 border-t border-white/10"
      >
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-300">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="text-green-400 hover:text-green-300 hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-green-400 hover:text-green-300 hover:underline"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ModernAuthForm;
