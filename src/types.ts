export type Post = {
  id: number;
  comment: string;
  uuid: string;
  url: string;
  user_id: { displayName: string };
  created_at: string;
  genre: string;
};

export type User = {
  id: number;
  displayName: string;
  uuid: string;
};
