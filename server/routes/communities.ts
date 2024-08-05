import express from "express";
import {
  getCommunities,
  getCommunity,
  createCommunity,
  deleteCommunity,
  updateCommunity,
  getComments,
  updateComment,
  deleteComment,
  createComment,
} from "../controller/Communities";

const router = express.Router();

router.get("/", getCommunities);

router.post("/", createCommunity);

router.get("/:community_id", getCommunity);

router.put("/:community_id", updateCommunity);

router.delete("/:community_id", deleteCommunity);

router.get("/:community_id/comments", getComments);

router.post("/:community_id/comments", createComment);

router.put("/:community_id/comments/:comment_id", updateComment);

router.delete("/:community_id/comments/:comment_id", deleteComment);

export default router;
