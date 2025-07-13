"use client";

import React, { useState, useEffect } from "react";
import { Search, TrendingUp, Clock, Heart, AlertTriangle } from "lucide-react";
import Trait from "@/components/Trait";
import Button from "@/components/Button";
import StartJudging from "@/components/StartJudging";
import { getTraits, getPopularTraits } from "@/lib/firestore";
import { TraitType } from "@/lib/types";

export default function Explore() {
  const [traits, setTraits] = useState<TraitType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("popular"); // popular, recent, redFlags, greenFlags
  const [stats, setStats] = useState({
    total: 0,
    redFlags: 0,
    greenFlags: 0,
    neutral: 0,
  });

  // Load traits on component mount
  useEffect(() => {
    loadTraits();
  }, [filterType]);

  const loadTraits = async () => {
    try {
      setLoading(true);
      let fetchedTraits = [];

      switch (filterType) {
        case "popular":
          fetchedTraits = await getPopularTraits(20);
          break;
        case "recent":
          fetchedTraits = await getTraits(20); // Default ordering
          break;
        case "redFlags":
          fetchedTraits = await getPopularTraits(50);
          // Filter for traits where red flag is the majority
          fetchedTraits = fetchedTraits
            .filter((trait) => {
              const total =
                trait.votes.redFlag +
                trait.votes.greenFlag +
                trait.votes.neutral;
              return total > 0 && trait.votes.redFlag / total > 0.5;
            })
            .slice(0, 20);
          break;
        case "greenFlags":
          fetchedTraits = await getPopularTraits(50);
          // Filter for traits where green flag is the majority
          fetchedTraits = fetchedTraits
            .filter((trait) => {
              const total =
                trait.votes.redFlag +
                trait.votes.greenFlag +
                trait.votes.neutral;
              return total > 0 && trait.votes.greenFlag / total > 0.5;
            })
            .slice(0, 20);
          break;
        default:
          fetchedTraits = await getPopularTraits(20);
      }

      setTraits(fetchedTraits);
      calculateStats(fetchedTraits);
    } catch (error) {
      console.error("Error loading traits:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (traitsData: TraitType[]) => {
    const totalBehaviors = traitsData.length;
    let redFlagsCount = 0;
    let greenFlagsCount = 0;
    let neutralCount = 0;

    traitsData.forEach((trait) => {
      const total =
        trait.votes.redFlag + trait.votes.greenFlag + trait.votes.neutral;
      if (total > 0) {
        const redPercent = trait.votes.redFlag / total;
        const greenPercent = trait.votes.greenFlag / total;
        const neutralPercent = trait.votes.neutral / total;

        if (redPercent > greenPercent && redPercent > neutralPercent) {
          redFlagsCount++;
        } else if (greenPercent > redPercent && greenPercent > neutralPercent) {
          greenFlagsCount++;
        } else {
          neutralCount++;
        }
      }
    });

    setStats({
      total: totalBehaviors,
      redFlags: redFlagsCount,
      greenFlags: greenFlagsCount,
      neutral: neutralCount,
    });
  };

  // Filter traits based on search term
  const filteredTraits = traits.filter((trait: TraitType) =>
    trait.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFilterChange = (newFilter: string) => {
    setFilterType(newFilter);
  };

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-rose-200 focus:border-rose-400 focus:outline-none bg-white"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => handleFilterChange("popular")}
              bgColor={filterType === "popular" ? "bg-pink-400" : "bg-rose-300"}
            >
              <div className={`flex items-center gap-2 text-sm font-bold`}>
                <TrendingUp size={16} />
                Most Popular
              </div>
            </Button>
            <Button
              onClick={() => handleFilterChange("recent")}
              bgColor={filterType === "recent" ? "bg-pink-400" : "bg-rose-300"}
            >
              <div className={`flex items-center gap-2 text-sm font-bold`}>
                <Clock size={16} />
                Recent
              </div>
            </Button>
            <Button
              onClick={() => handleFilterChange("redFlags")}
              bgColor={
                filterType === "redFlags" ? "bg-pink-400" : "bg-rose-300"
              }
            >
              <div className={`flex items-center gap-2 text-sm font-bold`}>
                <AlertTriangle size={16} />
                Red Flags
              </div>
            </Button>
            <Button
              onClick={() => handleFilterChange("greenFlags")}
              bgColor={
                filterType === "greenFlags" ? "bg-pink-400" : "bg-rose-300"
              }
            >
              <div className={`flex items-center gap-2 text-sm font-bold`}>
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
          <div className="text-2xl font-bold text-rose-800">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Behaviors</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-rose-200 text-center">
          <div className="text-2xl font-bold text-red-600">
            {stats.redFlags}
          </div>
          <div className="text-sm text-gray-600">Red Flags</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-rose-200 text-center">
          <div className="text-2xl font-bold text-green-600">
            {stats.greenFlags}
          </div>
          <div className="text-sm text-gray-600">Green Flags</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-rose-200 text-center">
          <div className="text-2xl font-bold text-gray-600">
            {stats.neutral}
          </div>
          <div className="text-sm text-gray-600">Neutral</div>
        </div>
      </div>

      {/* TRAITS GRID */}
      {loading ? (
        <div className="text-center my-6">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-rose-800 mb-2">
            Loading behaviors...
          </h2>
          <p className="text-gray-600">
            Getting the latest community judgments
          </p>
        </div>
      ) : filteredTraits.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredTraits.map((trait) => (
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
            No behaviors found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm
              ? `No behaviors match "${searchTerm}". Try a different search term.`
              : "No behaviors available yet. Be the first to submit one!"}
          </p>
          {searchTerm && (
            <Button onClick={() => setSearchTerm("")}>
              <div className="flex font-semibold items-center gap-2">
                Clear Search
              </div>
            </Button>
          )}
        </div>
      )}
      {/* LOAD MORE SECTION */}
      {filteredTraits.length > 0 && (
        <div className="text-center mb-8 flex flex-col items-center gap-1">
          <Button onClick={loadTraits}>
            <div className="flex font-semibold items-center gap-2">
              Load More Behaviors
            </div>
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            Showing {filteredTraits.length} behaviors
          </p>
        </div>
      )}

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
