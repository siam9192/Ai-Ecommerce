export interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  verified: boolean;
  reaction:ReviewReaction  
}

export interface ProductReview {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment: string | null;
  reaction_type: string | null;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
}

export enum ReviewReaction {
  SATISFIED = "Satisfied",
  UNSATISFIED = "Unsatisfied",
}