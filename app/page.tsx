"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Users, TrendingUp, Flag } from "lucide-react";
import Trait from "@/components/Trait";
import Button from "@/components/Button";
import StartJudging from "@/components/StartJudging";
import Link from "next/link";
import { getPopularTraits } from "@/lib/firestore";
import { TraitType } from "@/lib/types";

export default function Home() {
  const [recentTraits, setRecentTraits] = useState<TraitType[]>([]);
  const [loading, setLoading] = useState(true);

  // Load recent traits on component mount
  useEffect(() => {
    loadRecentTraits();
  }, []);

  const loadRecentTraits = async () => {
    try {
      setLoading(true);
      // Get 3 most popular traits for the homepage
      const fetchedTraits = await getPopularTraits(3);
      setRecentTraits(fetchedTraits);
    } catch (error) {
      console.error("Error loading recent traits:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-full p-4 md:p-20 flex flex-col justify-start">
      {/* HERO */}
      <div className="w-full md:h-full rounded-4xl border-2 bg-rose-300 p-6 md:p-10 flex flex-col md:flex-row items-center">
        {/* MAIN TEXT */}
        <div className="flex flex-col flex-grow justify-center items-center">
          <div className="text-6xl my-2 md:my-10 md:text-8xl font-black space-x-4">
            Is that a<br />
            red flag?
          </div>
        </div>
        {/* ILLUSTRATION */}
        <div className="p-4 md:p-0 grid place-items-center">
          <img
            src="/main_image.png"
            alt="Main Illustration"
            className="w-[80%] md:w-[25rem] h-auto"
          />
        </div>
      </div>

      {/* RECENTLY JUDGED SECTION */}
      <div className="my-6 md:my-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
          🔥 Recently Judged
        </h2>
        <p className="text-center text-gray-600 mb-6">
          See what the community is saying
        </p>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Loading skeleton */}
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="bg-rose-100 border-2 border-rose-200 rounded-2xl p-6 animate-pulse"
              >
                <div className="h-4 bg-rose-200 rounded mb-4"></div>
                <div className="h-4 bg-rose-200 rounded w-3/4 mb-6"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-rose-200 rounded"></div>
                  <div className="h-3 bg-rose-200 rounded"></div>
                  <div className="h-3 bg-rose-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recentTraits.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {recentTraits.map((trait) => (
              <Trait
                key={trait.id}
                text={trait.text}
                redFlag={trait.votes.redFlag}
                greenFlag={trait.votes.greenFlag}
                neutral={trait.votes.neutral}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤷‍♀️</div>
            <h3 className="text-2xl font-bold text-rose-800 mb-2">
              No behaviors yet
            </h3>
            <p className="text-gray-600 mb-6">
              Be the first to submit a dating behavior for the community to
              judge!
            </p>
          </div>
        )}

        <div className="text-center my-6 flex justify-center">
          <Link href="/explore">
            <Button>
              <div className="flex font-semibold items-center gap-2">
                Explore More <ArrowRight size={18} />
              </div>
            </Button>
          </Link>
        </div>
      </div>

      {/* WHAT IS THIS SECTION */}
      <div className="bg-gradient-to-r border-2 border-foreground from-rose-100 to-pink-100 rounded-3xl p-8 mb-6 md:mb-12">
        <h2 className="text-3xl font-bold text-center mb-6 text-rose-800">
          What is this?
        </h2>
        <p className="text-center text-rose-700 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
          Ever wondered if that behavior your date showed was actually a red
          flag? Now you can find out! Submit dating behaviors and let the crowd
          decide if they&apos;re red flags, green flags, or just neutral.
          It&apos;s like having thousands of friends give you dating advice -
          but more fun and less awkward.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center flex flex-row gap-y-2 gap-x-4 justify-start items-center md:flex-col">
            <div className="w-16 h-16 bg-rose-400 rounded-full flex items-center justify-center border-2 border-foreground flex-shrink-0">
              <Flag size={24} className="text-foreground" />
            </div>
            <div className="flex flex-col items-start md:items-center">
              <h3 className="text-lg font-bold text-rose-800">Submit</h3>
              <p className="text-rose-600 text-sm text-left md:text-center">
                Share behaviors you&apos;ve encountered
              </p>
            </div>
          </div>

          <div className="text-center flex flex-row gap-y-2 gap-x-4 justify-start items-center md:flex-col">
            <div className="w-16 h-16 bg-pink-400 rounded-full flex items-center justify-center border-2 border-foreground flex-shrink-0">
              <Users size={24} className="text-foreground" />
            </div>
            <div className="flex flex-col items-start md:items-center">
              <h3 className="text-lg font-bold text-rose-800">Vote</h3>
              <p className="text-rose-600 text-sm text-left md:text-center">
                Judge random behaviors from others
              </p>
            </div>
          </div>

          <div className="text-center flex flex-row gap-y-2 gap-x-4 justify-start items-center md:flex-col">
            <div className="w-16 h-16 bg-red-400 rounded-full flex items-center justify-center border-2 border-foreground flex-shrink-0">
              <TrendingUp size={24} className="text-foreground" />
            </div>
            <div className="flex flex-col items-start md:items-center">
              <h3 className="text-lg font-bold text-rose-800">Discover</h3>
              <p className="text-rose-600 text-sm text-left md:text-center">
                See what the crowd thinks
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <StartJudging />

      {/* FOOTER */}
      <div className="text-center mt-8 text-rose-600">
        <p className="text-lg">
          Because sometimes you need the internet to tell you the obvious 💕
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm mt-4 text-gray-500">
          <span>
            Made with ❤️ by{" "}
            <a
              href="https://tomashobza.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 transition-colors hover:text-blue-600"
            >
              Tomáš Hobza
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
