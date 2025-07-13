"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  TrendingUp,
  Clock,
  Heart,
  AlertTriangle,
  Minus,
} from "lucide-react";
import Trait from "@/components/Trait";
import Button from "@/components/Button";
import StartJudging from "@/components/StartJudging";
import { getTraits, getPopularTraits } from "@/lib/firestore";
import { TraitType } from "@/lib/types";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import Link from "next/link";

export default function Explore() {
  const [traits, setTraits] = useState<TraitType[]>([]);
  const [allFetchedTraits, setAllFetchedTraits] = useState<TraitType[]>([]); // For client-side pagination
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("popular"); // popular, recent, redFlags, greenFlags
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1); // For client-side pagination

  const PAGE_SIZE = 20;

  // Load traits on component mount
  useEffect(() => {
    loadInitialTraits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType]);

  const loadInitialTraits = async () => {
    setLoading(true);
    setTraits([]);
    setAllFetchedTraits([]);
    setLastDoc(null);
    setHasMore(true);
    setPage(1);

    try {
      let fetchedTraits: TraitType[] = [];

      switch (filterType) {
        case "popular":
          fetchedTraits = await getPopularTraits(100); // Fetch a larger batch
          setAllFetchedTraits(fetchedTraits);
          setTraits(fetchedTraits.slice(0, PAGE_SIZE));
          setHasMore(fetchedTraits.length > PAGE_SIZE);
          break;
        case "recent":
          const { traits: recentTraits, lastDoc: recentLastDoc } =
            await getTraits(PAGE_SIZE);
          fetchedTraits = recentTraits;
          setTraits(fetchedTraits);
          setLastDoc(recentLastDoc);
          setHasMore(!!recentLastDoc && fetchedTraits.length === PAGE_SIZE);
          break;
        case "redFlags":
          const popularForRed = await getPopularTraits(100);
          fetchedTraits = popularForRed.filter(
            (trait) =>
              trait.votes.redFlag > trait.votes.greenFlag &&
              trait.votes.redFlag > trait.votes.neutral
          );
          setAllFetchedTraits(fetchedTraits);
          setTraits(fetchedTraits.slice(0, PAGE_SIZE));
          setHasMore(fetchedTraits.length > PAGE_SIZE);
          break;
        case "greenFlags":
          const popularForGreen = await getPopularTraits(100);
          fetchedTraits = popularForGreen.filter(
            (trait) =>
              trait.votes.greenFlag > trait.votes.redFlag &&
              trait.votes.greenFlag > trait.votes.neutral
          );
          setAllFetchedTraits(fetchedTraits);
          setTraits(fetchedTraits.slice(0, PAGE_SIZE));
          setHasMore(fetchedTraits.length > PAGE_SIZE);
          break;
        case "neutral":
          const popularForNeutral = await getPopularTraits(100);
          fetchedTraits = popularForNeutral.filter(
            (trait) =>
              trait.votes.neutral >= trait.votes.redFlag &&
              trait.votes.neutral >= trait.votes.greenFlag
          );
          setAllFetchedTraits(fetchedTraits);
          setTraits(fetchedTraits.slice(0, PAGE_SIZE));
          setHasMore(fetchedTraits.length > PAGE_SIZE);
          break;
        default:
          fetchedTraits = await getPopularTraits(PAGE_SIZE);
          setTraits(fetchedTraits);
          setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading traits:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreTraits = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      if (filterType === "recent") {
        const { traits: newTraits, lastDoc: newLastDoc } = await getTraits(
          PAGE_SIZE,
          lastDoc || undefined
        );
        setTraits((prev) => [...prev, ...newTraits]);
        setLastDoc(newLastDoc);
        setHasMore(!!newLastDoc && newTraits.length === PAGE_SIZE);
      } else {
        // Client-side pagination for other filters
        const nextPage = page + 1;
        const newTraits = allFetchedTraits.slice(0, nextPage * PAGE_SIZE);
        setTraits(newTraits);
        setPage(nextPage);
        setHasMore(allFetchedTraits.length > nextPage * PAGE_SIZE);
      }
    } catch (error) {
      console.error("Error loading more traits:", error);
    } finally {
      setLoading(false);
    }
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
          <div className="flex gap-2 flex-wrap justify-center md:justify-end">
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
            {/* Neutral */}
            <Button
              onClick={() => handleFilterChange("neutral")}
              bgColor={filterType === "neutral" ? "bg-pink-400" : "bg-rose-300"}
            >
              <div className={`flex items-center gap-2 text-sm font-bold`}>
                <Minus size={16} />
                Neutral
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* TRAITS GRID */}
      {loading && traits.length === 0 ? (
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
              traitId={trait.id}
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
      {hasMore && (
        <div className="text-center mb-8 flex flex-col items-center gap-1">
          <Button onClick={loadMoreTraits} disabled={loading}>
            <div className="flex font-semibold items-center gap-2">
              {loading ? "Loading..." : "Load More Behaviors"}
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
        <Link href="/submit">
          <Button>
            <div className="flex font-semibold items-center gap-2">
              Submit a Behavior
            </div>
          </Button>
        </Link>
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
