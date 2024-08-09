import { Prisma } from "@prisma/client";
import { ILocation } from "../types/location";

export const addLocation = async (
  tx: Prisma.TransactionClient,
  location: ILocation
) =>
  await tx.locations.create({
    data: {
      ...location,
      detail: location.detail || ""
    },
  });