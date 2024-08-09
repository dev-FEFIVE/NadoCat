import express from "express";
const router = express.Router();
router.use(express.json());

import {
  getStreetCats,
  getStreetCat,
  createStreetCat,
  updateStreetCat,
  deleteStreetCat,
  addFavoritCat
} from '../controller/streetCat/StreetCats';

// 동네 고양이 도감 목록 조회
router.get('/', getStreetCats);

// 동네 고양이 도감 상세 조회
router.get('/:street_cat_id', getStreetCat);

// 동네 고양이 도감 생성
router.post('/', createStreetCat);

// 동네 고양이 도감 수정
router.put('/:street_cat_id', updateStreetCat);

// 동네 고양이 도감 삭제
router.delete('/:street_cat_id', deleteStreetCat);

// 내 도감 목록 조회
// 내 도감 추가
// 내 도감 삭제

export default router;
