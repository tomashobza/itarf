"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, CheckCircle, AlertCircle } from "lucide-react";
import Button from "@/components/Button";
import { submitTrait } from "@/lib/firestore";

export default function SubmitTrait() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 10) {
      setStatus("error");
      setError(
        "The behavior description is too short. Please provide more detail (at least 10 characters)."
      );
      return;
    }
    if (text.trim().length > 280) {
      setStatus("error");
      setError(
        "The behavior description is too long. Please keep it under 280 characters."
      );
      return;
    }

    setStatus("submitting");
    setError(null);

    try {
      await submitTrait(text);
      setStatus("success");
      setText(""); // Clear input on success
    } catch (err) {
      setStatus("error");
      setError("Something went wrong. Please try again later.");
      console.error("Error submitting trait:", err);
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setText("");
    setError(null);
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-20 flex flex-col justify-start">
      {/* BACK BUTTON */}
      <div className="mb-6">
        <Button onClick={() => router.back()}>
          <div className="flex font-semibold items-center gap-2">
            <ArrowLeft size={18} />
            Back
          </div>
        </Button>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-rose-100 border-2 border-foreground rounded-3xl p-8 md:p-12">
          {status === "success" ? (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-rose-800 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-rose-800 mb-2">
                Submission Received!
              </h1>
              <p className="text-rose-700 mb-6">
                Thanks for contributing! Your submission will be reviewed by our
                team before it appears on the site.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleReset}>
                  <div className="flex font-semibold items-center gap-2">
                    Submit Another One
                  </div>
                </Button>
                <Button
                  onClick={() => router.push("/explore")}
                  bgColor="bg-rose-300"
                >
                  <div className="flex font-semibold items-center gap-2">
                    Explore Behaviors
                  </div>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-rose-800 mb-4">
                  Submit a Behavior
                </h1>
                <p className="text-lg text-rose-700">
                  What dating behavior have you observed? Let the community be
                  the judge.
                </p>
              </div>

              <div className="mb-6">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder='e.g., "They never ask you any questions about yourself."'
                  className="w-full p-4 rounded-2xl border-2 border-rose-200 focus:border-rose-400 focus:outline-none bg-white text-lg resize-none"
                  rows={4}
                  maxLength={280}
                  disabled={status === "submitting"}
                />
                <p className="text-right text-sm text-rose-600 mt-2">
                  {text.length}/280
                </p>
              </div>

              {status === "error" && error && (
                <div className="bg-red-100 border-2 border-red-300 text-red-800 p-4 rounded-2xl mb-6 flex items-center gap-3">
                  <AlertCircle className="w-6 h-6" />
                  <p>{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={status === "submitting" || text.trim().length === 0}
                className="w-full p-4 rounded-2xl font-bold text-xl"
              >
                <div className="flex items-center justify-center gap-3">
                  {status === "submitting" ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Submit for Judgment
                    </>
                  )}
                </div>
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
