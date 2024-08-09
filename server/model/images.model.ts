import prisma from "../client";

export const deleteImages = async (imageIds: number[]) => {
  return await prisma.images.deleteMany({
    where: {
      image_id: {
        in: imageIds,
      },
    },
  });
};

export const addImage = async (url: string) => {
  return await prisma.images.create({
    data: {
      url,
    },
  });
};
