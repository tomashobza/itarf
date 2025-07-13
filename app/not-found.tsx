"use client";

import React from "react";
import { ArrowLeft, Heart, Home } from "lucide-react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen p-4 md:p-20 flex flex-col justify-center items-center">
      {/* MAIN ERROR SECTION */}
      <div className="w-full max-w-4xl rounded-4xl border-2 bg-rose-300 p-6 md:p-10 flex flex-col md:flex-row items-center mb-8">
        {/* ERROR CONTENT */}
        <div className="flex flex-col flex-grow justify-center items-center text-center">
          <div className="text-8xl md:text-9xl font-black mb-4 text-rose-800">
            404
          </div>
          <div className="text-3xl md:text-4xl font-bold mb-4 text-rose-800">
            Oops! That&apos;s a red flag! 🚩
          </div>
          <p className="text-lg md:text-xl text-rose-700 mb-6 max-w-2xl">
            This page ghosted you harder than your last Tinder match. It&apos;s
            nowhere to be found!
          </p>
        </div>
        {/* ERROR ILLUSTRATION */}
      </div>

      {/* FUNNY DATING BEHAVIORS SECTION */}
      <div className="bg-gradient-to-r border-2 border-foreground from-rose-100 to-pink-100 rounded-3xl p-8 mb-8 max-w-4xl w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-rose-800">
          While you&apos;re here, judge these behaviors instead:
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border-2 border-rose-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center border-2 border-foreground flex-shrink-0">
                <span className="text-xl">🚩</span>
              </div>
              <div>
                <p className="text-rose-800 font-medium">
                  Creates a 404 error page but doesn&apos;t fix the broken links
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                    RED FLAG
                  </span>
                  <span className="text-sm text-gray-500">87% agree</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-rose-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center border-2 border-foreground flex-shrink-0">
                <Heart size={20} className="text-foreground" />
              </div>
              <div>
                <p className="text-rose-800 font-medium">
                  Makes a cute 404 page to make you smile when you&apos;re lost
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    GREEN FLAG
                  </span>
                  <span className="text-sm text-gray-500">92% agree</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION BUTTONS */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Button onClick={() => router.push("/")} bgColor="bg-rose-400">
          <div className="flex font-semibold items-center gap-2">
            <Home size={18} />
            Back to Home
          </div>
        </Button>

        <Button onClick={() => router.back()}>
          <div className="flex font-semibold items-center gap-2">
            <ArrowLeft size={18} />
            Go Back
          </div>
        </Button>
      </div>

      {/* FOOTER MESSAGE */}
      <div className="text-center mt-8 text-rose-600">
        <p className="text-lg">
          Don&apos;t worry, getting lost happens to the best of us! 💕
        </p>
        <p className="text-sm mt-2 text-gray-500">
          Unlike your ex, this page actually tells you when something&apos;s
          wrong.
        </p>
      </div>
    </div>
  );
}
