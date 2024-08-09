import { Request, Response, NextFunction } from "express";
import prisma from "../../client";
import { IImages, IStreetCatImages } from "../../types/streetCat";
import { addImage, createFavoritCat, createPost, createStreetCatImages, deleteImages, deletePost, deleteStreetCatImages, readPost, readStreetCatImages } from "../../model/streetCat.model";
import { Prisma } from "@prisma/client";

// CHECKLIST
// [ ] 페이지네이션 구현
// [ ] 썸네일 어떻게 받아올지
// [ ] 에러 처리

// NOTE uuid 받아오는 임시함수
export const getUuid = async () => {
  const result = await prisma.$queryRaw<{"uuid": Buffer}[]>(
    Prisma.sql`SELECT uuid FROM users WHERE id = 1`
  )

  return result[0]['uuid'];
};

// 동네 고양이 도감 목록 조회
export const getStreetCats = async (req: Request, res: Response) => {
  // TODO: 동네 고양이 페이지네이션, 좋아요
};

// 동네 고양이 도감 상세 조회
export const getStreetCat = async (req: Request, res: Response) => {
  // TODO: 좋아요, 조회수, 댓글 추가
  const postId = Number(req.params.street_cat_id);

  try {
    const getPost = await readPost(postId);



    res.status(200).json(getPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// 동네 고양이 도감 생성
export const createStreetCat = async (req: Request, res: Response) => {
  const { name, gender, neutered, discoveryDate, locationId, content, images } = req.body;
  // 임시 데이터
  const categoryId = 5;
  const uuid = await getUuid();

  const postData = {categoryId, name, gender, neutered, discoveryDate, locationId, content, uuid};

  try {
    await prisma.$transaction(async (tx) => {
      // 도감 게시글 생성
      const newPost = await createPost(tx, postData);

      // 도감 이미지 생성
      if (images.length) {
        // images 데이터 생성
        const createImages = await Promise.all (
          images.map((url: string) => addImage(tx, url))
        );

        // 생성한 image_id, post_id 받기
        const getStreetCatImages = createImages.map((image: IImages) => ({
          imageId: image.imageId,
          postId: newPost.postId
        }));

        // street_cat_images 데이터 생성
        await createStreetCatImages(tx, getStreetCatImages);
      }

      res.status(201).json({ message: "동네 고양이 도감 생성" });
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 동네 고양이 도감 수정
export const updateStreetCat = (req: Request, res: Response) => {
  // 삭제하거나 추가한 이미지 처리
  // -> 1. 수정 전 이미지 상태 확인
  // -> 2. 추가할 이미지와 삭제할 이미지 목록 정리/처리
  // -> 3. DB 반영
  

  res.send("동네 고양이 도감 수정");
};

// 동네 고양이 도감 삭제
export const deleteStreetCat = async (req: Request, res: Response) => {
  // TODO: 로그인한 유저와 게시글 작성 유저가 같은지 판별 필요
  const uuid = await getUuid();
  const postId = Number(req.params.street_cat_id);

  try {
    await prisma.$transaction(async (tx) => {
      const getStreetCatImages = await readStreetCatImages(postId);
      const deleteImageIds = getStreetCatImages.map(image => image.imageId);

      await deleteStreetCatImages(tx, postId);

      await deleteImages(tx, deleteImageIds);      

      await deletePost(tx, postId, uuid);

      // status 204는 message가 보내지지 않아 임시로 200
      res.status(200).json({ message: "동네 고양이 도감 삭제" });
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 동네 고양이 도감 즐겨찾기(내 도감) 추가 
export const addFavoritCat = async (req: Request, res: Response) => {
  const uuid = await getUuid();
  const postId = Number(req.params.street_cat_id);
  try {
    await createFavoritCat(uuid, postId);
    
    res.status(200).json({ message: "내 도감 추가" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// 동네 고양이 도감 즐겨찾기(내 도감) 삭제
export const removeFavoritCat = async (req: Request, res: Response) => {
  
}