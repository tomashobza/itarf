"use client";

import { TraitType } from "@/lib/types";
import { Users } from "lucide-react";

export const ResultChip = ({
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

export const StatBar = ({
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

export const VoteResults = ({ trait }: { trait: TraitType }) => {
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
    <div className="w-full">
      {/* COMMUNITY RESULT */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-rose-800 mb-4">
          Community Verdict:
        </h2>
        <ResultChip
          result={overwhelmingResult.type}
          percentage={overwhelmingResult.percentage}
        />
      </div>

      {/* STATS */}
      <div className="bg-white rounded-2xl p-4 md:p-6 border-2 border-rose-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-rose-800">Detailed Results</h3>
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
    </div>
  );
};
