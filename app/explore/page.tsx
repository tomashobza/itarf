import React from "react";
import { Search, TrendingUp, Clock, Heart, AlertTriangle } from "lucide-react";
import Trait from "@/components/Trait";
import Button from "@/components/Button";
import StartJudging from "@/components/StartJudging";

export default function Explore() {
  // Sample traits data with various stats
  const allTraits = [
    {
      text: "Takes 3+ hours to reply to texts but posts on social media",
      redFlag: 67,
      greenFlag: 12,
      neutral: 21,
    },
    {
      text: "Always splits the bill exactly down to the penny",
      redFlag: 34,
      greenFlag: 28,
      neutral: 38,
    },
    {
      text: "Remembers your coffee order after the second date",
      redFlag: 5,
      greenFlag: 78,
      neutral: 17,
    },
    {
      text: "Shows up 20 minutes late and doesn't apologize",
      redFlag: 89,
      greenFlag: 3,
      neutral: 8,
    },
    {
      text: "Asks about your ex on the first date",
      redFlag: 72,
      greenFlag: 8,
      neutral: 20,
    },
    {
      text: "Brings you soup when you're sick",
      redFlag: 2,
      greenFlag: 91,
      neutral: 7,
    },
    {
      text: "Never puts their phone down during dinner",
      redFlag: 84,
      greenFlag: 4,
      neutral: 12,
    },
    {
      text: "Remembers small details about your stories",
      redFlag: 3,
      greenFlag: 88,
      neutral: 9,
    },
    {
      text: "Only talks about themselves the entire date",
      redFlag: 93,
      greenFlag: 2,
      neutral: 5,
    },
    {
      text: "Insists on paying for everything",
      redFlag: 15,
      greenFlag: 42,
      neutral: 43,
    },
    {
      text: "Cancels plans last minute without explanation",
      redFlag: 79,
      greenFlag: 5,
      neutral: 16,
    },
    {
      text: "Sends good morning texts every day",
      redFlag: 18,
      greenFlag: 56,
      neutral: 26,
    },
  ];

  return (
    <div className="w-full min-h-full p-4 md:p-20 flex flex-col justify-start">
      {/* START JUDGING SECTION */}
      <StartJudging />

      {/* FILTERS AND SEARCH */}
      <div className="bg-gradient-to-r border-2 border-foreground from-rose-100 to-pink-100 rounded-3xl p-6 my-6 md:mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-grow max-w-md">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-600"
            />
            <input
              type="text"
              placeholder="Search behaviors..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-rose-200 focus:border-rose-400 focus:outline-none bg-white"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp size={16} />
                Most Popular
              </div>
            </Button>
            <Button>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} />
                Recent
              </div>
            </Button>
            <Button>
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle size={16} />
                Red Flags
              </div>
            </Button>
            <Button>
              <div className="flex items-center gap-2 text-sm">
                <Heart size={16} />
                Green Flags
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* EXPLORE HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-rose-800 mb-4">
          🔍 Explore All Behaviors
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Browse through all the dating behaviors our community has judged. See
          what&apos;s trending and discover new red flags you never thought of!
        </p>
      </div>

      {/* STATS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-4 border-2 border-rose-200 text-center">
          <div className="text-2xl font-bold text-rose-800">1,247</div>
          <div className="text-sm text-gray-600">Total Behaviors</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-rose-200 text-center">
          <div className="text-2xl font-bold text-red-600">687</div>
          <div className="text-sm text-gray-600">Red Flags</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-rose-200 text-center">
          <div className="text-2xl font-bold text-green-600">412</div>
          <div className="text-sm text-gray-600">Green Flags</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-rose-200 text-center">
          <div className="text-2xl font-bold text-gray-600">148</div>
          <div className="text-sm text-gray-600">Neutral</div>
        </div>
      </div>

      {/* TRAITS GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {allTraits.map((trait, index) => (
          <Trait
            key={index}
            text={trait.text}
            redFlag={trait.redFlag}
            greenFlag={trait.greenFlag}
            neutral={trait.neutral}
          />
        ))}
      </div>

      {/* LOAD MORE SECTION */}
      <div className="text-center mb-8 flex flex-col items-center gap-1">
        <Button>
          <div className="flex font-semibold items-center gap-2">
            Load More Behaviors
          </div>
        </Button>
        <p className="text-sm text-gray-500 mt-2">
          Showing 12 of 1,247 behaviors
        </p>
      </div>

      {/* SUBMIT YOUR OWN SECTION */}
      <div className="bg-gradient-to-r border-2 border-foreground from-rose-100 to-pink-100 rounded-3xl p-8 text-center flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-4 text-rose-800">
          Don&apos;t see your red flag? 🤔
        </h2>
        <p className="text-rose-700 text-lg mb-6 max-w-2xl mx-auto">
          Submit your own dating behavior and let the community decide if
          it&apos;s a red flag, green flag, or just another Tuesday in the
          dating world.
        </p>
        <Button>
          <div className="flex font-semibold items-center gap-2">
            Submit a Behavior
          </div>
        </Button>
      </div>

      {/* FOOTER */}
      <div className="text-center mt-8 text-rose-600">
        <p className="text-lg">
          The more you explore, the better your dating radar gets! 💕
        </p>
      </div>
    </div>
  );
}
