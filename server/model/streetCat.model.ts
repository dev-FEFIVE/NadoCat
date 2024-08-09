import { Prisma } from "@prisma/client";
import prisma from "../client"
import { IImages, IStreetCatImages, IStreetCatPost } from "../types/streetCat"

export const readPost = async (postId: number) => {
  const streetCatPost = await prisma.streetCats.findUnique({
    where: {
      postId: postId
    },
    select: {
      postId: true,
      categoryId: true,
      name: true,
      gender: true,
      neutered: true,
      discoveryDate: true,
      locationId: true,
      content: true,
      uuid: true,
      streetCatImages: {
        select: {
          images: {
            select: {
              imageId: true,
              url: true,
            }
          }
        }
      }
    },
  })

  if (!streetCatPost) return null;

  const steetCatImages = streetCatPost.streetCatImages.map((image) => ({
    imageId: image.images.imageId,
    url: image.images.url
  }))

  return {
    ...streetCatPost,
    streetCatImages: steetCatImages
  }
}

export const createPost = async (tx: Prisma.TransactionClient,{
  categoryId,
  name,
  gender,
  neutered,
  discoveryDate,
  locationId,
  content,
  uuid,
}: Omit<IStreetCatPost, "postId">) => {

  return await tx.streetCats.create({
    data: {
      categoryId,
      name,
      gender,
      neutered,
      discoveryDate: new Date(discoveryDate),
      locationId,
      content,
      uuid,
    },
  });
}

export const updatePost = async ({
  postId,
  categoryId,
  name,
  gender,
  neutered,
  discoveryDate,
  locationId,
  content,
  uuid,
}: IStreetCatPost) => {
  return await prisma.streetCats.update({
    where: {
      postId,
      uuid
    },
    data: {
      categoryId,
      name,
      gender,
      neutered,
      discoveryDate: new Date(discoveryDate),
      locationId,
      content,
    },
  });
}

export const deletePost = async (tx: Prisma.TransactionClient, postId: number, uuid: Buffer) => {
  return await tx.streetCats.delete({
    where: {
      postId,
      uuid
    }
  });
}

export const readStreetCatImages = async (postId: number) => {
  return await prisma.streetCatImages.findMany({
    where: {
      postId: postId,
    }
  });
}

export const createStreetCatImages = async (tx: Prisma.TransactionClient, streetCatImages: IStreetCatImages[]) => {
  await tx.streetCatImages.createMany({
    data: streetCatImages,
  });
}

export const deleteStreetCatImages = async (tx: Prisma.TransactionClient, postId: number) => {
  await tx.streetCatImages.deleteMany({
    where: {
      postId: postId,
    }
  });
}

export const addImage = async (tx: Prisma.TransactionClient, url: string) => {
  return await tx.images.create({
    data: {
      url,
    },
  });
};

export const deleteImages = async (
  tx: Prisma.TransactionClient,
  imageIds: number[]
) => {
  return await tx.images.deleteMany({
    where: {
      imageId: {
        in: imageIds,
      },
    },
  });
};

export const createFavoritCat = async (uuid: Buffer, postId: number) => {
  return await prisma.streetCatFavorites.create({
    data: {
      uuid,
      postId
    }
  })
}

// export const deleteFavoritCat = async (uuid: string, postId: number) => {
//   return await prisma.streetCatFavorites.delete({
//     where: {
//       uuid,
//       postId
//     }
//   })
// }