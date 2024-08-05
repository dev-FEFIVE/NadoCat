import { Request, Response } from "express";
import { ResultSetHeader } from "mysql2";
import conn from "../mariadb";
import {StatusCodes} from "http-status-codes";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";


//회원가입
const signup = async (req: Request, res: Response) => {
  const {userid, email, nickname, password, authtype} = req.body;

  const userSql = "INSERT INTO users (user_id, email, nickname, auth_type) VALUES (?, ?, ?, ?)";
  const userValues = [userid, email, nickname, authtype];
  
  const salt = crypto.randomBytes(10).toString("base64");
  const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, "sha512").toString("base64");
  
  const secretSql = "INSERT INTO user_secrets (user_id, hash_password, salt) VALUES (?, ?, ?)";
  const secretValues = [userid, hashPassword, salt];

  //DB저장
  try{
    const [userResult] = await conn.promise().query<ResultSetHeader>(userSql, userValues);
    const [secretResult] = await conn.promise().query<ResultSetHeader>(secretSql, secretValues);

    if(userResult.affectedRows && secretResult.affectedRows){
      return res.status(StatusCodes.CREATED).json({message: "회원가입 성공!"});
    }else{
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

  }catch(error){
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

export default signup;