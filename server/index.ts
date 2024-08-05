import express, { Request, Response } from "express";
import prisma from "./client";
import missingRouter from "./routes/missings";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  const result = await prisma.testString.findMany();
  res.json(result);
});

app.use('/missings', missingRouter);

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
