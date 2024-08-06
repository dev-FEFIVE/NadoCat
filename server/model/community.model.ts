import prisma from "../client";
import { ICommunity, ICommunityImage, ICommunityTag } from "../types/community";

export const getCommunitiesCount = async () => await prisma.communities.count();

export const getCommunityList = async (
  categoryId: number,
  limit: number,
  orderBy: { sortBy: string; sortOrder: string },
  cursor: number | undefined
) => {
  const communities = await prisma.communities.findMany({
    where: {
      category_id: categoryId,
    },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { post_id: cursor } : undefined,
    orderBy: [
      {
        [orderBy.sortBy]: orderBy.sortOrder,
      },
      {
        post_id: "desc",
      },
    ],

    select: {
      post_id: true,
      category_id: true,
      title: true,
      content: true,
      views: true,
      created_at: true,
      updated_at: true,
      users: {
        select: {
          id: true,
          user_id: true,
          nickname: true,
          profile_image: true,
        },
      },
      community_images: {
        select: {
          images: {
            select: {
              image_id: true,
              url: true,
            },
          },
        },
      },
      community_tags: {
        select: {
          tags: {
            select: {
              tag_id: true,
              tag: true,
            },
          },
        },
      },
    },
  });

  return communities.map((community: ICommunity) => {
    return {
      ...community,
      community_tags: community.community_tags.map(
        (item: ICommunityTag) => item.tags
      ),
      community_images: community.community_images.map(
        (item: ICommunityImage) => item.images
      ),
    };
  });
};

export const getCommunityById = async (postId: number, categoryId: number) => {
  const community = await prisma.communities.findUnique({
    where: {
      post_id: postId,
      category_id: categoryId,
    },
    select: {
      post_id: true,
      category_id: true,
      title: true,
      content: true,
      views: true,
      created_at: true,
      updated_at: true,
      users: {
        select: {
          id: true,
          user_id: true,
          nickname: true,
          profile_image: true,
        },
      },
      community_images: {
        select: {
          images: {
            select: {
              image_id: true,
              url: true,
            },
          },
        },
      },
      community_tags: {
        select: {
          tags: {
            select: {
              tag_id: true,
              tag: true,
            },
          },
        },
      },
    },
  });

  return {
    ...community,
    community_tags: community?.community_tags.map(
      (item: ICommunityTag) => item.tags
    ),
    community_images: community?.community_images.map(
      (item: ICommunityImage) => item.images
    ),
  };
};

export const addCommunity = async (
  userId: string,
  title: string,
  content: string,
  categoryId: number
) =>
  await prisma.communities.create({
    data: {
      user_id: userId,
      title,
      content,
      category_id: categoryId,
    },
  });

export const updateCommunityById = async (
  postId: number,
  userId: string,
  categoryId: number,
  title: string,
  content: string
) => {
  return await prisma.communities.update({
    where: {
      post_id: postId,
      user_id: userId,
      category_id: categoryId,
    },
    data: {
      title,
      content,
    },
  });
};

export const removeCommunityById = async (
  postId: number,
  userId: string,
  categoryId: number
) => {
  return await prisma.communities.delete({
    where: {
      post_id: postId,
      user_id: userId,
      category_id: categoryId,
    },
  });
};

export const addCommunityTags = async (
  tags: {
    post_id: number;
    tag_id: number;
  }[]
) => {
  return await prisma.community_tags.createMany({
    data: tags,
  });
};

export const addCommunityImages = async (
  images: {
    post_id: number;
    image_id: number;
  }[]
) => {
  return await prisma.community_images.createMany({
    data: images,
  });
};

export const deleteCommunityTagByTagIds = async (tagIds: number[]) => {
  return await prisma.community_tags.deleteMany({
    where: {
      tag_id: {
        in: tagIds,
      },
    },
  });
};

export const deleteCommunityTagByTagId = async (tagId: number) => {
  return await prisma.community_tags.delete({
    where: {
      tag_id: tagId,
    },
  });
};

export const deleteCommunityByPostIds = async (postIds: number[]) => {
  return await prisma.community_tags.deleteMany({
    where: {
      post_id: {
        in: postIds,
      },
    },
  });
};

export const deleteCommunityImagesByImageIds = async (imageIds: number[]) => {
  return await prisma.community_images.deleteMany({
    where: {
      image_id: {
        in: imageIds,
      },
    },
  });
};
