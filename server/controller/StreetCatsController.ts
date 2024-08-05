import { Request, Response, NextFunction } from "express";
import prisma from "../client";

// 동네 고양이 도감 목록 조회
export const getStreetCats = async (req: Request, res: Response) => {
  // prisma test
  try {
    const test = await prisma.testString.findMany();
    res.status(200).json(test);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// 동네 고양이 도감 상세 조회
export const getStreetCat = (req: Request, res: Response) => {
  res.send('동네 고양이 도감 상세 조회');
}

// 동네 고양이 도감 생성
export const createStreetCat = (req: Request, res: Response) => {
  res.send('동네 고양이 도감 생성');
}

// 동네 고양이 도감 수정
export const updateStreetCat = (req: Request, res: Response) => {
  res.send('동네 고양이 도감 수정');
}

// 동네 고양이 도감 삭제
export const deleteStreetCat = (req: Request, res: Response) => {
  res.send('동네 고양이 도감 삭제');
}

// TODO: 동네 고양이 도감 즐겨찾기(내 도감) 추가