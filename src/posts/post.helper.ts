import prisma from "../../prisma/prisma";

export const createSlug = (text: string): string => {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};

export const createTag = async (text: string) => {
  const tags = text.toLowerCase().split(","); // output: // ["javascript", " react"]
  let temp = [];

  if (tags.length === 1) {
    const tag = tags[0].replace(" ", "");
    const isExists = await prisma.tag.findFirst({
      where: {
        name: tag,
      },
    });

    if (!isExists) {
      const newTag = await prisma.tag.create({
        data: {
          name: tag,
        },
      });
      temp.push({ id: newTag.id });
    } else {
      temp.push({ id: isExists.id });
    }
  } else {
    for (let tag of tags) {
      tag = tag.replace(" ", "");
      const isExists = await prisma.tag.findFirst({
        where: {
          name: tag,
        },
      });

      if (!isExists) {
        const newTag = await prisma.tag.create({
          data: {
            name: tag,
          },
        });

        temp.push({ id: newTag.id });
      } else {
        temp.push({ id: isExists.id });
      }
    }
  }

  return temp;
};

// export const createTag = async (text: string) => {
//   const tags = text.toLowerCase().split(","); // ["javascript", " react"]
//   let temp: ITag[] = [];
//   if (tags.length === 1) {
//     const tag = tags[0].replace(" ", "")
//     temp.push({name: tag})
//   } else {
//     for (let tag of tags) {
//       // replace spaces on string
//       tag = tag.replace(" ", "");
//       const isExists = await prisma.tag.findFirst({
//         where: {
//           name: tag,
//         },
//       });

//       if (!isExists) {
//         temp.push({ name: tag });
//       } else {
//         continue;
//       }
//     }
//   }

//   return temp;
// };
