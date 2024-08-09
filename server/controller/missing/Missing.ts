import prisma from "../../client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

// post, get, delete, put

export const createMissing = async (req: Request, res: Response) => {
  try {
    const { catId, time, locationId, detail, locations } = req.body;

    const userId = "test";

    await prisma.$transaction(async () => {
      const formatedLocation = await addLocation()

      const post = await addMissing(userId,
        catId, time, locationId, detail)

    }
    });

}
};

export const addMissing = async (
  userId: string,
  catId: number,
  time: string,
  locationId: number,
  detail: string
) =>
  await prisma.missings.create({
    data: {
      uuid: Buffer.from(userId, "hex"),
      categoryId: 3,
      catId,
      time,
      locationId,
      detail
    }
  });


export const addLocation = async (
  longitude: number,
  latitude: number,
  detail: string
) =>
  await prisma.locations.create({
    data: {
      longitude,
      latitude,
      detail
    }
  });

