import express from "express";
import {
  getCommunities,
  getCommunity,
  createCommunity,
  deleteCommunity,
  updateCommunity,
} from "../controller/Communities";

const router = express.Router();

router.get("/", getCommunities);

router.post("/", createCommunity);

router.get("/:community_id", getCommunity);

router.put("/:community_id", updateCommunity);

router.delete("/:community_id", deleteCommunity);

export default router;
