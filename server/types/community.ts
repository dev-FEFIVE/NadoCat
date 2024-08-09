export interface ICommunity {
  post_id: number;
  category_id: number;
  title: string;
  content: string | null;
  views: number;
  created_at: Date;
  updated_at: Date;
  users: IUser;
  community_images: ICommunityImage[] | [];
  community_tags: ICommunityTag[] | [];
}

export interface ICommunities {
  posts: ICommunity[];
  pagination: IPagination;
}

export interface ICommunityTag {
  tags: ITag;
}

interface IUser {
  id: number;
  uuid: Buffer; // 맞나..?
  nickname: string;
  profile_image: string | null;
}

export interface ITag {
  tag_id: number;
  tag: string;
}

export interface IPagination {
  nextCursor: number | null;
  totalCount: number;
}

export interface ICommunityImage {
  images: IImage;
}

export interface IImage {
  image_id: number;
  url: string;
}
