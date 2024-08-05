import prisma from "../client";
import { Request, Response } from "express";

export const getMissings = async (req: Request, res: Response) => {
  const results = await prisma.missings.findMany({
    include: {
      board_categories: true,
      users: true
    }
  });
  console.log(results);
  const location = await prisma.locations.findUnique({ where: { location_id: results[0].location_id || undefined } });
  res.json(results);
  console.log(location);
};