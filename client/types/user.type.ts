
export interface User {
  id: number;
  email: string;
  full_name: string;
  profile_picture?: string | null;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}