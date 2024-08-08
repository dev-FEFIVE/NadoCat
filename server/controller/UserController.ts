import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {StatusCodes} from "http-status-codes";
import dotenv from "dotenv";
dotenv.config();
import bcryto from "bcrypt";
// import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

const uuid = uuidv4();

const prisma = new PrismaClient();

//회원가입
const signup = async (req: Request, res: Response) => {
  const {email, nickname, password, authtype} = req.body;

  const hashing = async (password: string) => {
    const saltRound = 10; 
    const salt = await bcryto.genSalt(saltRound);

    const hashPassword = await bcryto.hash(password, salt);
    return {salt, hashPassword};
  }

  //DB저장
  try{
    const {salt, hashPassword} = await hashing(password);

    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.users.create({
        data: {
          user_id: uuid,
          email: email,
          nickname: nickname,
          auth_type: authtype,
          status: "active",  //default: active
        },
      });

      const secretUser = await prisma.user_secrets.create({
        data: {
          user_id: uuid,
          hash_password: hashPassword,
          salt: salt,
        },
      });

      return {user, secretUser};
    })


    if(result.user && result.secretUser){
      return res.status(StatusCodes.CREATED).json({
        message: "회원가입 성공!",
        user: {
          id: result.user.id,
          userId: result.user.user_id,
          email: result.user.email,
          nickname: result.user.nickname,
          authtype: result.user.auth_type
        }
      });
    }else{
      return res.status(StatusCodes.BAD_REQUEST).json({message: "회원가입 실패!"});
    }

  }catch(error){
    console.log("회원가입 error:", error);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

export default signup;