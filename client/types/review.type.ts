export interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  verified: boolean;
  reaction:ReviewReaction  
}

export enum ReviewReaction {
  SATISFIED = "Satisfied",
  UNSATISFIED = "Unsatisfied",
}