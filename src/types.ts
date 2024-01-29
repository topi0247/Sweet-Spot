export type Post = {
  id: number;
  comment: string;
  uuid: string;
  url: string;
  user_id: { displayName: string; uid: string };
  created_at: string;
  genre: string;
  tags: string[];
  more_comment: string;
};

export type User = {
  id: number;
  displayName: string;
  uid: string;
};
