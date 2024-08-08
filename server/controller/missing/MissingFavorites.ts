import prisma from "../../client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const include = {
  board_categories: true,
  users: true,
  locations: true,
};

/**
 * CHECKLIST
 * - [ ] users 인가 기능 업데이트되면 인가 적용하기
 * 
 */
export const getMissingFavorites = async (req: Request, res: Response) => {
  try {
    const favoriteId = await prisma.missingFavorites.findMany({
      where: {
        uuid: Buffer.from(`0`)
      }
    }).then((favorites) => favorites.map((favorite) => favorite.postId));

    const results = await prisma.missings.findMany({
      where: {
        postId: {
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
  const uuid: number = 0;
  const postId: number = Number(req.body.postId);
  try {
    const result = await prisma.missingFavorites.create({
      data: {
        uuid: Buffer.from(`${uuid}`),
        postId: postId,
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

 */

export const deleteMissingFavorites = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const result = await prisma.missingFavorites.delete({
      where: {
        missingFavoriteId: id
      }
    })
    res.json(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(StatusCodes.BAD_REQUEST);
  }
};