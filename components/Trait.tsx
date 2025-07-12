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
      <div className="ml-1 text-xs font-bold w-8">{percentage}%</div>
    </div>
  </div>
);

function Trait({
  text,
  redFlag,
  greenFlag,
  neutral,
  total,
}: {
  text: string;
  redFlag: number;
  greenFlag: number;
  neutral: number;
  total: number;
}) {
  return (
    <div className="bg-rose-100 transition-all border-foreground border-2 rounded-2xl p-6 flex flex-col">
      <div className="">
        <p className="text-lg font-semibold  text-foreground mb-4">
          &quot;{text}&quot;
        </p>
        <div className="flex justify-end items-center  gap-1 text-xs text-rose-600">
          <Users size={12} />
          <span>{total.toLocaleString()} votes</span>
        </div>
      </div>

      <hr className="mt-2 mb-3 border-rose-200 border-dashed" />

      <div className="">
        <StatBar percentage={redFlag} color="bg-primary" label="🚩" />
        <StatBar percentage={greenFlag} color="bg-secondary" label="💚" />
        <StatBar percentage={neutral} color="bg-rose-300" label="😐" />
      </div>
    </div>
  );
}

export default Trait;
