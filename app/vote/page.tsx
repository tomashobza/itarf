"use client";

import { useState, useEffect } from "react";
import { getSingleRandomTrait, voteOnTrait } from "@/lib/firestore";
import { TraitType } from "@/lib/types";
import Button from "@/components/Button";
import { Loader2, Redo, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VoteResults } from "@/components/VoteResults";

export default function VotePage() {
  const [trait, setTrait] = useState<TraitType | null>(null);
  const [loading, setLoading] = useState(true);
  const [votedIds, setVotedIds] = useState<string[]>([]);
  const [allSeen, setAllSeen] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadNextTrait();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNextTrait = async (exclude: string[] = votedIds) => {
    setLoading(true);
    setShowStats(false);
    setAllSeen(false);
    try {
      const nextTrait = await getSingleRandomTrait(exclude);
      if (nextTrait) {
        setTrait(nextTrait);
      } else {
        setTrait(null);
        setAllSeen(true);
      }
    } catch (error) {
      console.error("Error fetching next trait:", error);
      // Optionally, handle the error in the UI
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteType: "redFlag" | "greenFlag" | "neutral") => {
    if (!trait || loading || showStats) return;

    const currentTraitId = trait.id;

    // Optimistically update the UI
    const updatedTrait = {
      ...trait,
      votes: {
        ...trait.votes,
        [voteType]: trait.votes[voteType] + 1,
      },
    };
    setTrait(updatedTrait);
    setShowStats(true);

    const newVotedIds = [...votedIds, currentTraitId];
    setVotedIds(newVotedIds);

    try {
      await voteOnTrait(currentTraitId, voteType);
      // Optionally, refetch to ensure data consistency, though optimistic update is usually enough
    } catch (error) {
      console.error("Error voting on trait:", error);
      // Handle failed vote, maybe revert optimistic update if needed
    }
  };

  const handleNext = () => {
    loadNextTrait();
  };

  const handleStartOver = () => {
    setVotedIds([]);
    loadNextTrait([]);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center">
          <Loader2 className="animate-spin text-rose-500 mx-auto" size={48} />
          <h2 className="text-2xl font-bold text-rose-800 mt-4">
            Finding a behavior...
          </h2>
        </div>
      );
    }

    if (allSeen) {
      return (
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-rose-800 mb-2">
            You&apos;ve judged them all!
          </h2>
          <p className="text-gray-600 mb-6">
            You&apos;ve seen all the current behaviors. Check back later for
            more or explore the results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleStartOver}>
              <div className="flex font-semibold items-center gap-2">
                <Redo size={18} />
                Start Over
              </div>
            </Button>
            <Link href="/explore">
              <Button variant="secondary">Explore Results</Button>
            </Link>
          </div>
        </div>
      );
    }

    if (trait) {
      return (
        <>
          <div className="bg-rose-100 border-2 border-foreground rounded-3xl p-8 md:p-12 mb-8 w-full">
            <p className="text-2xl md:text-3xl font-semibold text-center text-foreground leading-relaxed">
              &quot;{trait.text}&quot;
            </p>
          </div>

          {showStats ? (
            <div className="w-full flex flex-col items-center gap-6">
              <VoteResults trait={trait} />
              <Button onClick={handleNext} className="font-bold py-4 text-lg">
                Next Behavior
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <Button
                onClick={() => handleVote("redFlag")}
                bgColor="bg-rose-300"
                className="text-foreground font-bold py-6 text-xl"
              >
                🚩 Red Flag
              </Button>
              <Button
                onClick={() => handleVote("neutral")}
                bgColor="bg-gray-300"
                className="text-foreground font-bold py-6 text-xl"
              >
                😐 Neutral
              </Button>
              <Button
                onClick={() => handleVote("greenFlag")}
                bgColor="bg-green-300"
                className="text-foreground font-bold py-6 text-xl"
              >
                💚 Green Flag
              </Button>
            </div>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-20 flex flex-col justify-start items-center">
      <div className="w-full max-w-4xl">
        {/* BACK BUTTON */}
        <div className="mb-6">
          <Button onClick={() => router.back()}>
            <div className="flex font-semibold items-center gap-2">
              <ArrowLeft size={18} />
              Back
            </div>
          </Button>
        </div>

        <div className="w-full flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-rose-800 mb-8 text-center">
            Is it a Red Flag?
          </h1>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
