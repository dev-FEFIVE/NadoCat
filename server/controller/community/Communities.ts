import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../client";
import { Prisma } from "@prisma/client";
import {
  addCommunity,
  addCommunityTags,
  addCommunityImages,
  getCommunitiesCount,
  getCommunityById,
  getCommunityList,
  removeCommunityById,
  deleteCommunityImagesByImageIds,
  deleteCommunityTagByTagIds,
  updateCommunityById,
} from "../../model/community.model";
import { addImage, deleteImages } from "../../model/images.model";
import { addTag, deleteTags } from "../../model/tags.model";
import { IImage, ITag } from "../../types/community";

// CHECKLIST
// [x] 이미지 배열로 받아오게 DB 수정
// [x] 페이지네이션 추가
// [x] 최신순 정렬
// [x] 조회순 정렬
// [] 인기순 정렬
// [] 에러처리 자세하게 구현하기

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
    const count = await getCommunitiesCount();

    const communities = await getCommunityList(
      categoryId,
      limit,
      orderBy,
      cursor
    );

    const nextCursor =
      communities.length === limit
        ? communities[communities.length - 1].post_id
        : null;

    const result = {
      posts: communities,
      pagination: {
        nextCursor,
        totalCount: count,
      },
    };

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

// CHECKLIST
// [x] 이미지 배열로 받아오게 DB 수정
// [x] likes, liked 추가
// [] 에러처리 자세하게 구현하기

export const getCommunity = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.community_id);
    const categoryId = Number(req.query.category_id) || 1;
    const userId = "aaa"; // TODO 사용자 정보 받아오기 수정 필요

    const community = await getCommunityById(id, categoryId);

    if (!community) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "게시글을 찾을 수 없습니다." });
    }

    // 좋아요 수
    const likes = await prisma.likes.count({
      where: {
        post_id: id,
        category_id: categoryId,
      },
    });

    // 좋아요 여부
    const liked = await prisma.likes.findFirst({
      where: {
        post_id: id,
        category_id: categoryId,
        user_id: userId,
      },
    });

    const result = {
      ...community,
      likes,
      liked: !!liked,
    };

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// CHECKLIST
// [] 이미지 저장 구현 필요
// [x] 태그, 이미지 테이블 수정 필요(N:M 관계이므로 중간에 테이블 하나 필요함)
// [] 에러처리 자세하게 구현하기
// [] 사용자 정보 받아오는 부분 구현 필요

export const createCommunity = async (req: Request, res: Response) => {
  try {
    const { title, content, tags, images } = req.body;
    const categoryId = Number(req.query.category_id) || 1;
    const userId = "aaa"; // TODO 사용자 정보 받아오기 수정 필요

    await prisma.$transaction(async () => {
      const post = await addCommunity(userId, title, content, categoryId);

      if (tags.length > 0) {
        const newTags = await Promise.all(
          tags.map((tag: string) => addTag(tag))
        );

        const formatedTags = newTags.map((tag: ITag) => ({
          tag_id: tag.tag_id,
          post_id: post.post_id,
        }));
        await addCommunityTags(formatedTags);
      }

      if (images.length > 0) {
        const newImages = await Promise.all(
          images.map((url: string) => addImage(url))
        );

        const formatedImages = newImages.map((image: IImage) => ({
          image_id: image.image_id,
          post_id: post.post_id,
        }));

        await addCommunityImages(formatedImages);
      }
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: "게시글이 등록되었습니다." });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

// CHECKLIST
// [] 이미지 저장 구현 필요
// [x] 태그, 이미지 테이블 수정 필요(N:M 관계이므로 중간에 테이블 하나 필요함)
// [] 에러처리 자세하게 구현하기
// [] 사용자 정보 받아오는 부분 구현 필요
export const updateCommunity = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.community_id);
    const categoryId = Number(req.query.category_id) || 1;
    const userId = "aaa"; // TODO 사용자 정보 받아오기 수정 필요
    const {
      title,
      content,
      images,
      tags,
      newTags,
      deleteTagIds,
      newImages,
      deleteimageIds,
    } = req.body;

    if (
      !title ||
      !content ||
      !images ||
      !tags ||
      !newTags ||
      !deleteTagIds ||
      !newImages ||
      !deleteimageIds
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "입력값을 확인해 주세요." });
    }

    await prisma.$transaction(async () => {
      await updateCommunityById(id, userId, categoryId, title, content);

      await deleteCommunityTagByTagIds(deleteTagIds);

      await deleteTags(deleteTagIds);

      const tags = await Promise.all(newTags.map((tag: string) => addTag(tag)));

      const formatedTags = tags.map((tag: ITag) => ({
        tag_id: tag.tag_id,
        post_id: id,
      }));

      await addCommunityTags(formatedTags);

      await deleteCommunityImagesByImageIds(deleteimageIds);

      await deleteImages(deleteimageIds);

      const images = await Promise.all(
        newImages.map((url: string) => addImage(url))
      );

      const formatedImages = images.map((image: IImage) => ({
        image_id: image.image_id,
        post_id: id,
      }));

      await addCommunityImages(formatedImages);
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: "게시글이 수정되었습니다." });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

// CHECKLIST
// [] 에러처리 자세하게 구현하기
// [] 사용자 정보 받아오는 부분 구현 필요
// [x] 테이블 변경에 따른 태그, 이미지 삭제 수정
export const deleteCommunity = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.community_id);
    const categoryId = Number(req.query.category_id) || 1;
    const userId = "aaa"; // TODO 사용자 정보 받아오기 수정 필요

    await prisma.$transaction(async () => {
      const post = await getCommunityById(id, categoryId);

      if (!post) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "게시글을 찾을 수 없습니다." });
      }

      if (post.community_tags?.length) {
        const tagIds = post.community_tags.map((item: ITag) => item.tag_id);
        await deleteCommunityTagByTagIds(tagIds);
        await deleteTags(tagIds);
      }

      if (post.community_images?.length) {
        const imageIds = post.community_images.map(
          (item: IImage) => item.image_id
        );
        await deleteCommunityImagesByImageIds(imageIds);
        await deleteImages(imageIds);
      }

      await removeCommunityById(id, userId, categoryId);
    });

    res.status(StatusCodes.OK).json({ message: "게시글이 삭제되었습니다." });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "게시글이 존재하지 않습니다" });
      }
    }
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};
