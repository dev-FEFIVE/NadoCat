import express, { Router } from "express";
const router: Router = express.Router();
import signup from "../controller/UserController";

router.use(express.json());

//회원가입
router.post("/signup", signup);

export default router;