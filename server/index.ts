import express, { Request, Response } from "express";
import connection from "./mariadb";
import * as dotenv from "dotenv";

dotenv.config();

const getTestString = (req: Request, res: Response) => {
  const sql = "SELECT * FROM TestString";
  
  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json(err);
    } else {
      console.log(results);
      res.json(results);
    }
  });
};

const testApp = () => {
  const router = express.Router();
  router.use(express.json());
  router.get("", getTestString);

  const app = express();
  app.use("", router);

  app.listen(Number(process.env.PORT),"0.0.0.0", () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
};

testApp();