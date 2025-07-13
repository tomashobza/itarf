"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Users } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/Button";
import { getTraitById, voteOnTrait } from "@/lib/firestore";
import { TraitType } from "@/lib/types";

const ResultChip = ({
  result,
  percentage,
}: {
  result: "red" | "green" | "neutral";
  percentage: number;
}) => {
  const configs = {
    red: {
      bg: "bg-red-500",
      text: "text-white",
      label: "🚩 Red Flag",
      border: "border-red-500",
    },
    green: {
      bg: "bg-green-500",
      text: "text-white",
      label: "💚 Green Flag",
      border: "border-green-500",
    },
    neutral: {
      bg: "bg-gray-400",
      text: "text-white",
      label: "😐 Neutral",
      border: "border-gray-400",
    },
  };

  const config = configs[result];

  return (
    <div
      className={`inline-flex items-center gap-1 px-4 py-2 rounded-full border-2 ${config.bg} ${config.text} ${config.border} font-bold text-lg`}
    >
      <span>{config.label}</span>
      <span className="text-sm opacity-90">({percentage.toFixed(0)}%)</span>
    </div>
  );
};

const StatBar = ({
  percentage,
  color,
  label,
  count,
}: {
  percentage: number;
  color: string;
  label: string;
  count: number;
}) => (
  <div className="flex items-center gap-2">
    <div className="text-lg font-bold w-8">{label}</div>
    <div className="flex-1 flex items-center gap-3">
      <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-sm font-bold text-right">
        {percentage.toFixed(0)}%
      </div>
      <div className="text-sm text-gray-600 text-right">({count})</div>
    </div>
  </div>
);

