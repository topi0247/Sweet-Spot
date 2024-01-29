export type PostData = {
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

export type UserData = {
  id: number;
  displayName: string;
  uid: string;
};

export type OgpData = {
  title: string;
  image: string;
};
