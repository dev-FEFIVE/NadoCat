import { Prisma } from "@prisma/client";
import { IMissingCreate } from "../types/Missing";

export const addMissing = async (
  tx: Prisma.TransactionClient,
  missing: IMissingCreate
) =>
  await tx.missings.create({
    data: missing
  });

