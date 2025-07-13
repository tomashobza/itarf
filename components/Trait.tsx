import { Users } from "lucide-react";
import React from "react";

const StatBar = ({
  percentage,
  color,
  label,
}: {
  percentage: number;
  color: string;
  label: string;
}) => (
  <div className="flex items-center gap-2">
    <div className="text-sm font-medium">{label}</div>
    <div className="flex-1 flex rounded-full h-4">
      <div
        className={`h-full ${color} transition-all rounded-full duration-500`}
        style={{ width: `${percentage}%` }}
      />
      <div className="ml-1 text-xs font-bold w-8">{percentage.toFixed(0)}%</div>
    </div>
  </div>
);

function Trait({
  text,
  redFlag,
  greenFlag,
  neutral,
}: {
  text: string;
  redFlag: number;
  greenFlag: number;
  neutral: number;
}) {
  const total = redFlag + greenFlag + neutral;
  const redFlagPercentage = (redFlag / total) * 100;
  const greenFlagPercentage = (greenFlag / total) * 100;
  const neutralPercentage = (neutral / total) * 100;

  const safeRedFlag = isNaN(redFlagPercentage) ? 0 : redFlagPercentage;
  const safeGreenFlag = isNaN(greenFlagPercentage) ? 0 : greenFlagPercentage;
  const safeNeutral = isNaN(neutralPercentage) ? 0 : neutralPercentage;

  return (
    <div className="bg-rose-100 transition-all hover:scale-[1.02] border-foreground border-2 rounded-2xl p-6 flex flex-col">
      <div className="flex flex-col flex-grow">
        <p className="text-lg font-semibold flex-grow text-foreground mb-4">
          &quot;{text}&quot;
        </p>
        <div className="flex justify-end items-center  gap-1 text-xs text-rose-600">
          <Users size={12} />
          <span>{total.toLocaleString()} votes</span>
        </div>
      </div>

      <hr className="mt-2 mb-3 border-foreground border-dashed" />

      <div className="">
        <StatBar percentage={safeRedFlag} color="bg-primary" label="🚩" />
        <StatBar percentage={safeGreenFlag} color="bg-secondary" label="💚" />
        <StatBar percentage={safeNeutral} color="bg-rose-300" label="😐" />
      </div>
    </div>
  );
}

export default Trait;
