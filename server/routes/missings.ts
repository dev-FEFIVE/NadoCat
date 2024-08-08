import express from "express";
import { getMissings, getMissingFavorites, postMissingFavorites, deleteMissingFavorites } from "../controller/missing/Missings";

const router = express.Router();
router.use(express.json());

router.get("", getMissings);
router.get("/favorites", getMissingFavorites);
router.post("/favorites", postMissingFavorites);
router.delete("/favorites/:postId", deleteMissingFavorites);

export default router;