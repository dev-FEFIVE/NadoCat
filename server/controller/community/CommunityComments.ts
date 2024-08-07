import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../client";
import {
  addComment,
  deleteCommentById,
  getCommunityComments,
  updateCommentById,
} from "../../model/communityComment.model";

//  CHECKLIST
// [] model 코드 분리
// [] 에러처리 자세하게 구현하기
// [] 사용자 정보 받아오는 부분 구현 필요

export const getComments = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.community_id);
    const limit = Number(req.query.limit) || 5;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const count = await prisma.community_comments.count({
      where: {
        community_id: id,
      },
    });
    const comments = await getCommunityComments(id, limit, cursor);

    const nextCursor =
      comments.length === limit
        ? comments[comments.length - 1].community_comment_id
        : null;

    const result = {
      comments,
      pagination: {
        nextCursor,
        totalCount: count,
      },
    };

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.community_id);
    const comment = req.body.comment;
    const userId = "aaa"; // TODO 사용자 정보 받아오기 수정 필요

    if (!comment) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "입력값을 확인해 주세요." });
    }

    await addComment(id, userId, comment);

    res.status(StatusCodes.CREATED).json({ message: "댓글이 등록되었습니다." });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.community_id);
    const commentId = Number(req.params.comment_id);
    const comment = req.body.comment;
    const userId = "aaa"; // TODO 사용자 정보 받아오기 수정 필요

    if (!comment) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "입력값을 확인해 주세요." });
    }

    await updateCommentById(id, userId, commentId, comment);

    res.status(StatusCodes.OK).json({ message: "댓글이 수정되었습니다." });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.community_id);
    const commentId = Number(req.params.comment_id);
    const userId = "aaa"; // TODO 사용자 정보 받아오기 수정 필요

    await deleteCommentById(id, userId, commentId);

    res.status(StatusCodes.OK).json({ message: "댓글이 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};
