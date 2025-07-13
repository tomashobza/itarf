export type TraitType = {
  id: string;
  text: string;
  isApproved: boolean;
  votes: {
    redFlag: number;
    greenFlag: number;
    neutral: number;
  };
  createdAt: Date;
};

export type TraitWithTotalType = TraitType & {
  totalVotes: number;
};
