import { Prisma } from "@prisma/client";

export const deleteTags = async (
  tx: Prisma.TransactionClient,
  tagIds: number[]
) => {
  return await tx.tags.deleteMany({
    where: {
      tag_id: {
        in: tagIds,
      },
    },
  });
};

export const addTag = async (tx: Prisma.TransactionClient, tag: string) => {
  return await tx.tags.create({
    data: {
      tag,
    },
  });
};
