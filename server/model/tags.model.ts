import prisma from "../client";

export const deleteTags = async (tagIds: number[]) => {
  return await prisma.tags.deleteMany({
    where: {
      tag_id: {
        in: tagIds,
      },
    },
  });
};

export const addTag = async (tag: string) => {
  return await prisma.tags.create({
    data: {
      tag,
    },
  });
};
