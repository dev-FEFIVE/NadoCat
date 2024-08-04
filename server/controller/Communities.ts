import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../client";

// TODO: 목록 조회 - 이미지 배열로 받아오게 수정(DB를 변경해야 함), ✅페이지네이션 추가, 정렬 추가(✅최신순, ✅조회순, 인기순)

const getOrderBy = (sort: string) => {
  switch (sort) {
    case "latest":
      return { sortBy: "created_at", sortOrder: "asc" };
    case "views":
      return { sortBy: "views", sortOrder: "desc" };
    case "likes":
      return { sortBy: "likes", sortOrder: "desc" }; // 테이블 수정 필요
    default:
      throw new Error("일치하는 정렬 기준이 없습니다.");
  }
};

export const getCommunities = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const sort = req.query.sort?.toString() ?? "latest";
    const orderBy = getOrderBy(sort);
    const categoryId = Number(req.query.category_id) || 1;
    const count = await prisma.communities.count();
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
          post_id: "asc",
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
          take: 1,
          select: {
            image_id: true,
            url: true,
          },
          orderBy: {
            image_id: "asc",
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

    const nextCursor =
      communities.length === limit
        ? communities[communities.length - 1].post_id
        : null;

    const result = {
      posts: communities,
      nextCursor,
      totalCount: count,
    };

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

// TODO: 상세 조회 - 이미지 배열로 받아오게 수정하기(DB를 변경해야 함),
export const getCommunity = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.community_id);
    const community = await prisma.communities.findUnique({
      where: {
        post_id: id,
        category_id: 1,
      },
      select: {
        post_id: true,
        category_id: true,
        title: true,
        content: true,
        views: true,
        created_at: true,
        updated_at: true,
        // thumbnail: true,
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
          orderBy: {
            image_id: "asc",
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
          orderBy: {
            tag_id: "asc",
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
