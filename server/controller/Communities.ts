import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../client";

// TODO: 목록 조회 - 이미지 배열로 받아오게 수정, 페이지네이션 추가
export const getCommunities = async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.query.category_id) || 1;
    const communities = await prisma.communities.findMany({
      where: {
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
        thumbnail: true,
        users: {
          select: {
            id: true,
            user_id: true,
            name: true,
            profile_image: true,
          },
        },
        images: {
          select: {
            image_id: true,
            url: true,
          },
        },
        tags: {
          select: {
            tag_id: true,
            tag: true,
          },
        },
      },
    });
    res.status(StatusCodes.OK).json(communities);
  } catch (error) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// TODO: 상세 조회 - 이미지 배열로 받아오게 수정하기
export const getCommunity = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.community_id);
    const community = await prisma.communities.findUnique({
      where: {
        post_id: id,
      },
      select: {
        post_id: true,
        category_id: true,
        title: true,
        content: true,
        views: true,
        created_at: true,
        updated_at: true,
        thumbnail: true,
        users: {
          select: {
            id: true,
            user_id: true,
            name: true,
            profile_image: true,
          },
        },
        images: {
          where: {
            post_id: id,
            category_id: 1,
          },
          select: {
            image_id: true,
            url: true,
          },
        },
        tags: {
          where: {
            post_id: id,
            category_id: 1,
          },
          select: {
            tag_id: true,
            tag: true,
          },
        },
      },
    });

    if (!community) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "존재하지 않는 게시글 입니다." });
    }

    res.status(StatusCodes.OK).json(community);
  } catch (error) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// TODO: 게시글 작성
export const createCommunity = async (req: Request, res: Response) => {
  res.json("게시글 작성");
};

// TODO: 게시글 수정
export const updateCommunity = async (req: Request, res: Response) => {
  res.json("게시글 수정");
};

// TODO: 게시글 삭제
export const deleteCommunity = async (req: Request, res: Response) => {
  res.json("게시글 삭제");
};
