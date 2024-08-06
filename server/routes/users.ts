import express, { Router } from "express";
import signup from "../controller/UserController";
import conn from "../mariadb";

const router: Router = express.Router();

router.use(express.json());

//회원가입
router.post("/signup", signup);

export default router;