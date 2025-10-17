export interface AdminUser {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  status: string | null;
  created_at: string;
}

export interface Video {
  id: number;
  title: string;
  date: string;
  status: string;
  thumbnail: string;
  url: string;
}