export default function TraitDetail() {
  const [trait, setTrait] = useState<TraitType | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const router = useRouter();
  const params = useParams();
  const traitId = params.traitId as string;

  useEffect(() => {
    if (traitId) {
      loadTrait();
    }
  }, [traitId]);

  const loadTrait = async () => {
    try {
      setLoading(true);
      const fetchedTrait = await getTraitById(traitId);
      setTrait(fetchedTrait);
    } catch (error) {
      console.error("Error loading trait:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteType: "redFlag" | "greenFlag" | "neutral") => {
    if (voting || hasVoted) return;

    try {
      setVoting(true);
      await voteOnTrait(traitId, voteType);
      setHasVoted(true);

      // Refresh the trait data to show updated vote counts
      await loadTrait();
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen p-4 md:p-20 flex flex-col justify-center items-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-rose-800 mb-2">
            Loading behavior...
          </h2>
          <p className="text-gray-600">Getting the community&apos;s judgment</p>
        </div>
      </div>
    );
  }

  if (!trait) {
    return (
      <div className="w-full min-h-screen p-4 md:p-20 flex flex-col justify-center items-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤷‍♀️</div>
          <h2 className="text-2xl font-bold text-rose-800 mb-2">
            Behavior not found
          </h2>
          <p className="text-gray-600 mb-6">
            This behavior doesn&apos;t exist or has been removed.
          </p>
          <Button onClick={() => router.back()}>
            <div className="flex font-semibold items-center gap-2">
              <ArrowLeft size={18} />
              Go Back
            </div>
          </Button>
        </div>
      </div>
    );
  }

  const total =
    trait.votes.redFlag + trait.votes.greenFlag + trait.votes.neutral;
  const redFlagPercentage = total > 0 ? (trait.votes.redFlag / total) * 100 : 0;
  const greenFlagPercentage =
    total > 0 ? (trait.votes.greenFlag / total) * 100 : 0;
  const neutralPercentage = total > 0 ? (trait.votes.neutral / total) * 100 : 0;

  // Determine the overwhelming result
  const getOverwhelmingResult = () => {
    if (total === 0) return { type: "neutral" as const, percentage: 0 };
    const max = Math.max(
      redFlagPercentage,
      greenFlagPercentage,
      neutralPercentage
    );
    if (max === redFlagPercentage)
      return { type: "red" as const, percentage: redFlagPercentage };
    if (max === greenFlagPercentage)
      return { type: "green" as const, percentage: greenFlagPercentage };
    return { type: "neutral" as const, percentage: neutralPercentage };
  };

  const overwhelmingResult = getOverwhelmingResult();

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
      <div className="max-w-4xl mx-auto w-full">
        {/* TRAIT CARD */}
        <div className="bg-rose-100 border-2 border-foreground rounded-3xl p-8 md:p-12 mb-8">
          <div className="text-center mb-8">
            {/* <h1 className="text-3xl md:text-4xl font-bold text-rose-800 mb-4">
              What do you think?
            </h1> */}
            <p className="text-2xl md:text-3xl font-semibold text-foreground leading-relaxed">
              &quot;{trait.text}&quot;
            </p>
          </div>

          {/* COMMUNITY RESULT */}
          {total > 0 && (
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-rose-800 mb-4">
                Community Verdict:
              </h2>
              <ResultChip
                result={overwhelmingResult.type}
                percentage={overwhelmingResult.percentage}
              />
            </div>
          )}

          <h2 className="text-xl text-center font-bold text-rose-800 mb-4">
            Cast Your Vote:
          </h2>

          {/* VOTE BUTTONS */}
          {!hasVoted ? (
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Button
                onClick={() => handleVote("redFlag")}
                disabled={voting}
                bgColor="bg-red-400"
                className="text-white p-6 rounded-2xl font-bold text-lg w-full"
              >
                <div className="flex flex-col items-center gap-2">
                  <span>🚩 Red Flag</span>
                </div>
              </Button>

              <Button
                onClick={() => handleVote("neutral")}
                disabled={voting}
                bgColor="bg-gray-400"
                className="text-white p-6 rounded-2xl font-bold text-lg w-full"
              >
                <div className="flex flex-col items-center gap-2">
                  <span>😐 Neutral</span>
                </div>
              </Button>

              <Button
                onClick={() => handleVote("greenFlag")}
                disabled={voting}
                bgColor="bg-green-500"
                className="text-white p-6 rounded-2xl font-bold text-lg w-full"
              >
                <div className="flex flex-col items-center gap-2">
                  <span>💚 Green Flag</span>
                </div>
              </Button>
            </div>
          ) : (
            <div className="text-center mb-8">
              <div className="bg-rose-200 border-2 border-rose-300 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-rose-800 mb-2">
                  Thanks for voting! 🗳️
                </h3>
                <p className="text-rose-700">
                  Your opinion has been recorded. Check out the updated results
                  below!
                </p>
              </div>
            </div>
          )}

          {/* STATS */}
          {total > 0 && (
            <div className="bg-white rounded-2xl p-4 md:p-6 border-2 border-rose-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-rose-800">
                  Detailed Results
                </h3>
                <div className="flex items-center gap-1 text-sm text-rose-600">
                  <Users size={16} />
                  <span>{total.toLocaleString()} total votes</span>
                </div>
              </div>

              <div className="space-y-4">
                <StatBar
                  percentage={redFlagPercentage}
                  color="bg-red-500"
                  label="🚩"
                  count={trait.votes.redFlag}
                />
                <StatBar
                  percentage={greenFlagPercentage}
                  color="bg-green-500"
                  label="💚"
                  count={trait.votes.greenFlag}
                />
                <StatBar
                  percentage={neutralPercentage}
                  color="bg-gray-400"
                  label="😐"
                  count={trait.votes.neutral}
                />
              </div>
            </div>
          )}

          {total === 0 && !hasVoted && (
            <div className="text-center">
              <p className="text-rose-700 text-lg">
                Be the first to vote on this behavior!
              </p>
            </div>
          )}
        </div>

        {/* CALL TO ACTION */}
        <div className="bg-gradient-to-r border-2 border-foreground from-rose-100 to-pink-100 rounded-3xl p-8 text-center flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-rose-800">
            Want to judge more behaviors? 🤔
          </h2>
          <p className="text-rose-700 text-lg mb-6">
            Check out more dating behaviors from the community and share your
            wisdom!
          </p>
          <Button onClick={() => router.push("/explore")}>
            <div className="flex font-semibold items-center gap-2">
              Explore More Behaviors
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
