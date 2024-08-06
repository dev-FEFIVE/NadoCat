import express, { Request, Response } from "express";
import CommunitiesRouter from "./routes/communities";
import StreetCatsRouter from "./routes/streetCats";
import UserRouter from "./routes/users";

const PORT = process.env.PORT || 3000;
// const PORT = process.env.PORT || 3000;
console.log(PORT);

const app = express();
app.use(express.json());

app.use("/boards/communities", CommunitiesRouter);
app.use("/boards/street-cats", StreetCatsRouter);
app.use("/users", UserRouter);

app.use((_req: Request, res: Response) => {
  res.sendStatus(404);
});

app.use((error: any, _req: Request, res: Response) => {
  console.error(error);
  res.sendStatus(500);
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
