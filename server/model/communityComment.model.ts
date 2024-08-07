import prisma from "../client";

export const getCommunityComments = async (
  postId: number,
  limit: number,
  cursor: number | undefined
) => {
  return await prisma.community_comments.findMany({
    where: {
      community_id: postId,
    },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { community_comment_id: cursor } : undefined,
    orderBy: [
      {
        community_comment_id: "asc",
      },
    ],
    select: {
      community_comment_id: true,
      comment: true,
      users: {
        select: {
          id: true,
          user_id: true,
          nickname: true,
          profile_image: true,
        },
      },
    },
  });
};

export const addComment = async (
  postId: number,
  userId: string,
  comment: string
) => {
  return await prisma.community_comments.create({
    data: {
      user_id: userId,
      community_id: postId,
      comment,
    },
  });
};

export const updateCommentById = async (
  postId: number,
  userId: string,
  commentId: number,
  comment: string
) => {
  return await prisma.community_comments.update({
    where: {
      community_id: postId,
      community_comment_id: commentId,
      user_id: userId,
    },
    data: {
      comment,
    },
  });
};

export const deleteCommentById = async (
  postId: number,
  userId: string,
  commentId: number
) => {
  return await prisma.community_comments.delete({
    where: {
      community_id: postId,
      community_comment_id: commentId,
      user_id: userId,
    },
  });
};
