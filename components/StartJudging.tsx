import React from "react";
import Button from "./Button";
import { Flag, PenSquare } from "lucide-react";
import Link from "next/link";

function StartJudging() {
  return (
    <div className="text-center bg-accent rounded-3xl p-8 text-foreground border-2 border-foreground flex flex-col items-stretch md:items-center">
      <h2 className="text-3xl font-bold mb-4">Ready to Start Judging?</h2>
      <p className="text-xl mb-8 opacity-90">
        Join the community helping navigate the dating world
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button bgColor="bg-pink-400">
          <div className="flex items-center gap-2 font-semibold">
            <Flag size={18} />
            <span>Start Voting</span>
          </div>
        </Button>
        <Link href="/submit" className="flex flex-col">
          <Button bgColor="bg-pink-200">
            <div className="flex items-center gap-2 font-semibold">
              <PenSquare size={18} />
              <span>Submit a Behavior</span>
            </div>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default StartJudging;
