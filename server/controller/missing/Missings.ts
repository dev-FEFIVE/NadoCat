import prisma from "../../client";
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

export const getMissings = async (req: Request, res: Response) => {
  try {
    const results = await prisma.missings.findMany({
      include: {
        boardCategories: true,
        users: true,
        locations: true,
      },
    });
    res.json(results);
  } catch (error) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};