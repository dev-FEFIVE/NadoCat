import express from "express";
import { getMissings } from "../controller/MissingController";

const router = express.Router();
router.use(express.json());

router.get("", getMissings);

export default router;