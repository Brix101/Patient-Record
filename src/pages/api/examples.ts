// src/pages/api/examples.ts
import { env } from "@env/server.mjs";
import { Role } from "@prisma/client";
import { hashPassword } from "@utils/bcryptHash";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  const examples = await prisma.user.upsert({
    where: {
      email: env.EMAIL_SECRET,
    },
    update: {},
    create: {
      firstName: "john",
      lastName: "doe",
      role: Role.ADMIN,
      email: env.EMAIL_SECRET,
      password: await hashPassword({ password: env.TOKEN_SECRET }),
      image: "user.svg",
    },
  });

  console.log(examples);

  res.status(200).json({ msg: "hello" });
};

export default examples;
