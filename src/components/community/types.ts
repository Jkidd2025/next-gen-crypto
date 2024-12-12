export interface Comment {
  id: string;
  content: string;
  created_at: string;
  parent_id?: string;
  formatted_content?: any;
  mentions?: string[];
  profiles: {
    username: string | null;
    avatar_url: string | null;
  } | null;
  vote_count?: number;
  user_vote?: number;
}