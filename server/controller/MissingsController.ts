import prisma from "../client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


/**
 * TODO
 * 실종 고양이 전체 조회 게시판 
 * - [x] 전체 조회 API
 * - [x] 즐겨찾기 조회 API
 * - [x] 즐겨찾기 추가 API
 * - [x] 즐겨찾기 삭제 API
 */

const include = {
  board_categories: true,
  users: true,
  locations: true,
};

export const getMissings = async (req: Request, res: Response) => {
  try {
    const results = await prisma.missings.findMany({
      include: include,
    });
    res.json(results);
  } catch (error) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

/**
 * CHECKLIST
 * - [ ] users 인가 기능 업데이트되면 인가 적용하기
 * 
 */
export const getMissingFavorites = async (req: Request, res: Response) => {
  try {
    const favoriteId = await prisma.missing_favorites.findMany({
      where: {
        user_id: "test"
      }
    }).then((favorites) => favorites.map((favorite) => favorite.post_id));

    const results = await prisma.missings.findMany({
      where: {
        post_id: {
          in: favoriteId
        }
      },
      include: include,
    })
    res.json(results);
  } catch (error) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

/**
 * CHECKLIST
 * - [ ] users 인가 기능 업데이트되면 인가 적용하기
 * 
 */

export const postMissingFavorites = async (req: Request, res: Response) => {
  const postId = Number(req.body.post_id);
  try {
    const result = await prisma.missing_favorites.create({
      data: {
        user_id: "test",
        post_id: postId,
      }
    });
    res.json(result);
  } catch (error) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
  }
};

/**
 * CHECKLIST
 * - [ ] users 인가 기능 업데이트되면 인가 적용하기
 * - [ ] delete 메서드 스타일에 대한 합의
 */

export const deleteMissingFavorites = async (req: Request, res: Response) => {
  const postId = Number(req.params.postId);
  console.log(postId);
  try {
    const result = await prisma.missing_favorites.deleteMany({
      where: {
        // missing_favorite_id: undefined,
        user_id: "test",
        post_id: postId
      }
    })
    res.json(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(StatusCodes.BAD_REQUEST);
  }
};