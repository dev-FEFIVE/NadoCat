import express from "express";
import { getMissings } from "../controller/missing/Missings";
import { getMissingFavorites, postMissingFavorites, deleteMissingFavorites } from "../controller/missing/MissingFavorites";

const router = express.Router();
router.use(express.json());

router.get("", getMissings);
router.get("/favorites", getMissingFavorites);
router.post("/favorites", postMissingFavorites);
router.delete("/favorites/:postId", deleteMissingFavorites);

export default router;