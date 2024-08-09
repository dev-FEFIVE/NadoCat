import { Prisma } from "@prisma/client";
import { IMissingCreate } from "../types/Missing";
import { IImageBridge } from "../types/image";

export const addMissing = async (
  tx: Prisma.TransactionClient,
  missing: IMissingCreate
) =>
  await tx.missings.create({
    data: missing
  });

export const addMissingImages = async (
  tx: Prisma.TransactionClient,
  images: IImageBridge[]
) =>
  await tx.missingImages.createMany({
    data: images
  });