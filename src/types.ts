export type Post = {
  id: number;
  comment: string;
  uuid: string;
  url: string;
  userName: string;
  created_at: string;
};

export type User = {
  id: number;
  displayName: string;
  uuid: string;
};
