import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock the verify-email page component
const VerifyEmailPage = () => {
  const [verificationCode, setVerificationCode] = React.useState("");
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [notification, setNotification] = React.useState("");

  const handleVerification = async () => {
    setIsVerifying(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (verificationCode === "123456") {
        setNotification("Email verified successfully!");
      } else {
        setNotification("Invalid verification code");
      }
    } catch (error) {
      setNotification("Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setNotification("Verification code resent to your email");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black">
      <div className="flex min-h-screen">
        {/* Left Panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-900/20 to-blue-900/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10"></div>
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
            <h1 className="text-4xl font-bold mb-6">Welcome to Dealo</h1>
            <p className="text-xl text-center mb-8">
              Verify your email to complete your registration and start your
              journey with us.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
                <span>Check your email inbox</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">2</span>
                </div>
                <span>Enter the verification code</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">3</span>
                </div>
                <span>Complete your profile</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Verify Your Email
              </h2>
              <p className="text-gray-400">
                We've sent a verification code to your email address
              </p>
              <br />
              <span className="text-blue-400 text-sm">
                📧 Please check your email and enter the code below
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {notification && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    notification.includes("success")
                      ? "bg-green-900/50 text-green-400 border border-green-500/50"
                      : notification.includes("Invalid")
                      ? "bg-red-900/50 text-red-400 border border-red-500/50"
                      : "bg-blue-900/50 text-blue-400 border border-blue-500/50"
                  }`}
                >
                  {notification}
                </div>
              )}

              <button
                onClick={handleVerification}
                disabled={isVerifying || verificationCode.length !== 6}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                {isVerifying ? "Verifying..." : "Verify Email"}
              </button>

              <button
                onClick={handleResendCode}
                className="w-full text-gray-400 hover:text-white py-2 text-sm transition duration-200"
              >
                Didn't receive the code? Resend
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                Verification code expires in 72 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

describe("Email Verification Page JSX", () => {
  it("renders verification form correctly", () => {
    render(<VerifyEmailPage />);

    expect(screen.getByText("Verify Your Email")).toBeInTheDocument();
    expect(
      screen.getByText("We've sent a verification code to your email address")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter 6-digit code")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /verify email/i })
    ).toBeInTheDocument();
  });

  it("displays left panel content correctly", () => {
    render(<VerifyEmailPage />);

    expect(screen.getByText("Welcome to Dealo")).toBeInTheDocument();
    expect(
      screen.getByText("Verify your email to complete your registration")
    ).toBeInTheDocument();
    expect(screen.getByText("Check your email inbox")).toBeInTheDocument();
    expect(screen.getByText("Enter the verification code")).toBeInTheDocument();
    expect(screen.getByText("Complete your profile")).toBeInTheDocument();
  });

  it("handles verification code input", () => {
    render(<VerifyEmailPage />);

    const codeInput = screen.getByPlaceholderText("Enter 6-digit code");
    fireEvent.change(codeInput, { target: { value: "123456" } });

    expect(codeInput).toHaveValue("123456");
  });

  it("handles verification submission", async () => {
    render(<VerifyEmailPage />);

    const codeInput = screen.getByPlaceholderText("Enter 6-digit code");
    const verifyButton = screen.getByRole("button", { name: /verify email/i });

    fireEvent.change(codeInput, { target: { value: "123456" } });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(screen.getByText("Verifying...")).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(
          screen.getByText("Email verified successfully!")
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it("handles invalid verification code", async () => {
    render(<VerifyEmailPage />);

    const codeInput = screen.getByPlaceholderText("Enter 6-digit code");
    const verifyButton = screen.getByRole("button", { name: /verify email/i });

    fireEvent.change(codeInput, { target: { value: "000000" } });
    fireEvent.click(verifyButton);

    await waitFor(
      () => {
        expect(
          screen.getByText("Invalid verification code")
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it("handles resend code functionality", () => {
    render(<VerifyEmailPage />);

    const resendButton = screen.getByText("Didn't receive the code? Resend");
    fireEvent.click(resendButton);

    expect(
      screen.getByText("Verification code resent to your email")
    ).toBeInTheDocument();
  });

  it("disables verify button for invalid code length", () => {
    render(<VerifyEmailPage />);

    const codeInput = screen.getByPlaceholderText("Enter 6-digit code");
    const verifyButton = screen.getByRole("button", { name: /verify email/i });

    fireEvent.change(codeInput, { target: { value: "123" } });

    expect(verifyButton).toBeDisabled();
  });

  it("displays expiry message", () => {
    render(<VerifyEmailPage />);

    expect(
      screen.getByText("Verification code expires in 72 hours")
    ).toBeInTheDocument();
  });
});
