export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  full_name: string;
  email: string;
  password: string;
}

export interface CurrentUser {
  id: number;
  email: string;
  full_name: string;
  profile_picture?: string | null;
  role: "customer" | "admin";
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: CurrentUser;
}
