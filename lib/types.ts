export interface TraitVotesType {
  redFlag: number;
  greenFlag: number;
  neutral: number;
}

export interface TraitType {
  id: string;
  text: string;
  isApproved: boolean;
  votes: TraitVotesType;
}

export interface TraitWithTotalType extends TraitType {
  totalVotes: number;
}
