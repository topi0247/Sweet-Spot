export type Post = {
  id: number;
  uuid: string;
  title: string;
  comment: string;
  url: string;
  postedBy: string;
  tags: string[];
};

export type User = {
  id: number;
  displayName: string;
  uuid: string;
};
