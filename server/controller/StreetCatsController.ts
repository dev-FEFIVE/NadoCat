import { Request, Response, NextFunction } from "express";
import prisma from "../client";

// 동네 고양이 도감 목록 조회
export const getStreetCats = async (req: Request, res: Response) => {
  // TODO: 동네 고양이 페이지네이션 붙여서 목록 조회 해야함 (DB이슈 해결 후)
};

// 동네 고양이 도감 상세 조회
export const getStreetCat = async (req: Request, res: Response) => {
  // TODO: 썸네일, 이미지 여러개 포함해서 불러오게 해야함 (DB이슈 해결 후)
  try {
    const streetCat = await prisma.street_cats.findMany();
    res.status(200).json(streetCat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 동네 고양이 도감 생성
export const createStreetCat = async (req: Request, res: Response) => {
  const { name, gender, neutered, discovery_date, location_id, content } =
    req.body;
  // 임시 데이터
  const category_id = 5;
  const user_id = "test";

  try {
    const createPost = await prisma.street_cats.create({
      data: {
        category_id,
        name,
        gender,
        neutered,
        discovery_date: new Date(discovery_date),
        location_id,
        content,
        user_id,
      },
    });
    res.status(201).json({ message: "동네 고양이 도감 생성" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 동네 고양이 도감 수정
export const updateStreetCat = (req: Request, res: Response) => {
  res.send("동네 고양이 도감 수정");
};

// 동네 고양이 도감 삭제
export const deleteStreetCat = (req: Request, res: Response) => {
  res.send("동네 고양이 도감 삭제");
};

// TODO: 동네 고양이 도감 즐겨찾기(내 도감) 추가
